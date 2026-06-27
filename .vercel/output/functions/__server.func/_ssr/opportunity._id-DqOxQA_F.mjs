import { t as require_jsx_runtime } from "./jsx-runtime-BgNeXRf5.mjs";
import { t as Link } from "./link-DVgF5IIH.mjs";
import { a as useApplied, c as useProfile, i as matchScore, l as useSaved } from "./local-store-CcXE9Eyb.mjs";
import { t as useSuspenseQuery } from "./useSuspenseQuery-CAV0a-DZ.mjs";
import { o as opportunityByIdQuery, t as categoryColor } from "./opportunities-cMMFOfN1.mjs";
import { n as differenceInDays } from "./differenceInDays-FIwXrGRV.mjs";
import { t as createLucideIcon } from "./createLucideIcon-DahuBJmx.mjs";
import { n as format, t as Calendar } from "./calendar-BQfYQiWU.mjs";
import { t as Route } from "./opportunity._id-Cufs-hBM.mjs";
import { t as formatDistanceToNowStrict } from "./formatDistanceToNowStrict-Bja_p55D.mjs";
import { t as Sparkles } from "./sparkles-Ccv4BjdX.mjs";
import { a as Users, i as MatchPie, n as BookmarkCheck, r as MapPin, t as Bookmark } from "./MatchPie-CI2UORX1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/opportunity._id-DqOxQA_F.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowLeft = createLucideIcon("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Check = createLucideIcon("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ExternalLink = createLucideIcon("external-link", [
	["path", {
		d: "M15 3h6v6",
		key: "1q9fwt"
	}],
	["path", {
		d: "M10 14 21 3",
		key: "gplh6r"
	}],
	["path", {
		d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
		key: "a6xqqp"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Trophy = createLucideIcon("trophy", [
	["path", {
		d: "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",
		key: "1n3hpd"
	}],
	["path", {
		d: "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",
		key: "rfe1zi"
	}],
	["path", {
		d: "M18 9h1.5a1 1 0 0 0 0-5H18",
		key: "7xy6bh"
	}],
	["path", {
		d: "M4 22h16",
		key: "57wxv0"
	}],
	["path", {
		d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",
		key: "1mhfuq"
	}],
	["path", {
		d: "M6 9H4.5a1 1 0 0 1 0-5H6",
		key: "tex48p"
	}]
]);
var import_jsx_runtime = require_jsx_runtime();
function DetailPage() {
	const opp = Route.useLoaderData();
	const { data: live } = useSuspenseQuery(opportunityByIdQuery(opp.id));
	const o = live ?? opp;
	const { isSaved, toggle } = useSaved();
	const { isApplied, toggle: toggleApplied } = useApplied();
	const { profile } = useProfile();
	const saved = isSaved(o.id);
	const applied = isApplied(o.id);
	const score = matchScore(profile, o.tags);
	const profileTokens = new Set([...profile.skills, ...profile.interests].map((s) => s.toLowerCase()));
	const matched = o.tags.filter((t) => profileTokens.has(t.toLowerCase()));
	const missing = o.tags.filter((t) => !profileTokens.has(t.toLowerCase()));
	const now = /* @__PURE__ */ new Date();
	const startsIn = o.application_start_date ? differenceInDays(new Date(o.application_start_date), now) : -1;
	const daysLeft = differenceInDays(new Date(o.deadline), now);
	const isFuture = startsIn > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "max-w-4xl mx-auto px-6 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/",
			className: "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), " Back to feed"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-entry bg-card border-2 border-foreground rounded-[32px] shadow-stamp-lg overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `px-8 py-3 ${categoryColor[o.category]} font-mono text-[11px] font-bold uppercase tracking-wider`,
				children: [
					o.category,
					" · posted ",
					formatDistanceToNowStrict(new Date(o.posted_at)),
					" ago",
					o.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-3 px-2 py-0.5 bg-blue-500 text-white font-mono text-[10px] font-bold uppercase rounded-sm",
						children: "✓ Verified"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 md:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 mb-6 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3",
							children: o.organization
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-5xl md:text-7xl uppercase tracking-tight leading-[0.9] text-balance",
							children: o.title
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center md:items-end gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchPie, {
								score,
								size: 140
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "profile match"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg leading-relaxed text-foreground/80 max-w-prose mb-8",
						children: o.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4" }),
								label: isFuture ? "Opens In" : "Deadline",
								value: isFuture ? `${startsIn} days` : daysLeft <= 0 ? "Today" : `${daysLeft} days`,
								sub: isFuture && o.application_start_date ? format(new Date(o.application_start_date), "MMM dd, yyyy") : format(new Date(o.deadline), "MMM dd, yyyy")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }),
								label: "Location",
								value: o.location,
								sub: o.work_mode?.toUpperCase()
							}),
							o.prize_amount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" }),
								label: "Reward",
								value: o.prize_amount
							}),
							o.participants ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }),
								label: "Applied",
								value: o.participants.toLocaleString()
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 border-2 border-foreground/15 rounded-3xl p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Skills required for this opportunity"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-[10px] uppercase tracking-widest text-primary mb-2",
								children: [
									"You have (",
									matched.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: matched.length ? matched.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-3 py-1 bg-primary text-primary-foreground rounded-full font-mono text-[10px] font-bold uppercase inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), t]
								}, t)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] text-muted-foreground uppercase",
									children: "Add skills to your profile"
								})
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2",
								children: [
									"Grow into (",
									missing.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: missing.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-3 py-1 border-2 border-dashed border-foreground/30 rounded-full font-mono text-[10px] font-bold uppercase",
									children: t
								}, t))
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [
							o.apply_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: o.apply_url,
								target: "_blank",
								rel: "noreferrer noopener",
								onClick: () => {
									if (!applied) toggleApplied(o.id);
								},
								className: "inline-flex items-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-primary transition-colors",
								children: ["Apply now ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggle(o.id),
								className: `inline-flex items-center gap-2 border-2 border-foreground px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase transition-colors ${saved ? "bg-secondary text-secondary-foreground" : "bg-card hover:bg-accent"}`,
								children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "size-4" }), " Saved"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), " Save"] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => toggleApplied(o.id),
								className: `inline-flex items-center gap-2 border-2 border-foreground px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase transition-colors ${applied ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }),
									" ",
									applied ? "Marked applied" : "Mark applied"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									if (typeof window !== "undefined" && navigator.share) navigator.share({
										title: o.title,
										url: window.location.href
									}).catch(() => {});
									else if (typeof window !== "undefined") navigator.clipboard?.writeText(window.location.href);
								},
								className: "inline-flex items-center gap-2 border-2 border-foreground px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-accent",
								children: "Share link"
							})
						]
					})
				]
			})]
		})]
	});
}
function Stat({ icon, label, value, sub }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-2 border-foreground/15 rounded-2xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
				children: [
					icon,
					" ",
					label
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-2xl uppercase leading-tight mt-1",
				children: value
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[10px] text-muted-foreground uppercase mt-0.5",
				children: sub
			})
		]
	});
}
//#endregion
export { DetailPage as component };
