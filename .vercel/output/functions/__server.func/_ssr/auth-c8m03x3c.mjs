import { o as __toESM } from "../_runtime.mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { i as setCookie$1, n as getCookie, t as deleteCookie$1 } from "./server-CcTjSCVx.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-c8m03x3c.js
var getJwtSecret = () => process.env.JWT_SECRET || "default_development_secret_do_not_use_in_prod";
var authenticate_createServerFn_handler = createServerRpc({
	id: "b70605ac92374d3151f675f91bb27395262dcbc6859eae6b4cb2cbc0d5d63ee0",
	name: "authenticate",
	filename: "src/lib/auth.ts"
}, (opts) => authenticate.__executeServer(opts));
var authenticate = createServerFn({ method: "POST" }).validator((data) => {
	if (!data.name || !data.password) throw new Error("Name and password required");
	return data;
}).handler(authenticate_createServerFn_handler, async ({ data }) => {
	const { getUsersCollection } = await import("./db-CaEJsYVq.mjs");
	const users = await getUsersCollection();
	let user = await users.findOne({ name: data.name });
	const bcrypt = await import("bcrypt");
	const jwt = (await import("../_libs/jsonwebtoken+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default;
	if (!user) {
		const { DEFAULT_PROFILE } = await import("./local-store-BXuhZBic.mjs").then((n) => n.r);
		const passwordHash = await bcrypt.hash(data.password, 10);
		const newUser = {
			name: data.name,
			passwordHash,
			createdAt: /* @__PURE__ */ new Date(),
			profile: {
				...DEFAULT_PROFILE,
				name: data.name
			},
			saved: [],
			interested: [],
			passed: [],
			applied: []
		};
		user = {
			_id: (await users.insertOne(newUser)).insertedId,
			...newUser
		};
	} else if (!await bcrypt.compare(data.password, user.passwordHash)) throw new Error("Invalid password");
	setCookie$1("auth_token", jwt.sign({
		userId: user._id?.toString(),
		name: user.name
	}, getJwtSecret(), { expiresIn: "7d" }), {
		httpOnly: true,
		secure: true,
		path: "/",
		maxAge: 3600 * 24 * 7
	});
	return {
		success: true,
		userId: user._id?.toString() || ""
	};
});
var logout_createServerFn_handler = createServerRpc({
	id: "d5bb0e8501dbd0d7db8b50ace95a44aa3933978585c00afbcf3414fddbdd4061",
	name: "logout",
	filename: "src/lib/auth.ts"
}, (opts) => logout.__executeServer(opts));
var logout = createServerFn({ method: "POST" }).handler(logout_createServerFn_handler, async () => {
	deleteCookie$1("auth_token");
	return { success: true };
});
var getCurrentUser_createServerFn_handler = createServerRpc({
	id: "73c26cb891a5af7fbf0c39b71b25b6b1a619c5d0b7b6a16d0ead09d2ee5655f8",
	name: "getCurrentUser",
	filename: "src/lib/auth.ts"
}, (opts) => getCurrentUser.__executeServer(opts));
var getCurrentUser = createServerFn({ method: "GET" }).handler(getCurrentUser_createServerFn_handler, async () => {
	const token = getCookie("auth_token");
	if (!token) return null;
	try {
		const decoded = (await import("../_libs/jsonwebtoken+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default.verify(token, getJwtSecret());
		return {
			userId: decoded.userId,
			name: decoded.name
		};
	} catch (err) {
		return null;
	}
});
//#endregion
export { authenticate_createServerFn_handler, getCurrentUser_createServerFn_handler, logout_createServerFn_handler };
