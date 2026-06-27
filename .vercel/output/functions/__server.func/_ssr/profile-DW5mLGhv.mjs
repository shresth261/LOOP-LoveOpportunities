import { o as __toESM } from "./rolldown-runtime-CE-6LUnI.mjs";
import { c as createServerFn } from "./createServerFn-B6xwD7pN.mjs";
import { t as require_react } from "./react-DGbDRcN1.mjs";
import { t as require_jsx_runtime } from "./jsx-runtime-BgNeXRf5.mjs";
import { a as useApplied, c as useProfile, d as useMutation, g as useQueryClient, l as useSaved, n as SKILL_DICTIONARY, o as useInterested, u as createSsrRpc } from "./local-store-CcXE9Eyb.mjs";
import { t as useSuspenseQuery } from "./useSuspenseQuery-CAV0a-DZ.mjs";
import { i as opportunitiesByIdsQuery } from "./opportunities-cMMFOfN1.mjs";
import { t as createLucideIcon } from "./createLucideIcon-DahuBJmx.mjs";
import { t as useNavigate } from "./useNavigate-CFC-nTvW.mjs";
import { t as Sparkles } from "./sparkles-Ccv4BjdX.mjs";
import { i as masterSkillsQuery, n as addMasterSkill, r as masterInterestsQuery, t as addMasterInterest } from "./master-data-Dtah3KwH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-DW5mLGhv.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LoaderCircle = createLucideIcon("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Plus = createLucideIcon("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Upload = createLucideIcon("upload", [
	["path", {
		d: "M12 3v12",
		key: "1x0j5s"
	}],
	["path", {
		d: "m17 8-5-5-5 5",
		key: "7q97r8"
	}],
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Zap = createLucideIcon("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]);
var import_react = /* @__PURE__ */ __toESM(require_react());
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("d4783f78ad4964dc896f8317b79eeba0ae57cf3fc1bb3bfd8bf2f9fbf59c90c5"));
var uploadAndAnalyzeResume = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("b733fd24ac424e5184b1f347a96db098214a5838b514b3cab1ce4a092ee52184"));
var generateFeed = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("de2c86529a278cf9a4d3e00072d2831ddb87cdea5632398a654ccc2da669527e"));
var import_jsx_runtime = require_jsx_runtime();
var ALL_TAGS = [
	"Design",
	"SWE",
	"ML",
	"Research",
	"Frontend",
	"Backend",
	"Payments",
	"AI",
	"Art",
	"UX",
	"Figma",
	"Hardware",
	"EV",
	"Engineering",
	"OSS",
	"Mentorship",
	"Pitch",
	"Entrepreneurship",
	"Founders",
	"Postgrad",
	"Finance",
	"Leadership",
	"HighSchool",
	"STEM",
	"Travel",
	"Safety"
];
var LOCATIONS = [
	"Remote",
	"Bangalore",
	"Hyderabad",
	"Pune",
	"Chennai",
	"Delhi",
	"Mumbai",
	"International"
];
function ProfilePage() {
	const { profile, update } = useProfile();
	const { saved } = useSaved();
	const { applied } = useApplied();
	const { interested } = useInterested();
	const { data: trackedOpps } = useSuspenseQuery(opportunitiesByIdsQuery(Array.from(/* @__PURE__ */ new Set([...saved]))));
	const activeSavedCount = trackedOpps ? trackedOpps.filter((a) => new Date(a.deadline).getTime() >= Date.now()).length : 0;
	const { data: dbSkills } = useSuspenseQuery(masterSkillsQuery());
	const { data: dbInterests } = useSuspenseQuery(masterInterestsQuery());
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)(profile.name);
	const [goal, setGoal] = (0, import_react.useState)(profile.goal || "");
	const [futureYou, setFutureYou] = (0, import_react.useState)(profile.future_you || "");
	const [portfolio, setPortfolio] = (0, import_react.useState)(profile.portfolio_url || "");
	const [github, setGithub] = (0, import_react.useState)(profile.github_url || "");
	const [leetcode, setLeetcode] = (0, import_react.useState)(profile.leetcode_url || "");
	const [email, setEmail] = (0, import_react.useState)(profile.email || "");
	const [isEditingLinks, setIsEditingLinks] = (0, import_react.useState)(!(profile.email || profile.portfolio_url || profile.github_url || profile.leetcode_url));
	const [isAnalyzing, setIsAnalyzing] = (0, import_react.useState)(false);
	const [analyzeError, setAnalyzeError] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const [isGeneratingFeed, setIsGeneratingFeed] = (0, import_react.useState)(false);
	const [generateFeedError, setGenerateFeedError] = (0, import_react.useState)("");
	const handleGenerateFeed = async () => {
		setIsGeneratingFeed(true);
		setGenerateFeedError("");
		try {
			await generateFeed({ data: { profile } });
			await queryClient.invalidateQueries({ queryKey: ["opportunities_infinite"] });
			await queryClient.invalidateQueries({ queryKey: ["opportunities"] });
			navigate({ to: "/" });
		} catch (err) {
			console.error(err);
			setGenerateFeedError(err.message || "Failed to generate personalized feed.");
		} finally {
			setIsGeneratingFeed(false);
		}
	};
	const handleFileUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.type !== "application/pdf") {
			setAnalyzeError("Please upload a PDF file.");
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			setAnalyzeError("File size must be under 10MB.");
			return;
		}
		setAnalyzeError("");
		setIsAnalyzing(true);
		try {
			const reader = new FileReader();
			reader.onload = async (event) => {
				try {
					const base64String = (event.target?.result).split(",")[1];
					if (!base64String) throw new Error("Failed to read file.");
					const data = await uploadAndAnalyzeResume({ data: { base64Pdf: base64String } });
					update({
						skills: Array.from(/* @__PURE__ */ new Set([
							...profile.skills,
							...data.skills || [],
							...data.programmingLanguages || [],
							...data.frameworks || [],
							...data.tools || [],
							...data.technologies || []
						])),
						interests: Array.from(/* @__PURE__ */ new Set([
							...profile.interests,
							...data.interests || [],
							...data.domains || []
						])),
						field: data.preferredRoles?.[0] || profile.field
					});
					queryClient.invalidateQueries({ queryKey: ["userData"] });
				} catch (err) {
					console.error(err);
					setAnalyzeError(err.message || "Failed to analyze resume.");
				} finally {
					setIsAnalyzing(false);
				}
			};
			reader.readAsDataURL(file);
		} catch (err) {
			console.error(err);
			setAnalyzeError("Failed to process file.");
			setIsAnalyzing(false);
		}
	};
	const addSkillMutation = useMutation({
		mutationFn: (data) => addMasterSkill({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["master-skills"] })
	});
	const addInterestMutation = useMutation({
		mutationFn: (data) => addMasterInterest({ data }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["master-interests"] })
	});
	const toggleInterest = (t) => {
		update({ interests: profile.interests.includes(t) ? profile.interests.filter((x) => x !== t) : [...profile.interests, t] });
	};
	const toggleSkill = (t) => {
		update({ skills: profile.skills.includes(t) ? profile.skills.filter((x) => x !== t) : [...profile.skills, t] });
	};
	const toggleLocation = (loc) => {
		const current = profile.preferred_locations || [];
		update({ preferred_locations: current.includes(loc) ? current.filter((x) => x !== loc) : [...current, loc] });
	};
	const handleAddCustom = (type) => {
		const val = prompt(`Add a custom ${type}:`);
		if (!val || !val.trim()) return;
		const cleanVal = val.trim();
		if (type === "skill") {
			addSkillMutation.mutate(cleanVal);
			toggleSkill(cleanVal);
		} else {
			addInterestMutation.mutate(cleanVal);
			toggleInterest(cleanVal);
		}
	};
	const handleSaveLinks = () => {
		if (!isEditingLinks) {
			setIsEditingLinks(true);
			return;
		}
		const isValidUrl = (s) => !s || s.startsWith("http://") || s.startsWith("https://");
		if (!isValidUrl(portfolio) || !isValidUrl(github) || !isValidUrl(leetcode)) {
			alert("URLs must start with http:// or https://");
			return;
		}
		update({
			portfolio_url: portfolio,
			github_url: github,
			leetcode_url: leetcode,
			email
		});
		setIsEditingLinks(false);
	};
	const initials = (profile.name || "S").substring(0, 2).toUpperCase();
	const allInterests = Array.from(/* @__PURE__ */ new Set([
		...ALL_TAGS,
		...dbInterests,
		...profile.interests
	]));
	const allSkills = Array.from(/* @__PURE__ */ new Set([
		...SKILL_DICTIONARY,
		...dbSkills,
		...profile.skills
	]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "max-w-5xl mx-auto px-8 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-14 animate-entry flex flex-col md:flex-row gap-8 md:items-end justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-24 rounded-full bg-foreground text-background flex items-center justify-center font-display text-4xl uppercase shadow-stamp",
					children: profile.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: profile.avatar,
						alt: "avatar",
						className: "w-full h-full object-cover rounded-full"
					}) : initials
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-6xl uppercase tracking-tighter italic leading-none text-balance",
					children: profile.name || "Student"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mt-3",
					children: "Your Professional Identity"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-4",
				children: [
					{
						label: "Match",
						val: interested.length
					},
					{
						label: "Saved",
						val: activeSavedCount
					},
					{
						label: "Applied",
						val: applied.length
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border-2 border-foreground rounded-2xl p-4 text-center shadow-stamp w-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-3xl uppercase leading-none",
						children: s.val
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[9px] font-bold uppercase tracking-widest mt-1 opacity-70",
						children: s.label
					})]
				}, s.label))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:40ms]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (e) => setName(e.target.value),
								onBlur: () => update({ name: name.trim() || "Student" }),
								className: "flex-1 bg-background border-2 border-foreground rounded-xl px-4 py-3 font-display text-xl uppercase tracking-tight focus:outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => update({ name: name.trim() || "Student" }),
								className: "bg-foreground text-background px-5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-primary transition-colors",
								children: "Save"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:80ms]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block",
								children: "Future You"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground/70 mb-5",
								children: "Describe your dream career, goals, or aspirations."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: futureYou,
								onChange: (e) => setFutureYou(e.target.value),
								onBlur: () => update({ future_you: futureYou.trim() }),
								placeholder: "In 5 years, I want to be building AI products that...",
								className: "w-full h-32 bg-background border-2 border-foreground rounded-xl p-5 font-mono text-sm resize-none focus:outline-none leading-relaxed"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:120ms]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4 block",
							children: "Preferred Locations"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: LOCATIONS.map((loc) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => toggleLocation(loc),
									className: ["px-3 py-1.5 border-2 border-foreground rounded-full font-mono text-[10px] font-bold uppercase tracking-tight transition-all", (profile.preferred_locations || []).includes(loc) ? "bg-primary text-primary-foreground shadow-stamp -translate-x-0.5 -translate-y-0.5" : "bg-card hover:bg-accent"].join(" "),
									children: loc
								}, loc);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:160ms]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Interests"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleAddCustom("interest"),
								className: "inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-primary hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), " Add Your Own"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2.5",
							children: allInterests.map((t) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toggleInterest(t),
									className: ["px-3 py-1.5 border-2 border-foreground rounded-full font-mono text-[10px] font-bold uppercase tracking-tight transition-all", profile.interests.includes(t) ? "bg-secondary text-secondary-foreground shadow-stamp -translate-x-0.5 -translate-y-0.5" : "bg-card hover:bg-accent"].join(" "),
									children: ["#", t]
								}, t);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:200ms]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Skills"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleAddCustom("skill"),
								className: "inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-primary hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), " Add Your Own"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2.5 max-h-[350px] overflow-y-auto pr-2 pb-2 custom-scrollbar",
							children: allSkills.map((t) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => toggleSkill(t),
									className: ["px-3 py-1.5 border-2 border-foreground rounded-full font-mono text-[10px] font-bold uppercase tracking-tight transition-all", profile.skills.includes(t) ? "bg-foreground text-background shadow-stamp -translate-x-0.5 -translate-y-0.5" : "bg-card hover:bg-accent"].join(" "),
									children: t
								}, t);
							})
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "bg-lime border-2 border-foreground rounded-none shadow-stamp p-7 relative animate-entry [animation-delay:100ms] rotate-2 hover:rotate-0 transition-transform",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-5 bg-foreground/20 rotate-[-4deg]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-display text-4xl uppercase tracking-tighter block mb-3",
								children: "COOKING"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: goal,
								onChange: (e) => setGoal(e.target.value),
								onBlur: () => update({ goal: goal.trim() }),
								placeholder: "Cracking SWE Internship 2026...",
								className: "w-full h-40 bg-transparent border-none font-mono text-sm resize-none focus:outline-none placeholder:text-foreground/50 leading-relaxed"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:120ms]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "AI Resume Analyzer"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground/70 mb-5 leading-snug",
								children: "Upload your PDF resume. Our AI will automatically extract your skills, languages, and interests to personalize your feed."
							}),
							analyzeError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-red-500 font-mono text-xs mb-3 font-bold uppercase",
								children: analyzeError
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: `
              border-2 border-dashed border-foreground/30 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:bg-foreground/5 hover:border-foreground/50 transition-colors
              ${isAnalyzing ? "opacity-50 pointer-events-none" : ""}
            `,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "application/pdf",
									className: "hidden",
									onChange: handleFileUpload,
									disabled: isAnalyzing
								}), isAnalyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs uppercase tracking-widest font-bold",
									children: "Analyzing..."
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-6 text-foreground/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs uppercase tracking-widest font-bold",
									children: "Select PDF (Max 10MB)"
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:140ms]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground block",
								children: "Professional Links"
							}), !isEditingLinks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsEditingLinks(true),
								className: "font-mono text-[10px] uppercase font-bold text-primary hover:underline",
								children: "EDIT"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-bold uppercase block mb-1",
									children: "Email"
								}), !isEditingLinks && email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `mailto:${email}`,
									className: "block w-full bg-background/50 border-2 border-transparent rounded-lg px-3 py-2 font-mono text-xs text-primary hover:underline truncate",
									children: email
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									readOnly: !isEditingLinks,
									placeholder: "you@example.com",
									className: `w-full bg-background border-2 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none ${!isEditingLinks ? "border-transparent bg-background/50 text-foreground/70" : "border-foreground/30 focus:border-foreground"}`
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-bold uppercase block mb-1",
									children: "Portfolio"
								}), !isEditingLinks && portfolio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: portfolio,
									target: "_blank",
									rel: "noreferrer",
									className: "block w-full bg-background/50 border-2 border-transparent rounded-lg px-3 py-2 font-mono text-xs text-primary hover:underline truncate",
									children: portfolio
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: portfolio,
									onChange: (e) => setPortfolio(e.target.value),
									readOnly: !isEditingLinks,
									placeholder: "https://...",
									className: `w-full bg-background border-2 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none ${!isEditingLinks ? "border-transparent bg-background/50 text-foreground/70" : "border-foreground/30 focus:border-foreground"}`
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-bold uppercase block mb-1",
									children: "GitHub"
								}), !isEditingLinks && github ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: github,
									target: "_blank",
									rel: "noreferrer",
									className: "block w-full bg-background/50 border-2 border-transparent rounded-lg px-3 py-2 font-mono text-xs text-primary hover:underline truncate",
									children: github
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: github,
									onChange: (e) => setGithub(e.target.value),
									readOnly: !isEditingLinks,
									placeholder: "https://github.com/...",
									className: `w-full bg-background border-2 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none ${!isEditingLinks ? "border-transparent bg-background/50 text-foreground/70" : "border-foreground/30 focus:border-foreground"}`
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] font-bold uppercase block mb-1",
									children: "LeetCode"
								}), !isEditingLinks && leetcode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: leetcode,
									target: "_blank",
									rel: "noreferrer",
									className: "block w-full bg-background/50 border-2 border-transparent rounded-lg px-3 py-2 font-mono text-xs text-primary hover:underline truncate",
									children: leetcode
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: leetcode,
									onChange: (e) => setLeetcode(e.target.value),
									readOnly: !isEditingLinks,
									placeholder: "https://leetcode.com/...",
									className: `w-full bg-background border-2 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none ${!isEditingLinks ? "border-transparent bg-background/50 text-foreground/70" : "border-foreground/30 focus:border-foreground"}`
								})] }),
								isEditingLinks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleSaveLinks,
									className: "w-full py-2.5 bg-foreground text-background rounded-lg font-mono text-xs font-bold uppercase hover:bg-primary transition-colors",
									children: "Save Links"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "bg-primary/10 border-2 border-primary rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:160ms]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-mono text-[10px] uppercase tracking-widest text-primary font-bold",
									children: "Generate Personalized Feed"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground/70 mb-5 leading-snug",
								children: "Let our AI generate 5 realistic opportunities tailored perfectly to your skills, interests, and location preferences in real-time."
							}),
							generateFeedError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-red-500 font-mono text-xs mb-3 font-bold uppercase",
								children: generateFeedError
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleGenerateFeed,
								disabled: isGeneratingFeed,
								className: `w-full py-3 bg-primary text-primary-foreground rounded-xl font-mono text-xs font-bold uppercase hover:opacity-90 transition-all shadow-stamp flex items-center justify-center gap-2 ${isGeneratingFeed ? "opacity-70 pointer-events-none" : ""}`,
								children: isGeneratingFeed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Generating..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Generate My Feed ✨"] })
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { ProfilePage as component };
