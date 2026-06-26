import { createServerFn } from "@tanstack/react-start";
import type { Profile } from "@/lib/local-store";

export const fetchGeminiAnalysis = createServerFn({ method: "POST" })
  .validator((data: { profile: Profile; opportunityIds: string[] }) => data)
  .handler(async ({ data }) => {
    const { analyzeOpportunities, checkRateLimit } = await import("./server/gemini.server");
    const rateLimitIdentifier = data.profile.name || "anonymous";

    if (!checkRateLimit(rateLimitIdentifier)) {
      throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
    }

    const results = await analyzeOpportunities(data.profile, data.opportunityIds);
    return results;
  });

export const uploadAndAnalyzeResume = createServerFn({ method: "POST" })
  .validator((data: { base64Pdf: string }) => data)
  .handler(async ({ data }) => {
    const { analyzeResumePdf, checkRateLimit } = await import("./server/gemini.server");

    if (!checkRateLimit("resume_upload")) {
      throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
    }

    const parsed = await analyzeResumePdf(data.base64Pdf);
    
    // Attempt to update the user's MongoDB profile if authenticated
    try {
      const { getCookie } = await import("@tanstack/react-start/server");
      const jwt = (await import("jsonwebtoken")).default;
      const getJwtSecret = () => process.env.JWT_SECRET || "default_development_secret_do_not_use_in_prod";
      
      const token = getCookie("auth_token");
      if (token) {
        const decoded = jwt.verify(token, getJwtSecret()) as { userId: string; name: string };
        const { getUsersCollection } = await import("./server/db");
        const users = await getUsersCollection();
        const { ObjectId } = await import("mongodb");
        
        // Find user
        const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
        if (user && user.profile) {
          const newSkills = Array.from(new Set([
            ...(user.profile.skills || []),
            ...(parsed.skills || []),
            ...(parsed.programmingLanguages || []),
            ...(parsed.frameworks || []),
            ...(parsed.tools || []),
            ...(parsed.technologies || []),
          ]));

          const newInterests = Array.from(new Set([
            ...(user.profile.interests || []),
            ...(parsed.interests || []),
            ...(parsed.domains || []),
          ]));

          const newField = parsed.preferredRoles?.[0] || user.profile.field;

          await users.updateOne(
            { _id: new ObjectId(decoded.userId) },
            { 
              $set: { 
                "profile.skills": newSkills,
                "profile.interests": newInterests,
                "profile.field": newField
              } 
            }
          );
        }
      }
    } catch (err) {
      console.error("Failed to sync parsed resume to DB:", err);
      // We don't throw here because returning the parsed data to the client is still useful.
      // The client ALSO updates the profile which does an API call.
    }

    return parsed;
  });

export const generateFeed = createServerFn({ method: "POST" })
  .validator((data: { profile: Profile }) => data)
  .handler(async ({ data }) => {
    const { generatePersonalizedOpportunities, checkRateLimit } = await import("./server/gemini.server");
    const rateLimitIdentifier = data.profile.name || "anonymous";

    if (!checkRateLimit(rateLimitIdentifier)) {
      throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
    }

    const results = await generatePersonalizedOpportunities(data.profile);
    return results;
  });
