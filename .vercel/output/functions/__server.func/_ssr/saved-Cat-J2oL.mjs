import { t as require_jsx_runtime } from "./jsx-runtime-BgNeXRf5.mjs";
import { t as Link } from "./link-DVgF5IIH.mjs";
import { l as useSaved } from "./local-store-CcXE9Eyb.mjs";
import { t as useSuspenseQuery } from "./useSuspenseQuery-CAV0a-DZ.mjs";
import { i as opportunitiesByIdsQuery } from "./opportunities-cMMFOfN1.mjs";
import { n as OpportunityCard } from "./OpportunityCard-CZfQYPlD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-Cat-J2oL.js
var import_jsx_runtime = require_jsx_runtime();
function SavedPage() {
	const { saved } = useSaved();
	const { data: all } = useSuspenseQuery(opportunitiesByIdsQuery(Array.from(/* @__PURE__ */ new Set([...saved]))));
	const list = all ? all.filter((a) => new Date(a.deadline).getTime() >= Date.now()).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "max-w-4xl mx-auto px-6 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-10 animate-entry",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-7xl uppercase tracking-tighter italic leading-none",
				children: "Saved."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mt-3",
				children: [list.length, " opportunities you're tracking"]
			})]
		}), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-2 border-dashed border-foreground/20 rounded-3xl p-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-4xl uppercase",
					children: "No saves yet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2 mb-6",
					children: "Tap the bookmark on any opp to track it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-block bg-foreground text-background px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase",
					children: "Browse feed"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-5",
			children: list.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpportunityCard, {
				opp: o,
				index: i
			}, o.id))
		})]
	});
}
//#endregion
export { SavedPage as component };
