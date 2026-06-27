import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { getOpportunitiesCollection } from "./db-CaEJsYVq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/opportunities-BjmpP0oN.js
var fetchOpportunities_createServerFn_handler = createServerRpc({
	id: "03febdf13f72e249cbf3615c826a26c5d098cc852896ff36f1a50d4f784bac59",
	name: "fetchOpportunities",
	filename: "src/lib/opportunities.ts"
}, (opts) => fetchOpportunities.__executeServer(opts));
var fetchOpportunities = createServerFn({ method: "POST" }).validator((filters = {}) => filters).handler(fetchOpportunities_createServerFn_handler, async ({ data: filters }) => {
	const coll = await getOpportunitiesCollection();
	const pipeline = [];
	const match = {};
	if (filters?.category && filters.category !== "all") match.category = filters.category;
	if (filters?.tag) match.tags = filters.tag;
	if (filters?.q) match.$or = [
		{ title: {
			$regex: filters.q,
			$options: "i"
		} },
		{ organization: {
			$regex: filters.q,
			$options: "i"
		} },
		{ tags: {
			$regex: filters.q,
			$options: "i"
		} }
	];
	match.deadline = { $gte: (/* @__PURE__ */ new Date()).toISOString() };
	if (Object.keys(match).length > 0) pipeline.push({ $match: match });
	if (filters?.profileTokens && filters.profileTokens.length > 0) {
		pipeline.push({ $addFields: { matchScore: { $cond: {
			if: { $gt: [{ $size: { $ifNull: ["$tags", []] } }, 0] },
			then: { $divide: [{ $size: { $setIntersection: [{ $map: {
				input: { $ifNull: ["$tags", []] },
				as: "t",
				in: { $toLower: "$$t" }
			} }, filters.profileTokens.map((t) => t.toLowerCase())] } }, { $size: { $ifNull: ["$tags", []] } }] },
			else: 0
		} } } });
		pipeline.push({ $sort: {
			matchScore: -1,
			deadline: 1
		} });
	} else pipeline.push({ $sort: { deadline: 1 } });
	const page = filters?.page || 1;
	const limit = filters?.limit || 20;
	const skip = (page - 1) * limit;
	pipeline.push({ $skip: skip });
	pipeline.push({ $limit: limit });
	pipeline.push({ $project: {
		id: 1,
		_id: 1,
		title: 1,
		organization: 1,
		category: 1,
		location: 1,
		deadline: 1,
		tags: 1,
		prize_amount: 1,
		work_mode: 1,
		verified: 1,
		application_start_date: 1,
		posted_at: 1,
		matchScore: 1
	} });
	return (await coll.aggregate(pipeline).toArray()).map((doc) => ({
		...doc,
		_id: String(doc._id),
		id: doc.id ? String(doc.id) : String(doc._id)
	}));
});
var fetchOpportunityById_createServerFn_handler = createServerRpc({
	id: "8252fb867a620cd62c226015459983f04baaed04b21005799606cae9819dd07e",
	name: "fetchOpportunityById",
	filename: "src/lib/opportunities.ts"
}, (opts) => fetchOpportunityById.__executeServer(opts));
var fetchOpportunityById = createServerFn({ method: "GET" }).validator((id) => id).handler(fetchOpportunityById_createServerFn_handler, async ({ data: id }) => {
	const doc = await (await getOpportunitiesCollection()).findOne({ id });
	if (!doc) return null;
	return {
		...doc,
		_id: String(doc._id),
		id: doc.id ? String(doc.id) : String(doc._id)
	};
});
var fetchOpportunitiesByIds_createServerFn_handler = createServerRpc({
	id: "dfde72ba60fcba7537a454e0e0100d8c8e9e0de64dfef3ede208d91276e7087f",
	name: "fetchOpportunitiesByIds",
	filename: "src/lib/opportunities.ts"
}, (opts) => fetchOpportunitiesByIds.__executeServer(opts));
var fetchOpportunitiesByIds = createServerFn({ method: "POST" }).validator((ids) => ids).handler(fetchOpportunitiesByIds_createServerFn_handler, async ({ data: ids }) => {
	if (!ids || ids.length === 0) return [];
	return (await (await getOpportunitiesCollection()).find({ id: { $in: ids } }).toArray()).map((doc) => ({
		...doc,
		_id: String(doc._id),
		id: doc.id ? String(doc.id) : String(doc._id)
	}));
});
var fetchTickerOpportunities_createServerFn_handler = createServerRpc({
	id: "35aa29d81bf8cda5d9397ecdcad2ecaacbcf6b80e932096436c289c5f974e0ec",
	name: "fetchTickerOpportunities",
	filename: "src/lib/opportunities.ts"
}, (opts) => fetchTickerOpportunities.__executeServer(opts));
var fetchTickerOpportunities = createServerFn({ method: "GET" }).handler(fetchTickerOpportunities_createServerFn_handler, async () => {
	return await (await getOpportunitiesCollection()).find({ deadline: { $gte: (/* @__PURE__ */ new Date()).toISOString() } }).project({
		title: 1,
		organization: 1,
		deadline: 1,
		_id: 0
	}).sort({ deadline: 1 }).limit(8).toArray();
});
//#endregion
export { fetchOpportunitiesByIds_createServerFn_handler, fetchOpportunities_createServerFn_handler, fetchOpportunityById_createServerFn_handler, fetchTickerOpportunities_createServerFn_handler };
