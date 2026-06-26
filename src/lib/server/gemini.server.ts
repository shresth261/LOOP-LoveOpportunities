import { GoogleGenAI } from "@google/genai";
import type { Profile } from "@/lib/local-store";
import type { Opportunity } from "@/lib/opportunities";
import { getOpportunitiesCollection } from "./db";

// Ensure the API key is available
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY environment variable is not set. Gemini features will fail.");
}

// Initialize the GoogleGenAI SDK
// This only executes on the server side.
export const ai = new GoogleGenAI({ apiKey });

// Output type based on user requirements
export interface OpportunityAnalysisResult {
  opportunityId: string;
  matchScore: number; // 0-100
  recommendationReason: string;
  missingSkills: string[];
  priorityRanking: number; // 1 = highest
}

// ----------------------------------------------------------------------
// Rate Limiting Logic
// ----------------------------------------------------------------------
// We use a simple in-memory Map to throttle excessive requests from the same user/IP.
// In a production environment, you might use Redis or a database for distributed rate limiting.
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 5;

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limitData = rateLimits.get(identifier);

  // Clean up if the reset time has passed
  if (!limitData || limitData.resetTime < now) {
    rateLimits.set(identifier, { count: 1, resetTime: now + 60 * 1000 });
    return true;
  }

  // Check if limit exceeded
  if (limitData.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  // Increment
  limitData.count += 1;
  return true;
}

// ----------------------------------------------------------------------
// Gemini AI API Utility Function
// ----------------------------------------------------------------------
/**
 * Analyzes a list of opportunities against a user's profile using Gemini 2.5 Flash.
 */
export async function analyzeOpportunities(
  userProfile: Profile,
  opportunityIds: string[]
): Promise<OpportunityAnalysisResult[]> {
  const coll = await getOpportunitiesCollection();

  // Create a query to only fetch the specified IDs
  const query = opportunityIds && opportunityIds.length > 0
    ? { id: { $in: opportunityIds } }
    : {}; // fallback if empty, though we should probably return [] if empty. Actually let's just query what's asked.

  if (opportunityIds && opportunityIds.length === 0) return [];

  const docs = await coll.find(query).limit(50).toArray(); // Cap at 50 to prevent massive context
  const opportunities = docs.map((doc) => ({
    ...doc,
    _id: String(doc._id),
    id: doc.id ? String(doc.id) : String(doc._id),
  })) as Opportunity[];

  if (!opportunities.length) return [];

  // Construct a clear prompt providing the profile and the list of opportunities.
  const prompt = `
    You are an AI career advisor. Evaluate the match between the user profile and the listed opportunities.

    USER PROFILE:
    Name: ${userProfile.name}
    Primary Field: ${userProfile.field}
    Interests/Categories: ${userProfile.interests.join(", ")}, ${userProfile.categories.join(", ")}
    Known Skills: ${userProfile.skills.join(", ")}

    OPPORTUNITIES:
    ${opportunities
      .map(
        (opp) => `
      - ID: ${opp.id}
      - Title: ${opp.title}
      - Organization: ${opp.organization}
      - Category: ${opp.category}
      - Tags: ${opp.tags.join(", ")}
      - Description: ${opp.description.substring(0, 500)}...
    `
      )
      .join("\n")}

    Return exactly a JSON array of objects. Each object MUST have the following keys:
    - "opportunityId" (string: the ID of the opportunity)
    - "matchScore" (number: 0-100 indicating how well the profile matches the opportunity)
    - "recommendationReason" (string: 1-2 sentences explaining why it's a good or bad match)
    - "missingSkills" (array of strings: skills the user doesn't have but are required/helpful)
    - "priorityRanking" (number: 1 for best match, 2 for second best, etc.)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let responseText = response.text;
    if (!responseText) throw new Error("No response from Gemini API");

    // Strip potential markdown JSON wrapping
    responseText = responseText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```\n?$/i, "").trim();

    const parsed = JSON.parse(responseText) as OpportunityAnalysisResult[];

    // Sort by priority ranking just in case the model didn't
    return parsed.sort((a, b) => a.priorityRanking - b.priorityRanking);
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Failed to analyze opportunities with Gemini.");
  }
}

