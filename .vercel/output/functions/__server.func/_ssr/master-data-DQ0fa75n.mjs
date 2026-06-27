import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { getMasterInterestsCollection, getMasterSkillsCollection } from "./db-CaEJsYVq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/master-data-DQ0fa75n.js
var fetchMasterSkills_createServerFn_handler = createServerRpc({
	id: "0ac0d835151edf8af4dbf9704df2e112f389446a7493eab59c041908f44cc3c5",
	name: "fetchMasterSkills",
	filename: "src/lib/master-data.ts"
}, (opts) => fetchMasterSkills.__executeServer(opts));
var fetchMasterSkills = createServerFn({ method: "GET" }).handler(fetchMasterSkills_createServerFn_handler, async () => {
	return (await (await getMasterSkillsCollection()).find().toArray()).map((d) => d.name);
});
var fetchMasterInterests_createServerFn_handler = createServerRpc({
	id: "bfbeaf757c17c2b3de1f37e1976ddd22ad06c2eab2f179cf46c40fd39e312ec6",
	name: "fetchMasterInterests",
	filename: "src/lib/master-data.ts"
}, (opts) => fetchMasterInterests.__executeServer(opts));
var fetchMasterInterests = createServerFn({ method: "GET" }).handler(fetchMasterInterests_createServerFn_handler, async () => {
	return (await (await getMasterInterestsCollection()).find().toArray()).map((d) => d.name);
});
var addMasterSkill_createServerFn_handler = createServerRpc({
	id: "c80b329046e50f9f2e130cd97dc7e2c2d32ac4b96328eb6933c604725373b74a",
	name: "addMasterSkill",
	filename: "src/lib/master-data.ts"
}, (opts) => addMasterSkill.__executeServer(opts));
var addMasterSkill = createServerFn({ method: "POST" }).validator((name) => name).handler(addMasterSkill_createServerFn_handler, async ({ data: name }) => {
	const coll = await getMasterSkillsCollection();
	try {
		await coll.insertOne({ name });
		return { success: true };
	} catch (e) {
		if (e.code === 11e3) return { success: true };
		throw e;
	}
});
var addMasterInterest_createServerFn_handler = createServerRpc({
	id: "82eab0b5aa4a30ebb981e0f45a6dab27bab1a4fd4208fcd1eb1d218dd9cb787c",
	name: "addMasterInterest",
	filename: "src/lib/master-data.ts"
}, (opts) => addMasterInterest.__executeServer(opts));
var addMasterInterest = createServerFn({ method: "POST" }).validator((name) => name).handler(addMasterInterest_createServerFn_handler, async ({ data: name }) => {
	const coll = await getMasterInterestsCollection();
	try {
		await coll.insertOne({ name });
		return { success: true };
	} catch (e) {
		if (e.code === 11e3) return { success: true };
		throw e;
	}
});
//#endregion
export { addMasterInterest_createServerFn_handler, addMasterSkill_createServerFn_handler, fetchMasterInterests_createServerFn_handler, fetchMasterSkills_createServerFn_handler };
