import { o as __toESM } from "../_runtime.mjs";
import { _ as useRouteContext, g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as useQuery, i as useSuspenseQuery, r as useSuspenseInfiniteQuery } from "../_libs/tanstack__react-query.mjs";
import { c as useProfile, i as matchScore, l as useSaved, o as useInterested, s as usePassed } from "./local-store-BXuhZBic.mjs";
import { a as opportunitiesQuery, i as opportunitiesByIdsQuery, n as fetchOpportunities, t as categoryColor } from "./opportunities-C0PIb0qa.mjs";
import { d as differenceInDays } from "../_libs/date-fns.mjs";
import { S as ArrowRight, _ as ChevronDown, f as Compass, l as MapPin, m as ChevronUp, n as X, o as Search, s as RotateCcw, u as Heart } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as MatchPie } from "./MatchPie-D6RcRrqP.mjs";
import { n as OpportunityCard, t as CountdownTimer } from "./OpportunityCard-Cu3KRx0w.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as AnimatePresence, n as useMotionValue, r as motion, t as useTransform } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-1fAIiDYU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
function DashboardSearch({ query, onQueryChange }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const containerRef = (0, import_react.useRef)(null);
	const navigate = useNavigate();
	const { data: suggestions } = useQuery({
		...opportunitiesQuery({
			q: query,
			limit: 5
		}),
		enabled: query.length > 0 && open
	});
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative w-full z-50",
		ref: containerRef,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$1, {
			className: "overflow-visible bg-transparent border-none",
			shouldFilter: false,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: query,
					onChange: (e) => {
						onQueryChange(e.target.value);
						setOpen(true);
					},
					onFocus: () => setOpen(true),
					placeholder: "Search opportunities…",
					className: "w-full bg-card border-2 border-foreground rounded-2xl px-4 py-3 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:shadow-stamp focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute right-4 top-1/2 -translate-y-1/2 size-4 opacity-50" })]
			}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-full mt-2 w-full bg-card border-2 border-foreground rounded-2xl shadow-stamp overflow-hidden animate-in fade-in slide-in-from-top-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandList, {
					className: "max-h-[350px] overflow-y-auto p-2 space-y-2",
					children: !query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandGroup, {
						heading: "Quick Actions",
						className: "font-mono",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							onSelect: () => {
								setOpen(false);
								window.scrollTo({
									top: 0,
									behavior: "smooth"
								});
							},
							className: "cursor-pointer rounded-xl font-mono text-xs uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "mr-2 size-4" }), " Go to Home Feed"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							onSelect: () => {
								setOpen(false);
								navigate({ to: "/profile" });
							},
							className: "cursor-pointer rounded-xl font-mono text-xs uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "mr-2 size-4" }), " For You Profile"]
						})]
					}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: suggestions && suggestions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
						heading: `Matches for "${query}"`,
						className: "font-mono",
						children: suggestions.map((opp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							onSelect: () => {
								setOpen(false);
								navigate({
									to: "/opportunity/$id",
									params: { id: opp.id }
								});
							},
							className: "cursor-pointer rounded-xl flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col max-w-[80%]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-sm truncate leading-tight mb-1",
									children: opp.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] uppercase opacity-70 truncate",
									children: opp.organization
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 opacity-50 shrink-0" })]
						}, opp.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, {
						className: "py-6 font-mono text-xs text-center text-muted-foreground uppercase tracking-widest",
						children: "No results found."
					}) })
				})
			})]
		})
	});
}
var CATEGORIES = [
	{
		id: "all",
		label: "#FOR_YOU",
		color: "bg-card",
		rotate: "-rotate-2"
	},
	{
		id: "internship",
		label: "#INTERNSHIP",
		color: "bg-primary text-primary-foreground",
		rotate: "rotate-1"
	},
	{
		id: "scholarship",
		label: "#SCHOLARSHIP",
		color: "bg-secondary text-secondary-foreground",
		rotate: "-rotate-1"
	},
	{
		id: "competition",
		label: "#COMPETITION",
		color: "bg-foreground text-background",
		rotate: "rotate-2"
	},
	{
		id: "fellowship",
		label: "#FELLOWSHIP",
		color: "bg-indigo",
		rotate: "-rotate-2"
	},
	{
		id: "hackathon",
		label: "#HACKATHON",
		color: "bg-lime",
		rotate: "rotate-1"
	}
];
function FilterRail({ category, onCategoryChange, query, onQueryChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardSearch, {
			query,
			onQueryChange
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: CATEGORIES.map((c) => {
				const active = category === c.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onCategoryChange(c.id),
					className: [
						"px-3 py-1.5 border-2 border-foreground rounded-full font-mono text-[10px] font-bold uppercase tracking-tight transition-transform shrink-0",
						c.color,
						c.rotate,
						"hover:rotate-0 hover:scale-105",
						active ? "shadow-stamp" : ""
					].join(" "),
					children: c.label
				}, c.id);
			})
		})]
	});
}
function SwipeStack({ opps }) {
	const { profile } = useProfile();
	const { add: addInterested } = useInterested();
	const { passed, add: addPassed } = usePassed();
	const [index, setIndex] = (0, import_react.useState)(0);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [exitDir, setExitDir] = (0, import_react.useState)("right");
	const queue = (0, import_react.useMemo)(() => opps.filter((o) => !passed.includes(o.id)).slice(0, 25), [opps, passed]);
	const current = queue[index];
	const next = queue[index + 1];
	if (!current) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-2 border-dashed border-foreground/20 rounded-[28px] p-10 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl uppercase",
			children: "You're all caught up."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground mt-2",
			children: "Scroll down for the full feed."
		})]
	});
	const onSwipe = (dir) => {
		setExitDir(dir);
		if (dir === "right") addInterested(current.id);
		else addPassed(current.id);
		setHistory((h) => [...h, {
			id: current.id,
			dir
		}]);
		setIndex((i) => i + 1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
					children: "For you · swipe to triage"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-display text-2xl uppercase leading-none mt-1",
					children: [
						"Swipes ",
						index + 1,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: ["/ ", queue.length]
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !history.length,
					onClick: () => {
						setIndex((i) => Math.max(0, i - 1));
						setHistory((h) => h.slice(0, -1));
					},
					className: "p-2.5 border-2 border-foreground rounded-xl disabled:opacity-30 hover:bg-accent",
					"aria-label": "Undo",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-[420px]",
				children: [next && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardShell, {
					opp: next,
					score: matchScore(profile, next.tags),
					stacked: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					custom: exitDir,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwipeCard, {
						opp: current,
						score: matchScore(profile, current.tags),
						onSwipe,
						custom: exitDir
					}, current.id)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-center items-center gap-4 mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onSwipe("left"),
						className: "size-14 rounded-full bg-card border-2 border-foreground shadow-stamp flex items-center justify-center hover:-translate-y-1 transition-transform",
						"aria-label": "Pass",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "← pass · save →"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onSwipe("right"),
						className: "size-14 rounded-full bg-primary text-primary-foreground border-2 border-foreground shadow-stamp flex items-center justify-center hover:-translate-y-1 transition-transform",
						"aria-label": "Interested",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-6 fill-current" })
					})
				]
			})
		]
	});
}
function SwipeCard({ opp, score, onSwipe, custom }) {
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-300, 300], [-18, 18]);
	const likeOpacity = useTransform(x, [40, 140], [0, 1]);
	const nopeOpacity = useTransform(x, [-140, -40], [1, 0]);
	const onEnd = (_, info) => {
		if (info.offset.x > 120 || info.velocity.x > 600) onSwipe("right");
		else if (info.offset.x < -120 || info.velocity.x < -600) onSwipe("left");
	};
	const now = /* @__PURE__ */ new Date();
	opp.application_start_date && differenceInDays(new Date(opp.application_start_date), now);
	differenceInDays(new Date(opp.deadline), now);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		drag: "x",
		dragConstraints: {
			left: 0,
			right: 0
		},
		onDragEnd: onEnd,
		style: {
			x,
			rotate
		},
		variants: {
			initial: {
				scale: .9,
				opacity: 0
			},
			animate: {
				scale: 1,
				opacity: 1
			},
			exit: (dir) => ({
				x: dir === "right" ? 600 : -600,
				opacity: 0,
				transition: { duration: .25 }
			})
		},
		initial: "initial",
		animate: "animate",
		exit: "exit",
		custom,
		className: "absolute inset-0 cursor-grab active:cursor-grabbing",
		whileTap: { cursor: "grabbing" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardShell, {
			opp,
			score,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					style: { opacity: likeOpacity },
					className: "absolute top-6 left-6 px-3 py-1 border-4 border-primary text-primary font-display text-3xl uppercase rotate-[-12deg] rounded-lg",
					children: "Interested"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					style: { opacity: nopeOpacity },
					className: "absolute top-6 right-6 px-3 py-1 border-4 border-foreground text-foreground font-display text-3xl uppercase rotate-[12deg] rounded-lg",
					children: "Pass"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-6 right-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountdownTimer, {
						deadline: opp.deadline,
						short: true
					})
				})
			]
		})
	});
}
function CardShell({ opp, score, stacked, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `absolute inset-0 flex flex-col bg-card border-2 border-foreground rounded-[28px] shadow-stamp-lg overflow-hidden ${stacked ? "scale-[0.94] translate-y-3 opacity-60 pointer-events-none" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `shrink-0 px-5 py-2 ${categoryColor[opp.category]} font-mono text-[10px] font-bold uppercase tracking-wider`,
			children: [
				opp.category,
				" · ",
				opp.organization,
				" ",
				opp.verified ? "✓" : ""
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 md:p-8 flex-1 flex flex-col min-h-0 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-foreground/75 mb-4 line-clamp-2",
					children: opp.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-3xl md:text-4xl uppercase tracking-tight leading-[0.95] flex-1 text-balance",
						children: opp.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchPie, {
						score,
						size: 86
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto pt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }), opp.location]
						}),
						opp.work_mode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center gap-1.5 font-mono uppercase text-[10px] border border-foreground/20 px-2 py-0.5 rounded-full",
							children: opp.work_mode
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: opp.tags.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-0.5 border border-foreground/15 rounded-full font-mono text-[10px] uppercase",
								children: t
							}, t))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/opportunity/$id",
					params: { id: opp.id },
					className: "mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-foreground hover:text-primary self-start",
					children: ["Tap for full details ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
				}),
				children
			]
		})]
	});
}
function FeedPage() {
	const [category, setCategory] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [isWatchlistExpanded, setIsWatchlistExpanded] = (0, import_react.useState)(true);
	const deferredQuery = (0, import_react.useDeferredValue)(query);
	const { profile } = useProfile();
	const { saved } = useSaved();
	const { interested } = useInterested();
	const profileTokens = (0, import_react.useMemo)(() => Array.from(new Set([
		...profile.skills,
		...profile.interests,
		profile.field
	].filter(Boolean))), [profile]);
	const { data: trackedOpps } = useSuspenseQuery(opportunitiesByIdsQuery((0, import_react.useMemo)(() => Array.from(/* @__PURE__ */ new Set([...saved])), [saved])));
	const activeSavedCount = trackedOpps ? trackedOpps.filter((a) => new Date(a.deadline).getTime() >= Date.now()).length : 0;
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
		queryKey: [
			"opportunities_infinite",
			category,
			deferredQuery,
			profileTokens
		],
		queryFn: ({ pageParam }) => fetchOpportunities({ data: {
			category,
			q: deferredQuery,
			page: pageParam,
			limit: 20,
			profileTokens
		} }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => lastPage.length === 20 ? allPages.length + 1 : void 0
	});
	const filtered = (0, import_react.useMemo)(() => {
		const arr = [...data.pages.flat()];
		arr.sort((a, b) => {
			const scoreA = matchScore(profile, a.tags);
			const scoreB = matchScore(profile, b.tags);
			if (scoreB !== scoreA) return scoreB - scoreA;
			return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
		});
		return arr;
	}, [data, profile]);
	const upcoming = (0, import_react.useMemo)(() => [...filtered].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 5), [filtered]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "max-w-6xl mx-auto px-6 py-10 lg:py-14 grid grid-cols-12 gap-8 lg:gap-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "col-span-12 lg:col-span-4 flex flex-col gap-7 lg:sticky lg:top-10 lg:self-start lg:max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar pb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-entry",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-6xl uppercase tracking-tighter leading-[0.85] italic",
							children: [
								"Hey,",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								(profile.name || "Student").split(" ")[0],
								"."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] uppercase tracking-widest text-muted-foreground mt-3",
							children: [
								filtered.length,
								" opps · ",
								activeSavedCount,
								" saved · ",
								interested.length,
								" ♥"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-50 animate-entry [animation-delay:80ms]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterRail, {
							category,
							onCategoryChange: setCategory,
							query,
							onQueryChange: setQuery
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/profile",
						className: "block animate-entry [animation-delay:160ms] p-6 bg-foreground text-background rounded-3xl hover:-translate-y-1 hover:shadow-stamp-lg transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-[10px] opacity-50 mb-4 tracking-widest flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "USER_PROFILE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[8px] border border-background/20 px-1.5 py-0.5 rounded",
									children: "EDIT →"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-12 rounded-full bg-primary flex items-center justify-center font-display text-xl text-primary-foreground overflow-hidden shrink-0",
									children: profile.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: profile.avatar,
										alt: "avatar",
										className: "w-full h-full object-cover"
									}) : (profile.name || "ST").slice(0, 2).toUpperCase()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-sm truncate",
										children: profile.name || "Student"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs opacity-60 line-clamp-2",
										children: profile.future_you || "Dream your future..."
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-[10px] opacity-50 tracking-widest",
									children: "SKILLS"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1",
									children: (profile.skills.length ? profile.skills : [
										"Add",
										"Some",
										"Skills"
									]).slice(0, 8).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 bg-background/10 rounded-full font-mono text-[10px] uppercase",
										children: t
									}, t))
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "col-span-12 lg:col-span-8 flex flex-col gap-8 lg:pl-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwipeStack, { opps: filtered }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end justify-between mb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "All matches · ranked for you"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl uppercase tracking-tight leading-none mt-1",
						children: "The full feed"
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-5",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-2 border-dashed border-foreground/20 rounded-3xl p-16 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-4xl uppercase",
							children: "Nothing matches."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2",
							children: "Try clearing the filters."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [filtered.map((opp, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpportunityCard, {
						opp,
						index: i
					}, opp.id)), hasNextPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => fetchNextPage(),
						disabled: isFetchingNextPage,
						className: "w-full mt-4 py-4 bg-foreground text-background font-mono text-xs font-bold uppercase rounded-2xl hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
						children: isFetchingNextPage ? "Loading..." : "Load More"
					})] })
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden xl:block fixed right-6 bottom-6 w-64 bg-foreground text-background rounded-3xl p-5 shadow-stamp-lg z-30 transition-all",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setIsWatchlistExpanded(!isWatchlistExpanded),
					className: "w-full flex items-center justify-between font-mono text-[10px] opacity-70 hover:opacity-100 tracking-widest outline-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 bg-primary rounded-full animate-pulse" }), " WATCHLIST"]
					}), isWatchlistExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3" })]
				}), isWatchlistExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3 mt-4 animate-in fade-in slide-in-from-top-1",
					children: upcoming.map((o) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-l-2 border-primary pl-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[9px] uppercase opacity-60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountdownTimer, {
									deadline: o.deadline,
									short: true
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold leading-tight truncate",
								children: o.title
							})]
						}, o.id);
					})
				})]
			})
		]
	});
}
function LandingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-[80vh] flex flex-col items-center justify-center text-center px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-7xl md:text-9xl uppercase tracking-tighter leading-none italic",
				children: ["LOOP", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary",
					children: "."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 font-mono text-sm uppercase tracking-widest text-muted-foreground max-w-2xl",
				children: "No more missed deadlines. A curated feed of internships, scholarships, and competitions tailored for you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex items-center justify-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/signup",
					className: "bg-foreground text-background px-8 py-4 rounded-full font-mono text-sm font-bold uppercase hover:bg-primary transition-colors",
					children: "Get Started"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "border-2 border-foreground px-8 py-4 rounded-full font-mono text-sm font-bold uppercase hover:bg-foreground/5 transition-colors",
					children: "Log In"
				})]
			})
		]
	});
}
var SplitComponent = function IndexPage() {
	const { user } = useRouteContext({ from: "__root__" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingPage, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedPage, {});
};
//#endregion
export { SplitComponent as component };
