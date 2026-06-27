import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { c as createServerFn } from "./createServerFn-B6xwD7pN.mjs";
import { t as createServerRpc } from "./createServerRpc-D0NW03sk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gemini-CaCKDZJf.js
var fetchGeminiAnalysis_createServerFn_handler = createServerRpc({
	id: "d4783f78ad4964dc896f8317b79eeba0ae57cf3fc1bb3bfd8bf2f9fbf59c90c5",
	name: "fetchGeminiAnalysis",
	filename: "src/lib/gemini.ts"
}, (opts) => fetchGeminiAnalysis.__executeServer(opts));
var fetchGeminiAnalysis = createServerFn({ method: "POST" }).validator((data) => data).handler(fetchGeminiAnalysis_createServerFn_handler, async ({ data }) => {
	const { analyzeOpportunities, checkRateLimit } = await import("./gemini.server-Bt5DT3sC.mjs");
	if (!checkRateLimit(data.profile.name || "anonymous")) throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
	return await analyzeOpportunities(data.profile, data.opportunityIds);
});
var uploadAndAnalyzeResume_createServerFn_handler = createServerRpc({
	id: "b733fd24ac424e5184b1f347a96db098214a5838b514b3cab1ce4a092ee52184",
	name: "uploadAndAnalyzeResume",
	filename: "src/lib/gemini.ts"
}, (opts) => uploadAndAnalyzeResume.__executeServer(opts));
var uploadAndAnalyzeResume = createServerFn({ method: "POST" }).validator((data) => data).handler(uploadAndAnalyzeResume_createServerFn_handler, async ({ data }) => {
	const { analyzeResumePdf, checkRateLimit } = await import("./gemini.server-Bt5DT3sC.mjs");
	if (!checkRateLimit("resume_upload")) throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
	const parsed = await analyzeResumePdf(data.base64Pdf);
	try {
		const { getCookie } = await import("./server-SrK8BGW-.mjs").then((n) => n.r);
		const jwt = (await import("./jsonwebtoken-CL7Wqg_9.mjs").then((m) => /* @__PURE__ */ __toESM(m.default))).default;
		const getJwtSecret = () => process.env.JWT_SECRET || "default_development_secret_do_not_use_in_prod";
		const token = getCookie("auth_token");
		if (token) {
			const decoded = jwt.verify(token, getJwtSecret());
			const { getUsersCollection } = await import("./db-D8hn2JbK.mjs");
			const users = await getUsersCollection();
			const { ObjectId } = await import("./lib-CYABAKMX.mjs").then((n) => n.t).then((n) => /* @__PURE__ */ __toESM(n.t()));
			const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
			if (user && user.profile) {
				const newSkills = Array.from(/* @__PURE__ */ new Set([
					...user.profile.skills || [],
					...parsed.skills || [],
					...parsed.programmingLanguages || [],
					...parsed.frameworks || [],
					...parsed.tools || [],
					...parsed.technologies || []
				]));
				const newInterests = Array.from(/* @__PURE__ */ new Set([
					...user.profile.interests || [],
					...parsed.interests || [],
					...parsed.domains || []
				]));
				const newField = parsed.preferredRoles?.[0] || user.profile.field;
				await users.updateOne({ _id: new ObjectId(decoded.userId) }, { $set: {
					"profile.skills": newSkills,
					"profile.interests": newInterests,
					"profile.field": newField
				} });
			}
		}
	} catch (err) {
		console.error("Failed to sync parsed resume to DB:", err);
	}
	return parsed;
});
var generateFeed_createServerFn_handler = createServerRpc({
	id: "de2c86529a278cf9a4d3e00072d2831ddb87cdea5632398a654ccc2da669527e",
	name: "generateFeed",
	filename: "src/lib/gemini.ts"
}, (opts) => generateFeed.__executeServer(opts));
var generateFeed = createServerFn({ method: "POST" }).validator((data) => data).handler(generateFeed_createServerFn_handler, async ({ data }) => {
	const { generatePersonalizedOpportunities, checkRateLimit } = await import("./gemini.server-Bt5DT3sC.mjs");
	if (!checkRateLimit(data.profile.name || "anonymous")) throw new Error("Rate limit exceeded. Please wait a minute before trying again.");
	return await generatePersonalizedOpportunities(data.profile);
});
//#endregion
export { fetchGeminiAnalysis_createServerFn_handler, generateFeed_createServerFn_handler, uploadAndAnalyzeResume_createServerFn_handler };