// ----------------------------------------------------------------------
// Resume Parsing Feature
// ----------------------------------------------------------------------

export interface ResumeParsedData {
  skills: string[];
  interests: string[];
  programmingLanguages: string[];
  frameworks: string[];
  tools: string[];
  technologies: string[];
  domains: string[];
  preferredRoles: string[];
}

export async function analyzeResumePdf(base64Pdf: string): Promise<ResumeParsedData> {
  const prompt = `
    Extract the following information from this resume and return exactly a JSON object.
    Do not include markdown blocks or any other text.
    Return ONLY a JSON object with these keys, all as arrays of strings:
    - "skills" (general professional skills)
    - "interests"
    - "programmingLanguages"
    - "frameworks"
    - "tools"
    - "technologies"
    - "domains" (e.g. AI, Web Development, Cybersecurity, Finance, etc.)
    - "preferredRoles" (e.g. Software Engineer, Product Manager, etc. inferred from past roles or summary)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: base64Pdf,
            mimeType: "application/pdf",
          },
        },
        prompt,
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    let responseText = response.text;
    if (!responseText) throw new Error("No response from Gemini API");

    // Strip potential markdown JSON wrapping
    responseText = responseText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```\n?$/i, "").trim();

    const parsed = JSON.parse(responseText) as ResumeParsedData;
    return parsed;
  } catch (error) {
    console.error("Gemini Resume Analysis Failed:", error);
    throw new Error("Failed to analyze resume with Gemini.");
  }
}

// ----------------------------------------------------------------------
// Generate Personalized Feed
// ----------------------------------------------------------------------
export async function generatePersonalizedOpportunities(
  userProfile: Profile
): Promise<Opportunity[]> {
  const prompt = `
    You are an AI that generates realistic and highly relevant opportunities (internships, jobs, hackathons, scholarships, fellowships) for students.
    Generate a JSON array containing 5 unique, realistic opportunities tailored for the following user profile.
    Make sure they sound like real programs (e.g., Google SWE Intern, MLH Hackathon, Stanford AI Fellowship, etc.).

    USER PROFILE:
    Name: ${userProfile.name}
    Primary Field: ${userProfile.field}
    Interests: ${userProfile.interests.join(", ")}
    Skills: ${userProfile.skills.join(", ")}
    Preferred Locations: ${userProfile.preferred_locations?.join(", ") || "Remote"}

    Return exactly a JSON array of objects. Each object MUST have the following keys matching this TypeScript interface:
    - "id" (string: a unique uuid-like string)
    - "title" (string: name of the opportunity)
    - "organization" (string: company or organization name)
    - "category" (string: must be one of "internship", "scholarship", "competition", "fellowship", "hackathon")
    - "description" (string: 2-3 sentences describing the role/program)
    - "location" (string: city, country or "Remote")
    - "deadline" (string: an ISO date string in the future, e.g. "2026-12-31T23:59:59Z")
    - "prize_amount" (string or null: e.g. "$5000" or null if not applicable)
    - "tags" (array of strings: relevant skills and domain tags)
    - "apply_url" (string: e.g., "https://example.com/apply")
    - "participants" (number: estimated participants, e.g. 100)
    - "featured" (boolean: true)
    - "posted_at" (string: current ISO date string)
    - "work_mode" (string: "remote", "hybrid", or "onsite")
    - "verified" (boolean: true)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let responseText = response.text;
    if (!responseText) throw new Error("No response from Gemini API");

    // Strip potential markdown JSON wrapping
    responseText = responseText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```\n?$/i, "").trim();

    const parsed = JSON.parse(responseText) as Opportunity[];
    
    // Insert into DB so they show up in the feed alongside existing ones
    const coll = await getOpportunitiesCollection();
    
    // Ensure ids don't collide if by chance it generates existing ones, better to just let MongoDB generate _id and keep id.
    const docsToInsert = parsed.map(opp => {
       const newDoc = { ...opp };
       delete (newDoc as any)._id; // ensure no _id conflict
       return newDoc;
    });

    if (docsToInsert.length > 0) {
      await coll.insertMany(docsToInsert);
    }
    
    return parsed;
  } catch (error) {
    console.error("Gemini Generation Failed:", error);
    throw new Error("Failed to generate opportunities with Gemini.");
  }
}
