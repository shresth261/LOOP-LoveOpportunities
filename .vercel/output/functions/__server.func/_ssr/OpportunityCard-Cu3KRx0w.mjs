import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useProfile, i as matchScore, l as useSaved } from "./local-store-BXuhZBic.mjs";
import { t as categoryColor } from "./opportunities-C0PIb0qa.mjs";
import { a as formatDistanceToNowStrict, d as differenceInDays, u as differenceInSeconds } from "../_libs/date-fns.mjs";
import { b as Bookmark, l as MapPin, p as Clock, r as Users, x as BookmarkCheck } from "../_libs/lucide-react.mjs";
import { t as MatchPie } from "./MatchPie-D6RcRrqP.mjs";
import { t as useNow } from "./use-now-BuTBBodb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OpportunityCard-Cu3KRx0w.js
var import_jsx_runtime = require_jsx_runtime();
function CountdownTimer({ deadline, className = "", short = false }) {
	const timeLeft = calculateTimeLeft(deadline, short, useNow(1e3));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center ${className}`,
		children: [!short && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 mr-1" }), timeLeft]
	});
}
function calculateTimeLeft(deadline, short, now) {
	const diffInSeconds = differenceInSeconds(new Date(deadline), new Date(now));
	if (diffInSeconds <= 0) return short ? "Today" : "Ended";
	const days = Math.floor(diffInSeconds / (3600 * 24));
	const hours = Math.floor(diffInSeconds % (3600 * 24) / 3600);
	const minutes = Math.floor(diffInSeconds % 3600 / 60);
	const seconds = diffInSeconds % 60;
	if (short) {
		if (days > 0) return `In ${days}d`;
		if (hours > 0) return `In ${hours}h`;
		if (minutes > 0) return `In ${minutes}m`;
		return `In ${seconds}s`;
	}
	if (days > 7) return `${days}d left`;
	if (days > 0) return `${days}d ${hours}h left`;
	if (hours > 0) return `${hours}h ${minutes}m left`;
	return `${minutes}m ${seconds}s left`;
}
function OpportunityCard({ opp, index = 0 }) {
	const { saved, toggle: toggleSaved } = useSaved();
	const { profile } = useProfile();
	const isSaved = saved.includes(opp.id);
	const handleToggle = (e) => {
		e.preventDefault();
		e.stopPropagation();
		toggleSaved(opp.id);
	};
	const score = matchScore(profile, opp.tags);
	const now = /* @__PURE__ */ new Date();
	const startsIn = opp.application_start_date ? differenceInDays(new Date(opp.application_start_date), now) : -1;
	const daysLeft = differenceInDays(new Date(opp.deadline), now);
	const urgent = startsIn <= 0 && daysLeft <= 7;
	const isFuture = startsIn > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "animate-entry bg-card border-2 border-foreground rounded-[28px] shadow-stamp hover:shadow-stamp-lg hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200",
		style: { animationDelay: `${index * 60}ms` },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${categoryColor[opp.category]}`,
								children: opp.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest",
								children: [
									"· Posted ",
									formatDistanceToNowStrict(new Date(opp.posted_at)),
									" ago"
								]
							}),
							opp.featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-0.5 bg-lime text-foreground font-mono text-[10px] font-bold uppercase",
								children: "★ Featured"
							}),
							opp.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-0.5 bg-blue-500 text-white font-mono text-[10px] font-bold uppercase rounded-sm",
								children: "✓ Verified"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/opportunity/$id",
						params: { id: opp.id },
						className: "block group",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-3xl md:text-4xl uppercase tracking-tight leading-[0.95] mb-3 group-hover:text-primary transition-colors text-balance",
							children: opp.title
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3",
						children: opp.organization
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-foreground/70 max-w-prose line-clamp-2",
						children: opp.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-4 mt-5 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }), opp.location]
							}),
							opp.work_mode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1.5 font-mono uppercase text-[10px] border border-foreground/20 px-2 py-0.5 rounded-full",
								children: opp.work_mode
							}),
							opp.participants ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }),
									opp.participants.toLocaleString(),
									" applied"
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: opp.tags.slice(0, 3).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 border border-foreground/15 rounded-full font-mono text-[10px] uppercase",
									children: t
								}, t))
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex md:flex-col md:items-end justify-between md:w-44 gap-3 md:border-l-2 md:border-dashed md:border-foreground/20 md:pl-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-left md:text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest",
								children: isFuture ? "Opens in" : urgent ? "Closing" : "Deadline"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `font-display text-xl md:text-2xl uppercase leading-none mt-1 ${urgent ? "text-primary" : ""}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountdownTimer, { deadline: opp.deadline })
							}),
							opp.prize_amount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-2",
								children: opp.prize_amount
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:self-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchPie, {
							score,
							size: 84
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex md:flex-col gap-2 md:w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/opportunity/$id",
							params: { id: opp.id },
							className: "flex-1 text-center py-2.5 bg-foreground text-background font-mono text-[11px] font-bold uppercase rounded-lg hover:bg-primary transition-colors",
							children: "View"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleToggle,
							"aria-label": isSaved ? "Unsave" : "Save",
							className: `flex items-center justify-center gap-2 shrink-0 py-2.5 px-4 rounded-lg border-2 border-foreground font-mono text-[11px] font-bold uppercase transition-colors ${isSaved ? "bg-secondary text-secondary-foreground" : "bg-card hover:bg-accent"}`,
							children: isSaved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "size-4" }), " Saved"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), " Save"] })
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { OpportunityCard as n, CountdownTimer as t };
