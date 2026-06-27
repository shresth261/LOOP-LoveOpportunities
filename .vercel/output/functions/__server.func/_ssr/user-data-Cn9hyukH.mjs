import { o as __toESM } from "../_runtime.mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as DEFAULT_PROFILE } from "./local-store-BXuhZBic.mjs";
import { n as getCurrentUser } from "./auth-DFr8Scme.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/user-data-Cn9hyukH.js
async function requireUserDb() {
	const user = await getCurrentUser();
	if (!user) throw new Error("Not authenticated");
	const { getUsersCollection } = await import("./db-CaEJsYVq.mjs");
	const { ObjectId } = await import("../_libs/mongodb.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const users = await getUsersCollection();
	const dbUser = await users.findOne({ _id: new ObjectId(user.userId) });
	if (!dbUser) throw new Error("User not found in DB");
	return {
		users,
		dbUser,
		userId: new ObjectId(user.userId)
	};
}
var getUserData_createServerFn_handler = createServerRpc({
	id: "6907fa552568d5834eb12249e3e6d12f714870589c75dd54f17731c3424e6055",
	name: "getUserData",
	filename: "src/lib/user-data.ts"
}, (opts) => getUserData.__executeServer(opts));
var getUserData = createServerFn({ method: "GET" }).handler(getUserData_createServerFn_handler, async () => {
	const user = await getCurrentUser();
	if (!user) return null;
	const { getUsersCollection } = await import("./db-CaEJsYVq.mjs");
	const { ObjectId } = await import("../_libs/mongodb.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const dbUser = await (await getUsersCollection()).findOne({ _id: new ObjectId(user.userId) });
	if (!dbUser) return null;
	return {
		profile: {
			...DEFAULT_PROFILE,
			...dbUser.profile || {}
		},
		saved: dbUser.saved || [],
		interested: dbUser.interested || [],
		passed: dbUser.passed || [],
		applied: dbUser.applied || []
	};
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "9f457b8416a227e93e125375af57c6b6fa3b436056ad7d21846dc083820e53ba",
	name: "updateProfile",
	filename: "src/lib/user-data.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).validator((data) => data).handler(updateProfile_createServerFn_handler, async ({ data }) => {
	const { users, userId } = await requireUserDb();
	const updateQuery = Object.keys(data).reduce((acc, key) => {
		acc[`profile.${key}`] = data[key];
		return acc;
	}, {});
	await users.updateOne({ _id: userId }, { $set: updateQuery });
	return { success: true };
});
var toggleSaved_createServerFn_handler = createServerRpc({
	id: "e6e07f6628d573c761668c82f0f04362484b66ac4636822c60ae4e279ed1307b",
	name: "toggleSaved",
	filename: "src/lib/user-data.ts"
}, (opts) => toggleSaved.__executeServer(opts));
var toggleSaved = createServerFn({ method: "POST" }).validator((id) => id).handler(toggleSaved_createServerFn_handler, async ({ data: id }) => {
	const { users, dbUser, userId } = await requireUserDb();
	const isSaved = (dbUser.saved || []).includes(id);
	if (isSaved) await users.updateOne({ _id: userId }, { $pull: { saved: id } });
	else await users.updateOne({ _id: userId }, { $addToSet: { saved: id } });
	return {
		success: true,
		saved: !isSaved
	};
});
var toggleInterested_createServerFn_handler = createServerRpc({
	id: "ffcdf66c7a02ec0d8d823ce486b9626f4f80bac7714c90fa892534b677ee695b",
	name: "toggleInterested",
	filename: "src/lib/user-data.ts"
}, (opts) => toggleInterested.__executeServer(opts));
var toggleInterested = createServerFn({ method: "POST" }).validator((id) => id).handler(toggleInterested_createServerFn_handler, async ({ data: id }) => {
	const { users, dbUser, userId } = await requireUserDb();
	const isInterested = (dbUser.interested || []).includes(id);
	if (isInterested) await users.updateOne({ _id: userId }, { $pull: { interested: id } });
	else await users.updateOne({ _id: userId }, { $addToSet: { interested: id } });
	return {
		success: true,
		interested: !isInterested
	};
});
var addInterested_createServerFn_handler = createServerRpc({
	id: "9a50eb9d5bf2910c54d5b6b7c0d3ff63b76eb224c0849892f51ce6be82f416d6",
	name: "addInterested",
	filename: "src/lib/user-data.ts"
}, (opts) => addInterested.__executeServer(opts));
var addInterested = createServerFn({ method: "POST" }).validator((id) => id).handler(addInterested_createServerFn_handler, async ({ data: id }) => {
	const { users, userId } = await requireUserDb();
	await users.updateOne({ _id: userId }, { $addToSet: { interested: id } });
	return { success: true };
});
var addPassed_createServerFn_handler = createServerRpc({
	id: "c3dd6e0c709c0c2049f29e2d6fc676dddb1b6a6c5745f8ed4b6ecfdcc2266ae9",
	name: "addPassed",
	filename: "src/lib/user-data.ts"
}, (opts) => addPassed.__executeServer(opts));
var addPassed = createServerFn({ method: "POST" }).validator((id) => id).handler(addPassed_createServerFn_handler, async ({ data: id }) => {
	const { users, userId } = await requireUserDb();
	await users.updateOne({ _id: userId }, { $addToSet: { passed: id } });
	return { success: true };
});
var toggleApplied_createServerFn_handler = createServerRpc({
	id: "f080637e7f1105c2c19d83605078aae66bfe3cb5a47c05f07c71939f7759d4eb",
	name: "toggleApplied",
	filename: "src/lib/user-data.ts"
}, (opts) => toggleApplied.__executeServer(opts));
var toggleApplied = createServerFn({ method: "POST" }).validator((id) => id).handler(toggleApplied_createServerFn_handler, async ({ data: id }) => {
	const { users, dbUser, userId } = await requireUserDb();
	const isApplied = (dbUser.applied || []).includes(id);
	if (isApplied) await users.updateOne({ _id: userId }, { $pull: { applied: id } });
	else await users.updateOne({ _id: userId }, { $addToSet: { applied: id } });
	return {
		success: true,
		applied: !isApplied
	};
});
//#endregion
export { addInterested_createServerFn_handler, addPassed_createServerFn_handler, getUserData_createServerFn_handler, toggleApplied_createServerFn_handler, toggleInterested_createServerFn_handler, toggleSaved_createServerFn_handler, updateProfile_createServerFn_handler };
