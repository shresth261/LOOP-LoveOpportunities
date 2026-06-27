import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-p7YWSnV8.mjs";
import { a as useQuery, s as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/local-store-BXuhZBic.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getUserData = createServerFn({ method: "GET" }).handler(createSsrRpc("6907fa552568d5834eb12249e3e6d12f714870589c75dd54f17731c3424e6055"));
var updateProfile = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("9f457b8416a227e93e125375af57c6b6fa3b436056ad7d21846dc083820e53ba"));
var toggleSaved = createServerFn({ method: "POST" }).validator((id) => id).handler(createSsrRpc("e6e07f6628d573c761668c82f0f04362484b66ac4636822c60ae4e279ed1307b"));
var toggleInterested = createServerFn({ method: "POST" }).validator((id) => id).handler(createSsrRpc("ffcdf66c7a02ec0d8d823ce486b9626f4f80bac7714c90fa892534b677ee695b"));
var addInterested = createServerFn({ method: "POST" }).validator((id) => id).handler(createSsrRpc("9a50eb9d5bf2910c54d5b6b7c0d3ff63b76eb224c0849892f51ce6be82f416d6"));
var addPassed = createServerFn({ method: "POST" }).validator((id) => id).handler(createSsrRpc("c3dd6e0c709c0c2049f29e2d6fc676dddb1b6a6c5745f8ed4b6ecfdcc2266ae9"));
var toggleApplied = createServerFn({ method: "POST" }).validator((id) => id).handler(createSsrRpc("f080637e7f1105c2c19d83605078aae66bfe3cb5a47c05f07c71939f7759d4eb"));
var local_store_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_PROFILE: () => DEFAULT_PROFILE,
	SKILL_DICTIONARY: () => SKILL_DICTIONARY,
	matchScore: () => matchScore,
	useApplied: () => useApplied,
	useInterested: () => useInterested,
	usePassed: () => usePassed,
	useProfile: () => useProfile,
	useSaved: () => useSaved,
	useUserData: () => useUserData
});
var DEFAULT_PROFILE = {
	name: "",
	onboarded: false,
	field: "",
	interests: [],
	skills: [],
	categories: [],
	preferred_locations: []
};
function useUserData() {
	return useQuery({
		queryKey: ["userData"],
		queryFn: async () => {
			return await getUserData() || {
				profile: DEFAULT_PROFILE,
				saved: [],
				interested: [],
				passed: [],
				applied: []
			};
		}
	});
}
function useListToggle(listKey, apiFn) {
	const { data } = useUserData();
	const queryClient = useQueryClient();
	const list = data?.[listKey] || [];
	const mutation = useMutation({
		mutationFn: (data) => apiFn({ data }),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ["userData"] });
			const previous = queryClient.getQueryData(["userData"]);
			queryClient.setQueryData(["userData"], (old) => {
				if (!old) return old;
				const current = old[listKey] || [];
				const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
				return {
					...old,
					[listKey]: next
				};
			});
			return { previous };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(["userData"], context?.previous);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["userData"] });
		}
	});
	return {
		list,
		toggle: (id) => mutation.mutate(id)
	};
}
function useListAdd(listKey, apiFn) {
	const { data } = useUserData();
	const queryClient = useQueryClient();
	const list = data?.[listKey] || [];
	const mutation = useMutation({
		mutationFn: (data) => apiFn({ data }),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ["userData"] });
			const previous = queryClient.getQueryData(["userData"]);
			queryClient.setQueryData(["userData"], (old) => {
				if (!old) return old;
				const current = old[listKey] || [];
				if (current.includes(id)) return old;
				return {
					...old,
					[listKey]: [...current, id]
				};
			});
			return { previous };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(["userData"], context?.previous);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["userData"] });
		}
	});
	return {
		list,
		add: (id) => mutation.mutate(id)
	};
}
function useSaved() {
	const { list, toggle } = useListToggle("saved", toggleSaved);
	return {
		saved: list,
		isSaved: (id) => list.includes(id),
		toggle
	};
}
function useInterested() {
	const { list, toggle } = useListToggle("interested", toggleInterested);
	const { add } = useListAdd("interested", addInterested);
	return {
		interested: list,
		isInterested: (id) => list.includes(id),
		toggle,
		add
	};
}
function usePassed() {
	const { list, add } = useListAdd("passed", addPassed);
	return {
		passed: list,
		isPassed: (id) => list.includes(id),
		add
	};
}
function useApplied() {
	const { list, toggle } = useListToggle("applied", toggleApplied);
	return {
		applied: list,
		isApplied: (id) => list.includes(id),
		toggle
	};
}
function useProfile() {
	const { data } = useUserData();
	const queryClient = useQueryClient();
	const profile = data?.profile || DEFAULT_PROFILE;
	const mutation = useMutation({
		mutationFn: (data) => updateProfile({ data }),
		onMutate: async (updates) => {
			await queryClient.cancelQueries({ queryKey: ["userData"] });
			const previous = queryClient.getQueryData(["userData"]);
			queryClient.setQueryData(["userData"], (old) => {
				if (!old) return old;
				return {
					...old,
					profile: {
						...old.profile,
						...updates
					}
				};
			});
			return { previous };
		},
		onError: (err, updates, context) => {
			queryClient.setQueryData(["userData"], context?.previous);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["userData"] });
		}
	});
	return {
		profile,
		update: (updates) => mutation.mutate(updates)
	};
}
var SKILL_DICTIONARY = [
	"JavaScript",
	"TypeScript",
	"Python",
	"Java",
	"C++",
	"Go",
	"Rust",
	"Swift",
	"Kotlin",
	"React",
	"Vue",
	"Angular",
	"Next.js",
	"Node.js",
	"Django",
	"Flask",
	"FastAPI",
	"SQL",
	"PostgreSQL",
	"MongoDB",
	"Firebase",
	"Supabase",
	"GraphQL",
	"REST",
	"AWS",
	"GCP",
	"Azure",
	"Docker",
	"Kubernetes",
	"CI/CD",
	"Git",
	"Linux",
	"Machine Learning",
	"Deep Learning",
	"AI",
	"TensorFlow",
	"PyTorch",
	"NLP",
	"Computer Vision",
	"Data Science",
	"Figma",
	"Sketch",
	"Adobe XD",
	"Photoshop",
	"Illustrator",
	"UI",
	"UX",
	"Product Design",
	"Branding",
	"Typography",
	"Motion",
	"After Effects",
	"Webflow",
	"Marketing",
	"SEO",
	"Content",
	"Copywriting",
	"Strategy",
	"Finance",
	"Accounting",
	"Consulting",
	"Sales",
	"Operations",
	"Product Management",
	"Analytics",
	"Excel",
	"Research",
	"Biology",
	"Chemistry",
	"Physics",
	"Mathematics",
	"Statistics",
	"Economics",
	"Writing",
	"Video",
	"Photography",
	"Music",
	"Illustration",
	"Hackathon",
	"Open Source",
	"Startup",
	"Entrepreneurship",
	"Leadership",
	"Public Speaking"
];
function matchScore(profile, oppTags) {
	if (!oppTags.length) return 0;
	const set = /* @__PURE__ */ new Set([
		...(profile.skills || []).map((s) => s.toLowerCase()),
		...(profile.interests || []).map((s) => s.toLowerCase()),
		(profile.field || "").toLowerCase()
	]);
	const hits = oppTags.filter((t) => {
		const lower = t.toLowerCase();
		for (const item of set) {
			if (!item) continue;
			if (item === lower || item.includes(lower) || lower.includes(item)) return true;
		}
		return false;
	}).length;
	const base = 15;
	const scaled = Math.round(hits / oppTags.length * 85);
	return Math.min(100, base + scaled);
}
//#endregion
export { useApplied as a, useProfile as c, matchScore as i, useSaved as l, SKILL_DICTIONARY as n, useInterested as o, local_store_exports as r, usePassed as s, DEFAULT_PROFILE as t, createSsrRpc as u };
