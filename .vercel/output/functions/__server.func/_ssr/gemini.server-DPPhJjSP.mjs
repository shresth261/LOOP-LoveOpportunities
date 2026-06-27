import { getOpportunitiesCollection } from "./db-CaEJsYVq.mjs";
import { t as GoogleGenAI } from "../_libs/@google/genai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gemini.server-DPPhJjSP.js
var apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) console.warn("GEMINI_API_KEY environment variable is not set. Gemini features will fail.");
var ai = new GoogleGenAI({ apiKey });
var rateLimits = /* @__PURE__ */ new Map();
var MAX_REQUESTS_PER_MINUTE = 5;
function checkRateLimit(identifier) {
	const now = Date.now();
	const limitData = rateLimits.get(identifier);
	if (!limitData || limitData.resetTime < now) {
		rateLimits.set(identifier, {
			count: 1,
			resetTime: now + 60 * 1e3
		});
		return true;
	}
	if (limitData.count >= MAX_REQUESTS_PER_MINUTE) return false;
	limitData.count += 1;
	return true;
}
/**
* Analyzes a list of opportunities against a user's profile using Gemini 2.5 Flash.
*/
async function analyzeOpportunities(userProfile, opportunityIds) {
	const coll = await getOpportunitiesCollection();
	const query = opportunityIds && opportunityIds.length > 0 ? { id: { $in: opportunityIds } } : {};
	if (opportunityIds && opportunityIds.length === 0) return [];
	const opportunities = (await coll.find(query).limit(50).toArray()).map((doc) => ({
		...doc,
		_id: String(doc._id),
		id: doc.id ? String(doc.id) : String(doc._id)
	}));
	if (!opportunities.length) return [];
	const prompt = `
    You are an AI career advisor. Evaluate the match between the user profile and the listed opportunities.

    USER PROFILE:
    Name: ${userProfile.name}
    Primary Field: ${userProfile.field}
    Interests/Categories: ${userProfile.interests.join(", ")}, ${userProfile.categories.join(", ")}
    Known Skills: ${userProfile.skills.join(", ")}

    OPPORTUNITIES:
    ${opportunities.map((opp) => `
      - ID: ${opp.id}
      - Title: ${opp.title}
      - Organization: ${opp.organization}
      - Category: ${opp.category}
      - Tags: ${opp.tags.join(", ")}
      - Description: ${opp.description.substring(0, 500)}...
    `).join("\n")}

    Return exactly a JSON array of objects. Each object MUST have the following keys:
    - "opportunityId" (string: the ID of the opportunity)
    - "matchScore" (number: 0-100 indicating how well the profile matches the opportunity)
    - "recommendationReason" (string: 1-2 sentences explaining why it's a good or bad match)
    - "missingSkills" (array of strings: skills the user doesn't have but are required/helpful)
    - "priorityRanking" (number: 1 for best match, 2 for second best, etc.)
  `;
	try {
		let responseText = (await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: prompt,
			config: { responseMimeType: "application/json" }
		})).text;
		if (!responseText) throw new Error("No response from Gemini API");
		responseText = responseText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```\n?$/i, "").trim();
		return JSON.parse(responseText).sort((a, b) => a.priorityRanking - b.priorityRanking);
	} catch (error) {
		console.error("Gemini Analysis Failed:", error);
		throw new Error("Failed to analyze opportunities with Gemini.");
	}
}
async function analyzeResumePdf(base64Pdf) {
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
		let responseText = (await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: [{ inlineData: {
				data: base64Pdf,
				mimeType: "application/pdf"
			} }, prompt],
			config: { responseMimeType: "application/json" }
		})).text;
		if (!responseText) throw new Error("No response from Gemini API");
		responseText = responseText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```\n?$/i, "").trim();
		return JSON.parse(responseText);
	} catch (error) {
		console.error("Gemini Resume Analysis Failed:", error);
		throw new Error("Failed to analyze resume with Gemini.");
	}
}
async function generatePersonalizedOpportunities(userProfile) {
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
		let responseText = (await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: prompt,
			config: { responseMimeType: "application/json" }
		})).text;
		if (!responseText) throw new Error("No response from Gemini API");
		responseText = responseText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```\n?$/i, "").trim();
		const parsed = JSON.parse(responseText);
		const coll = await getOpportunitiesCollection();
		const docsToInsert = parsed.map((opp) => {
			const newDoc = { ...opp };
			delete newDoc._id;
			return newDoc;
		});
		if (docsToInsert.length > 0) await coll.insertMany(docsToInsert);
		return parsed;
	} catch (error) {
		console.error("Gemini Generation Failed:", error);
		throw new Error("Failed to generate opportunities with Gemini.");
	}
}
//#endregion
export { analyzeOpportunities, analyzeResumePdf, checkRateLimit, generatePersonalizedOpportunities };
