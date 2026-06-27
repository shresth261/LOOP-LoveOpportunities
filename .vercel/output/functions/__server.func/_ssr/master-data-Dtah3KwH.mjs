import { c as createServerFn } from "./createServerFn-B6xwD7pN.mjs";
import { u as createSsrRpc } from "./local-store-CcXE9Eyb.mjs";
import { s as queryOptions } from "./opportunities-cMMFOfN1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/master-data-Dtah3KwH.js
var fetchMasterSkills = createServerFn({ method: "GET" }).handler(createSsrRpc("0ac0d835151edf8af4dbf9704df2e112f389446a7493eab59c041908f44cc3c5"));
var fetchMasterInterests = createServerFn({ method: "GET" }).handler(createSsrRpc("bfbeaf757c17c2b3de1f37e1976ddd22ad06c2eab2f179cf46c40fd39e312ec6"));
var addMasterSkill = createServerFn({ method: "POST" }).validator((name) => name).handler(createSsrRpc("c80b329046e50f9f2e130cd97dc7e2c2d32ac4b96328eb6933c604725373b74a"));
var addMasterInterest = createServerFn({ method: "POST" }).validator((name) => name).handler(createSsrRpc("82eab0b5aa4a30ebb981e0f45a6dab27bab1a4fd4208fcd1eb1d218dd9cb787c"));
var masterSkillsQuery = () => queryOptions({
	queryKey: ["master-skills"],
	queryFn: () => fetchMasterSkills()
});
var masterInterestsQuery = () => queryOptions({
	queryKey: ["master-interests"],
	queryFn: () => fetchMasterInterests()
});
//#endregion
export { masterSkillsQuery as i, addMasterSkill as n, masterInterestsQuery as r, addMasterInterest as t };
