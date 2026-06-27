import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { t as require_react } from "./react-DGbDRcN1.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-BgNeXRf5.mjs";
import { t as useNavigate } from "./useNavigate-CFC-nTvW.mjs";
import { t as authenticate } from "./auth-s-szfDjd.mjs";
import { t as ArrowRight } from "./arrow-right-9_XiimCx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-C41y_yCK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignupPage() {
	const [name, setName] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim() || !password.trim()) return;
		setLoading(true);
		setError("");
		try {
			await authenticate({ data: {
				name: name.trim(),
				password
			} });
			navigate({ to: "/" });
		} catch (err) {
			setError(err.message || "Authentication failed. Please check your password.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-[80vh] flex flex-col items-center justify-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-5xl uppercase tracking-tight leading-[0.9] mb-8",
				children: [
					"Join",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"The Loop."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "flex flex-col gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "CHOOSE A USERNAME",
						className: "w-full bg-transparent border-b-4 border-foreground px-1 py-3 font-display text-3xl uppercase tracking-tight focus:outline-none focus:border-primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "CREATE PASSWORD",
						className: "w-full bg-transparent border-b-4 border-foreground px-1 py-3 font-display text-3xl uppercase tracking-tight focus:outline-none focus:border-primary"
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-red-500 font-mono text-xs uppercase tracking-widest",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: !name.trim() || !password.trim() || loading,
						className: "mt-4 inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-4 rounded-xl font-mono text-xs font-bold uppercase disabled:opacity-30 hover:bg-primary transition-colors",
						children: [
							loading ? "Processing..." : "Sign Up",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { SignupPage as component };
