import { n as require_lib } from "./lib-CYABAKMX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-D8hn2JbK.js
var import_lib = require_lib();
var getUri = () => process.env.MONGODB_URI || "mongodb://localhost:27017";
var getDbName = () => process.env.DATABASE_NAME || "leap_lounge";
var client = null;
async function getDb() {
	if (!client) {
		client = new import_lib.MongoClient(getUri());
		await client.connect();
		console.log("Connected to MongoDB");
		await setupIndexes(client.db(getDbName()));
	}
	return client.db(getDbName());
}
async function getOpportunitiesCollection() {
	return (await getDb()).collection("opportunities");
}
async function getUsersCollection() {
	return (await getDb()).collection("users");
}
async function getMasterSkillsCollection() {
	return (await getDb()).collection("master_skills");
}
async function getMasterInterestsCollection() {
	return (await getDb()).collection("master_interests");
}
async function setupIndexes(db) {
	try {
		const opps = db.collection("opportunities");
		await opps.createIndex({
			title: "text",
			organization: "text",
			tags: "text"
		}, { name: "search_text_idx" });
		await opps.createIndex({
			category: 1,
			deadline: 1
		});
		await opps.createIndex({ deadline: 1 });
		await opps.createIndex({ location: 1 });
		await opps.createIndex({ application_start_date: 1 });
		await opps.createIndex({ tags: 1 });
		await opps.createIndex({ active: 1 });
		await db.collection("master_skills").createIndex({ name: 1 }, { unique: true });
		await db.collection("master_interests").createIndex({ name: 1 }, { unique: true });
		console.log("MongoDB Indexes ensured");
	} catch (error) {
		console.error("Failed to setup indexes:", error);
	}
}
//#endregion
export { getMasterInterestsCollection, getMasterSkillsCollection, getOpportunitiesCollection, getUsersCollection };
