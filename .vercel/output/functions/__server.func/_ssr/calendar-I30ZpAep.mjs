import { o as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { c as useProfile, l as useSaved, o as useInterested } from "./local-store-BXuhZBic.mjs";
import { a as opportunitiesQuery, i as opportunitiesByIdsQuery, t as categoryColor } from "./opportunities-C0PIb0qa.mjs";
import { c as endOfWeek, d as differenceInDays, f as addMonths, i as isSameDay, l as endOfMonth, n as startOfMonth, o as format, p as addDays, r as isSameMonth, s as startOfWeek, t as subMonths } from "../_libs/date-fns.mjs";
import { g as ChevronLeft, h as ChevronRight, y as Calendar } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-I30ZpAep.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CalendarPage() {
	const { profile } = useProfile();
	const { data: opps } = useSuspenseQuery(opportunitiesQuery({
		profileTokens: (0, import_react.useMemo)(() => Array.from(/* @__PURE__ */ new Set([...profile.skills || [], ...profile.interests || []])), [profile]),
		limit: 500
	}));
	const { interested } = useInterested();
	const { saved } = useSaved();
	const { data: trackedOpps } = useSuspenseQuery(opportunitiesByIdsQuery((0, import_react.useMemo)(() => Array.from(/* @__PURE__ */ new Set([...saved, ...interested])), [saved, interested])));
	const [cursor, setCursor] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [filter, setFilter] = (0, import_react.useState)("all");
	const tracked = (0, import_react.useMemo)(() => /* @__PURE__ */ new Set([...interested, ...saved]), [interested, saved]);
	const combinedOpps = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		opps.forEach((o) => map.set(o.id, o));
		if (trackedOpps) trackedOpps.forEach((o) => map.set(o.id, o));
		return Array.from(map.values());
	}, [opps, trackedOpps]);
	const visible = (0, import_react.useMemo)(() => filter === "tracked" ? combinedOpps.filter((o) => tracked.has(o.id)) : combinedOpps, [
		combinedOpps,
		filter,
		tracked
	]);
	const byDay = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		visible.forEach((o) => {
			const key = format(new Date(o.deadline), "yyyy-MM-dd");
			const arr = m.get(key) ?? [];
			arr.push(o);
			m.set(key, arr);
		});
		return m;
	}, [visible]);
	const days = (0, import_react.useMemo)(() => {
		const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
		const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
		const out = [];
		let d = start;
		while (d <= end) {
			out.push(d);
			d = addDays(d, 1);
		}
		return out;
	}, [cursor]);
	const selectedItems = selected ? byDay.get(format(selected, "yyyy-MM-dd")) ?? [] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "max-w-6xl mx-auto px-6 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4 mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3" }), " Schedule"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-6xl uppercase tracking-tighter italic leading-[0.85]",
				children: [
					"Deadline",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Map."
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex rounded-full border-2 border-foreground p-0.5",
					children: ["all", "tracked"].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFilter(f),
						className: `px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest rounded-full ${filter === f ? "bg-foreground text-background" : ""}`,
						children: f === "all" ? "All" : `Tracked · ${tracked.size}`
					}, f))
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-12 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "col-span-12 lg:col-span-8 bg-card border-2 border-foreground rounded-[28px] p-5 shadow-stamp",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-center justify-between mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCursor(subMonths(cursor, 1)),
								className: "p-2 hover:bg-accent rounded-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-3xl uppercase tracking-tight",
								children: format(cursor, "MMMM yyyy")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCursor(addMonths(cursor, 1)),
								className: "p-2 hover:bg-accent rounded-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 gap-1 mb-2",
						children: [
							"M",
							"T",
							"W",
							"T",
							"F",
							"S",
							"S"
						].map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center py-1",
							children: d
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 gap-1",
						children: days.map((d) => {
							const key = format(d, "yyyy-MM-dd");
							const list = byDay.get(key) ?? [];
							const inMonth = isSameMonth(d, cursor);
							const isToday = isSameDay(d, /* @__PURE__ */ new Date());
							const isSel = selected && isSameDay(d, selected);
							const hasItems = list.length > 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelected(d),
								className: `relative aspect-square p-1.5 rounded-xl border-2 flex flex-col items-start text-left transition-all
                    ${isSel ? "border-foreground bg-foreground text-background" : "border-transparent hover:border-foreground/30"}
                    ${filter === "tracked" && hasItems && !isSel ? "bg-primary/10 border-primary/20" : ""}
                    ${!inMonth ? "opacity-30" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `font-mono text-xs ${isToday ? "font-bold text-primary" : ""}`,
									children: format(d, "d")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-auto flex flex-wrap gap-0.5",
									children: [list.slice(0, 3).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${categoryColor[o.category].split(" ")[0]}` }, o.id)), list.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[8px] opacity-60",
										children: ["+", list.length - 3]
									})]
								})]
							}, key);
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "col-span-12 lg:col-span-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-foreground text-background rounded-[28px] p-6 shadow-stamp-lg sticky top-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] uppercase tracking-widest opacity-60 mb-1",
							children: selected ? format(selected, "EEEE") : "Pick a day"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-4xl uppercase leading-none mb-5",
							children: selected ? format(selected, "MMM dd").toUpperCase() : "—"
						}),
						selectedItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs opacity-60",
							children: "No deadlines on this day."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3 max-h-[420px] overflow-auto pr-1",
							children: selectedItems.map((o) => {
								const d = differenceInDays(new Date(o.deadline), /* @__PURE__ */ new Date());
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/opportunity/$id",
									params: { id: o.id },
									className: "block border-l-2 border-primary pl-3 hover:opacity-80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-mono text-[9px] uppercase tracking-widest opacity-60",
											children: [
												o.category,
												" · ",
												d <= 0 ? "today" : `in ${d}d`
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-semibold leading-tight",
											children: o.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-[10px] opacity-50",
											children: o.organization
										})
									]
								}) }, o.id);
							})
						})
					]
				})
			})]
		})]
	});
}
//#endregion
export { CalendarPage as component };
