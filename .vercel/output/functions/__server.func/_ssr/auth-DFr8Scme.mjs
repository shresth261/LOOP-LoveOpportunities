import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { u as createSsrRpc } from "./local-store-BXuhZBic.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DFr8Scme.js
var authenticate = createServerFn({ method: "POST" }).validator((data) => {
	if (!data.name || !data.password) throw new Error("Name and password required");
	return data;
}).handler(createSsrRpc("b70605ac92374d3151f675f91bb27395262dcbc6859eae6b4cb2cbc0d5d63ee0"));
var logout = createServerFn({ method: "POST" }).handler(createSsrRpc("d5bb0e8501dbd0d7db8b50ace95a44aa3933978585c00afbcf3414fddbdd4061"));
var getCurrentUser = createServerFn({ method: "GET" }).handler(createSsrRpc("73c26cb891a5af7fbf0c39b71b25b6b1a619c5d0b7b6a16d0ead09d2ee5655f8"));
//#endregion
export { getCurrentUser as n, logout as r, authenticate as t };
