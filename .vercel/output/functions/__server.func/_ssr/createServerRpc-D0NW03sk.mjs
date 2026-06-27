import { i as TSS_SERVER_FUNCTION } from "./createServerFn-B6xwD7pN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createServerRpc-D0NW03sk.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
export { createServerRpc as t };
