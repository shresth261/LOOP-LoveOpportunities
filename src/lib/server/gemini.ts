/**
 * This file contains the server-side integration with the Google Gemini API.
 * It ensures that the API key is NEVER exposed to the frontend, by running
 * all logic exclusively on the server using TanStack Start's createServerFn.
 */
import { createServerFn } from "@tanstack/react-start";
import { GoogleGenAI } from "@google/genai";
import type { Profile } from "@/lib/local-store";
import type { Opportunity } from "@/lib/opportunities";

// Ensure the API key is available
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY environment variable is not set. Gemini features will fail.");
}

// Initialize the GoogleGenAI SDK
// This only executes on the server side.
const ai = new GoogleGenAI({ apiKey });

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

function checkRateLimit(identifier: string): boolean {
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
  opportunities: Opportunity[]
): Promise<OpportunityAnalysisResult[]> {
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

    const responseText = response.text;
    if (!responseText) throw new Error("No response from Gemini API");

    const parsed = JSON.parse(responseText) as OpportunityAnalysisResult[];
    
    // Sort by priority ranking just in case the model didn't
    return parsed.sort((a, b) => a.priorityRanking - b.priorityRanking);
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Failed to analyze opportunities with Gemini.");
  }
}

// ----------------------------------------------------------------------
// Expose as a Server Function Endpoint
// ----------------------------------------------------------------------
/**
 * TanStack Start createServerFn allows the frontend to call this logic securely.
 * It validates inputs and applies our rate limiter.
 */
export const fetchGeminiAnalysis = createServerFn({ method: "POST" })
  .validator((data: { profile: Profile; opportunities: Opportunity[] }) => data)
  .handler(async ({ data }) => {
    // In a real app, you would use the user ID from the session/token for rate limiting.
    // For this example, we use a generic identifier or fallback to 'anonymous'.
    const rateLimitIdentifier = data.profile.name || "anonymous";

    if (!checkRateLimit(rateLimitIdentifier)) {
      throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
    }

    const results = await analyzeOpportunities(data.profile, data.opportunities);
    return results;
  });
