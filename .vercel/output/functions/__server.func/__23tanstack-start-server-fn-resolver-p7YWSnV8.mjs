//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-p7YWSnV8.js
var manifest = {
	"03febdf13f72e249cbf3615c826a26c5d098cc852896ff36f1a50d4f784bac59": {
		functionName: "fetchOpportunities_createServerFn_handler",
		importer: () => import("./_ssr/opportunities-BjmpP0oN.mjs")
	},
	"0ac0d835151edf8af4dbf9704df2e112f389446a7493eab59c041908f44cc3c5": {
		functionName: "fetchMasterSkills_createServerFn_handler",
		importer: () => import("./_ssr/master-data-DQ0fa75n.mjs")
	},
	"35aa29d81bf8cda5d9397ecdcad2ecaacbcf6b80e932096436c289c5f974e0ec": {
		functionName: "fetchTickerOpportunities_createServerFn_handler",
		importer: () => import("./_ssr/opportunities-BjmpP0oN.mjs")
	},
	"6907fa552568d5834eb12249e3e6d12f714870589c75dd54f17731c3424e6055": {
		functionName: "getUserData_createServerFn_handler",
		importer: () => import("./_ssr/user-data-Cn9hyukH.mjs")
	},
	"73c26cb891a5af7fbf0c39b71b25b6b1a619c5d0b7b6a16d0ead09d2ee5655f8": {
		functionName: "getCurrentUser_createServerFn_handler",
		importer: () => import("./_ssr/auth-c8m03x3c.mjs")
	},
	"8252fb867a620cd62c226015459983f04baaed04b21005799606cae9819dd07e": {
		functionName: "fetchOpportunityById_createServerFn_handler",
		importer: () => import("./_ssr/opportunities-BjmpP0oN.mjs")
	},
	"82eab0b5aa4a30ebb981e0f45a6dab27bab1a4fd4208fcd1eb1d218dd9cb787c": {
		functionName: "addMasterInterest_createServerFn_handler",
		importer: () => import("./_ssr/master-data-DQ0fa75n.mjs")
	},
	"9a50eb9d5bf2910c54d5b6b7c0d3ff63b76eb224c0849892f51ce6be82f416d6": {
		functionName: "addInterested_createServerFn_handler",
		importer: () => import("./_ssr/user-data-Cn9hyukH.mjs")
	},
	"9f457b8416a227e93e125375af57c6b6fa3b436056ad7d21846dc083820e53ba": {
		functionName: "updateProfile_createServerFn_handler",
		importer: () => import("./_ssr/user-data-Cn9hyukH.mjs")
	},
	"b70605ac92374d3151f675f91bb27395262dcbc6859eae6b4cb2cbc0d5d63ee0": {
		functionName: "authenticate_createServerFn_handler",
		importer: () => import("./_ssr/auth-c8m03x3c.mjs")
	},
	"b733fd24ac424e5184b1f347a96db098214a5838b514b3cab1ce4a092ee52184": {
		functionName: "uploadAndAnalyzeResume_createServerFn_handler",
		importer: () => import("./_ssr/gemini-Bh8Zbdm3.mjs")
	},
	"bfbeaf757c17c2b3de1f37e1976ddd22ad06c2eab2f179cf46c40fd39e312ec6": {
		functionName: "fetchMasterInterests_createServerFn_handler",
		importer: () => import("./_ssr/master-data-DQ0fa75n.mjs")
	},
	"c3dd6e0c709c0c2049f29e2d6fc676dddb1b6a6c5745f8ed4b6ecfdcc2266ae9": {
		functionName: "addPassed_createServerFn_handler",
		importer: () => import("./_ssr/user-data-Cn9hyukH.mjs")
	},
	"c80b329046e50f9f2e130cd97dc7e2c2d32ac4b96328eb6933c604725373b74a": {
		functionName: "addMasterSkill_createServerFn_handler",
		importer: () => import("./_ssr/master-data-DQ0fa75n.mjs")
	},
	"d4783f78ad4964dc896f8317b79eeba0ae57cf3fc1bb3bfd8bf2f9fbf59c90c5": {
		functionName: "fetchGeminiAnalysis_createServerFn_handler",
		importer: () => import("./_ssr/gemini-Bh8Zbdm3.mjs")
	},
	"d5bb0e8501dbd0d7db8b50ace95a44aa3933978585c00afbcf3414fddbdd4061": {
		functionName: "logout_createServerFn_handler",
		importer: () => import("./_ssr/auth-c8m03x3c.mjs")
	},
	"de2c86529a278cf9a4d3e00072d2831ddb87cdea5632398a654ccc2da669527e": {
		functionName: "generateFeed_createServerFn_handler",
		importer: () => import("./_ssr/gemini-Bh8Zbdm3.mjs")
	},
	"dfde72ba60fcba7537a454e0e0100d8c8e9e0de64dfef3ede208d91276e7087f": {
		functionName: "fetchOpportunitiesByIds_createServerFn_handler",
		importer: () => import("./_ssr/opportunities-BjmpP0oN.mjs")
	},
	"e6e07f6628d573c761668c82f0f04362484b66ac4636822c60ae4e279ed1307b": {
		functionName: "toggleSaved_createServerFn_handler",
		importer: () => import("./_ssr/user-data-Cn9hyukH.mjs")
	},
	"f080637e7f1105c2c19d83605078aae66bfe3cb5a47c05f07c71939f7759d4eb": {
		functionName: "toggleApplied_createServerFn_handler",
		importer: () => import("./_ssr/user-data-Cn9hyukH.mjs")
	},
	"ffcdf66c7a02ec0d8d823ce486b9626f4f80bac7714c90fa892534b677ee695b": {
		functionName: "toggleInterested_createServerFn_handler",
		importer: () => import("./_ssr/user-data-Cn9hyukH.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
