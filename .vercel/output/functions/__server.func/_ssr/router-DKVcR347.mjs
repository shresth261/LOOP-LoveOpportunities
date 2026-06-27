import { o as __toESM } from "../_runtime.mjs";
import { M as redirect, _ as useRouteContext, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as useQuery, o as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { l as useSaved } from "./local-store-BXuhZBic.mjs";
import { a as opportunitiesQuery, i as opportunitiesByIdsQuery, r as fetchTickerOpportunities } from "./opportunities-C0PIb0qa.mjs";
import { a as formatDistanceToNowStrict } from "../_libs/date-fns.mjs";
import { n as X, p as Clock } from "../_libs/lucide-react.mjs";
import { n as getCurrentUser, r as logout } from "./auth-DFr8Scme.mjs";
import { t as Route$7 } from "./opportunity._id-BPktrsxG.mjs";
import { i as masterSkillsQuery, r as masterInterestsQuery } from "./master-data-D5fpr9z_.mjs";
import { t as useNow } from "./use-now-BuTBBodb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DKVcR347.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DYJGh-DR.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[60vh] items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[10rem] leading-none uppercase tracking-tighter italic text-primary",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-widest text-muted-foreground",
					children: "Page not in the loop."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-block mt-6 rounded-xl bg-foreground px-5 py-3 font-mono text-xs font-bold uppercase text-background",
					children: "Back to feed"
				})
			]
		})
	});
}
var nav = [
	{
		to: "/",
		label: "Feed"
	},
	{
		to: "/calendar",
		label: "Calendar"
	},
	{
		to: "/saved",
		label: "Saved"
	},
	{
		to: "/profile",
		label: "Profile"
	}
];
function SiteHeader() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { user } = useRouteContext({ from: "__root__" });
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-[28px] z-40 bg-background/80 backdrop-blur-md border-b-2 border-foreground/10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "font-display text-3xl uppercase tracking-tighter italic leading-none shrink-0",
				children: ["LOOP", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary",
					children: "."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-1",
				children: [user && nav.map((n) => {
					const active = pathname === n.to;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.to,
						className: ["px-4 py-2 rounded-full font-mono text-[11px] font-bold uppercase tracking-tight transition-all", active ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"].join(" "),
						children: n.label
					}, n.to);
				}), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: async () => {
						await logout();
						router.invalidate();
					},
					className: "px-4 py-2 rounded-full font-mono text-[11px] font-bold uppercase tracking-tight text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all",
					children: "Logout"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "px-4 py-2 rounded-full font-mono text-[11px] font-bold uppercase tracking-tight text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all",
					children: "Log In"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/signup",
					className: "px-4 py-2 rounded-full font-mono text-[11px] font-bold uppercase tracking-tight bg-foreground text-background hover:bg-primary transition-colors",
					children: "Sign Up"
				})] })]
			})]
		})
	});
}
function DeadlineTicker() {
	const { data } = useQuery({
		queryKey: ["ticker"],
		queryFn: async () => {
			return await fetchTickerOpportunities() ?? [];
		},
		staleTime: 6e4
	});
	const items = data && data.length ? data : [{
		title: "Loading opportunities",
		organization: "LOOP",
		deadline: (/* @__PURE__ */ new Date()).toISOString()
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "sticky top-0 z-50 bg-primary text-primary-foreground py-1.5 overflow-hidden border-b-2 border-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "marquee-content gap-10 whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-tight",
			children: [...items, ...items].map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						o.organization,
						" · ",
						o.title
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "opacity-60",
						children: ["closes in ", formatDistanceToNowStrict(new Date(o.deadline))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "opacity-50",
						children: "✦"
					})
				]
			}, i))
		})
	});
}
function fmt(ms) {
	if (ms <= 0) return "00:00:00:00";
	const s = Math.floor(ms / 1e3);
	const days = Math.floor(s / 86400);
	const hours = Math.floor(s % 86400 / 3600);
	const mins = Math.floor(s % 3600 / 60);
	const secs = s % 60;
	const pad = (n) => String(n).padStart(2, "0");
	return `${pad(days)}:${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}
function DeadlinePopup() {
	const { saved } = useSaved();
	const { data: opps = [] } = useQuery(opportunitiesByIdsQuery((0, import_react.useMemo)(() => Array.from(/* @__PURE__ */ new Set([...saved])), [saved])));
	const now = useNow(1e3);
	const [dismissed, setDismissed] = (0, import_react.useState)(false);
	const next = (0, import_react.useMemo)(() => {
		return opps.filter((o) => new Date(o.deadline).getTime() > now).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];
	}, [opps, now]);
	if (!next || dismissed) return null;
	const remaining = new Date(next.deadline).getTime() - now;
	const urgent = remaining < 1e3 * 60 * 60 * 72;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-5 left-5 z-40 max-w-xs animate-entry",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `bg-foreground text-background rounded-2xl p-4 shadow-stamp-lg border-2 ${urgent ? "border-primary" : "border-foreground"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-1.5 rounded-full ${urgent ? "bg-primary animate-pulse" : "bg-lime"}` }), urgent ? "Closing soon" : "Up next"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Dismiss",
					onClick: () => setDismissed(true),
					className: "opacity-50 hover:opacity-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/opportunity/$id",
				params: { id: next.id },
				className: "block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg uppercase leading-tight line-clamp-2",
						children: next.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[10px] opacity-60 uppercase tracking-widest mt-1",
						children: next.organization
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: `size-4 ${urgent ? "text-primary" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-base font-bold tabular-nums tracking-tight",
							children: fmt(remaining)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[9px] uppercase tracking-widest opacity-50 mt-1",
						children: "days : hrs : min : sec"
					})
				]
			})]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-6xl uppercase tracking-tighter",
					children: "Glitch."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-mono text-xs uppercase text-muted-foreground",
					children: "Something broke on our end."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-xl bg-foreground px-5 py-3 font-mono text-xs font-bold uppercase text-background",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-xl border-2 border-foreground px-5 py-3 font-mono text-xs font-bold uppercase",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$6 = createRootRouteWithContext()({
	beforeLoad: async () => {
		return { user: await getCurrentUser() };
	},
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "LOOP — Opportunities for students that actually land" },
			{
				name: "description",
				content: "Personalised feed aggregating internships, scholarships, fellowships and competitions. Filter by your profile. Never miss a deadline."
			},
			{
				property: "og:title",
				content: "LOOP — Opportunities for students"
			},
			{
				property: "og:description",
				content: "A mixtape of internships, scholarships and competitions, curated for you."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFound,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient, user } = Route$6.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeadlineTicker, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
				user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeadlinePopup, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "border-t-2 border-foreground/10 mt-24 py-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-3xl uppercase tracking-tighter italic",
							children: "LOOP."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase text-muted-foreground tracking-widest mt-2",
							children: "v.03 — built for the curious"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "© 2026 · No more missed deadlines."
						})]
					})
				})
			]
		})
	});
}
var $$splitComponentImporter$5 = () => import("./signup-BAv2fuPk.mjs");
var Route$5 = createFileRoute("/signup")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./saved-BHciJGjs.mjs");
var Route$4 = createFileRoute("/saved")({
	head: () => ({ meta: [{ title: "Saved — LOOP" }] }),
	beforeLoad: ({ context }) => {
		if (!context.user) throw redirect({ to: "/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./profile-CYd1mC8E.mjs");
var Route$3 = createFileRoute("/profile")({
	head: () => ({ meta: [{ title: "Profile — LOOP" }] }),
	beforeLoad: ({ context }) => {
		if (!context.user) throw redirect({ to: "/login" });
	},
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(masterSkillsQuery());
		await queryClient.ensureQueryData(masterInterestsQuery());
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./login-DOfGsjtt.mjs");
var Route$2 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitNotFoundComponentImporter$1 = () => import("./calendar-D44plneW.mjs");
var $$splitErrorComponentImporter$1 = () => import("./calendar-DqRwFy27.mjs");
var $$splitComponentImporter$1 = () => import("./calendar-I30ZpAep.mjs");
var Route$1 = createFileRoute("/calendar")({
	head: () => ({ meta: [{ title: "Calendar — LOOP" }, {
		name: "description",
		content: "All deadlines on one page."
	}] }),
	beforeLoad: ({ context }) => {
		if (!context.user) throw redirect({ to: "/login" });
	},
	loader: () => {},
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent")
});
var $$splitNotFoundComponentImporter = () => import("./routes-DWRGMz9_.mjs");
var $$splitErrorComponentImporter = () => import("./routes-4GupaU0B.mjs");
var $$splitComponentImporter = () => import("./routes-1fAIiDYU.mjs");
var Route = createFileRoute("/")({
	head: () => ({ meta: [{ title: "LOOP — Your opportunity feed" }, {
		name: "description",
		content: "Personalised feed of internships, scholarships and competitions for students."
	}] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(opportunitiesQuery()),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
var SignupRoute = Route$5.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$6
});
var SavedRoute = Route$4.update({
	id: "/saved",
	path: "/saved",
	getParentRoute: () => Route$6
});
var ProfileRoute = Route$3.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$6
});
var LoginRoute = Route$2.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$6
});
var CalendarRoute = Route$1.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => Route$6
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	CalendarRoute,
	LoginRoute,
	ProfileRoute,
	SavedRoute,
	SignupRoute,
	OpportunityIdRoute: Route$7.update({
		id: "/opportunity/$id",
		path: "/opportunity/$id",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: {
			queryClient: new QueryClient({ defaultOptions: { queries: {
				staleTime: 300 * 1e3,
				refetchOnWindowFocus: false
			} } }),
			user: void 0
		},
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
