import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as ResponsiveContainer, n as Pie, r as Cell, t as PieChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MatchPie-D6RcRrqP.js
var import_jsx_runtime = require_jsx_runtime();
function MatchPie({ score, size = 120, label = true }) {
	const data = [{
		name: "match",
		value: score
	}, {
		name: "gap",
		value: 100 - score
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative inline-flex items-center justify-center",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PieChart, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pie, {
				data,
				dataKey: "value",
				innerRadius: "72%",
				outerRadius: "100%",
				startAngle: 90,
				endAngle: -270,
				stroke: "none",
				isAnimationActive: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: score >= 70 ? "var(--primary)" : score >= 40 ? "var(--lime)" : "var(--muted-foreground)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "color-mix(in oklab, var(--foreground) 10%, transparent)" })]
			}) })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-display text-2xl leading-none",
				children: [score, "%"]
			}), label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[8px] uppercase tracking-widest text-muted-foreground mt-1",
				children: "match"
			})]
		})]
	});
}
//#endregion
export { MatchPie as t };
