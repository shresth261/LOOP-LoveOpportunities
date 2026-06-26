import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useProfile, useSaved, useApplied, useInterested, SKILL_DICTIONARY } from "@/lib/local-store";
import { useState } from "react";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { masterSkillsQuery, masterInterestsQuery, addMasterSkill, addMasterInterest } from "@/lib/master-data";
import { Plus, Upload, FileText, Loader2, Sparkles, Zap } from "lucide-react";
import { opportunitiesByIdsQuery } from "@/lib/opportunities";
import { uploadAndAnalyzeResume, generateFeed } from "@/lib/gemini";

const ALL_TAGS = [
  "Design", "SWE", "ML", "Research", "Frontend", "Backend", "Payments", "AI",
  "Art", "UX", "Figma", "Hardware", "EV", "Engineering", "OSS", "Mentorship",
  "Pitch", "Entrepreneurship", "Founders", "Postgrad", "Finance", "Leadership",
  "HighSchool", "STEM", "Travel", "Safety",
];

const LOCATIONS = ["Remote", "Bangalore", "Hyderabad", "Pune", "Chennai", "Delhi", "Mumbai", "International"];

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — LOOP" }] }),
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/login" });
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(masterSkillsQuery());
    await queryClient.ensureQueryData(masterInterestsQuery());
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, update } = useProfile();
  const { saved } = useSaved();
  const { applied } = useApplied();
  const { interested } = useInterested();
  
  const allTrackedIds = Array.from(new Set([...saved]));
  const { data: trackedOpps } = useSuspenseQuery(opportunitiesByIdsQuery(allTrackedIds));
  const activeSavedCount = trackedOpps 
    ? trackedOpps.filter(a => new Date(a.deadline).getTime() >= Date.now()).length 
    : 0;

  const { data: dbSkills } = useSuspenseQuery(masterSkillsQuery());
  const { data: dbInterests } = useSuspenseQuery(masterInterestsQuery());
  
  const queryClient = useQueryClient();
  
  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState(profile.goal || "");
  const [futureYou, setFutureYou] = useState(profile.future_you || "");
  
  const [portfolio, setPortfolio] = useState(profile.portfolio_url || "");
  const [github, setGithub] = useState(profile.github_url || "");
  const [leetcode, setLeetcode] = useState(profile.leetcode_url || "");
  const [email, setEmail] = useState(profile.email || "");

  const [isEditingLinks, setIsEditingLinks] = useState(
    !(profile.email || profile.portfolio_url || profile.github_url || profile.leetcode_url)
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");

  const navigate = useNavigate();
  const [isGeneratingFeed, setIsGeneratingFeed] = useState(false);
  const [generateFeedError, setGenerateFeedError] = useState("");

  const handleGenerateFeed = async () => {
    setIsGeneratingFeed(true);
    setGenerateFeedError("");
    try {
      await generateFeed({ data: { profile } });
      await queryClient.invalidateQueries({ queryKey: ["opportunities_infinite"] });
      await queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      navigate({ to: "/" });
    } catch (err: any) {
      console.error(err);
      setGenerateFeedError(err.message || "Failed to generate personalized feed.");
    } finally {
      setIsGeneratingFeed(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Read file as Base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64String = (event.target?.result as string).split(",")[1];
          if (!base64String) throw new Error("Failed to read file.");

          const data = await uploadAndAnalyzeResume({ data: { base64Pdf: base64String } });

          // Merge parsed data into local profile state
          const newSkills = Array.from(new Set([
            ...profile.skills,
            ...(data.skills || []),
            ...(data.programmingLanguages || []),
            ...(data.frameworks || []),
            ...(data.tools || []),
            ...(data.technologies || []),
          ]));

          const newInterests = Array.from(new Set([
            ...profile.interests,
            ...(data.interests || []),
            ...(data.domains || []),
          ]));

          update({
            skills: newSkills,
            interests: newInterests,
            field: data.preferredRoles?.[0] || profile.field
          });
          
          queryClient.invalidateQueries({ queryKey: ["userData"] });
        } catch (err: any) {
          console.error(err);
          setAnalyzeError(err.message || "Failed to analyze resume.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setAnalyzeError("Failed to process file.");
      setIsAnalyzing(false);
    }
  };

  const addSkillMutation = useMutation({
    mutationFn: (data: string) => addMasterSkill({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["master-skills"] })
  });
  const addInterestMutation = useMutation({
    mutationFn: (data: string) => addMasterInterest({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["master-interests"] })
  });

  const toggleInterest = (t: string) => {
    update({
      interests: profile.interests.includes(t)
        ? profile.interests.filter((x) => x !== t)
        : [...profile.interests, t],
    });
  };

  const toggleSkill = (t: string) => {
    update({
      skills: profile.skills.includes(t)
        ? profile.skills.filter((x) => x !== t)
        : [...profile.skills, t],
    });
  };
  
  const toggleLocation = (loc: string) => {
    const current = profile.preferred_locations || [];
    update({
      preferred_locations: current.includes(loc)
        ? current.filter((x) => x !== loc)
        : [...current, loc],
    });
  };

  const handleAddCustom = (type: "skill" | "interest") => {
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

    const isValidUrl = (s: string) => !s || s.startsWith('http://') || s.startsWith('https://');
    if (!isValidUrl(portfolio) || !isValidUrl(github) || !isValidUrl(leetcode)) {
      alert("URLs must start with http:// or https://");
      return;
    }
    update({ portfolio_url: portfolio, github_url: github, leetcode_url: leetcode, email });
    setIsEditingLinks(false);
  };

  const initials = (profile.name || "S").substring(0, 2).toUpperCase();
  const allInterests = Array.from(new Set([...ALL_TAGS, ...dbInterests, ...profile.interests]));
  const allSkills = Array.from(new Set([...SKILL_DICTIONARY, ...dbSkills, ...profile.skills]));

  return (
    <main className="max-w-5xl mx-auto px-8 py-16">
      <header className="mb-14 animate-entry flex flex-col md:flex-row gap-8 md:items-end justify-between">
        <div className="flex items-center gap-6">
          <div className="size-24 rounded-full bg-foreground text-background flex items-center justify-center font-display text-4xl uppercase shadow-stamp">
            {profile.avatar ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" /> : initials}
          </div>
          <div>
            <h1 className="font-display text-6xl uppercase tracking-tighter italic leading-none text-balance">
              {profile.name || "Student"}
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-3">
              Your Professional Identity
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          {[
            { label: "Match", val: interested.length },
            { label: "Saved", val: activeSavedCount },
            { label: "Applied", val: applied.length }
          ].map(s => (
            <div key={s.label} className="bg-card border-2 border-foreground rounded-2xl p-4 text-center shadow-stamp w-24">
              <div className="font-display text-3xl uppercase leading-none">{s.val}</div>
              <div className="font-mono text-[9px] font-bold uppercase tracking-widest mt-1 opacity-70">{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-8">
          
          {/* Basics */}
          <section className="bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:40ms]">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Name</label>
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => update({ name: name.trim() || "Student" })}
                className="flex-1 bg-background border-2 border-foreground rounded-xl px-4 py-3 font-display text-xl uppercase tracking-tight focus:outline-none"
              />
              <button
                onClick={() => update({ name: name.trim() || "Student" })}
                className="bg-foreground text-background px-5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-primary transition-colors"
              >
                Save
              </button>
            </div>
          </section>

          {/* Future You */}
          <section className="bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:80ms]">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Future You</label>
            <p className="text-sm text-foreground/70 mb-5">Describe your dream career, goals, or aspirations.</p>
            <textarea
              value={futureYou}
              onChange={(e) => setFutureYou(e.target.value)}
              onBlur={() => update({ future_you: futureYou.trim() })}
              placeholder="In 5 years, I want to be building AI products that..."
              className="w-full h-32 bg-background border-2 border-foreground rounded-xl p-5 font-mono text-sm resize-none focus:outline-none leading-relaxed"
            />
          </section>

          {/* Preferred Locations */}
          <section className="bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:120ms]">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4 block">Preferred Locations</label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => {
                const active = (profile.preferred_locations || []).includes(loc);
                return (
                  <button
                    key={loc}
                    onClick={() => toggleLocation(loc)}
                    className={[
                      "px-3 py-1.5 border-2 border-foreground rounded-full font-mono text-[10px] font-bold uppercase tracking-tight transition-all",
                      active ? "bg-primary text-primary-foreground shadow-stamp -translate-x-0.5 -translate-y-0.5" : "bg-card hover:bg-accent",
                    ].join(" ")}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Interests */}
          <section className="bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:160ms]">
            <div className="flex justify-between items-center mb-5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Interests</label>
              <button onClick={() => handleAddCustom("interest")} className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-primary hover:underline">
                <Plus className="size-3" /> Add Your Own
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {allInterests.map((t) => {
                const active = profile.interests.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleInterest(t)}
                    className={[
                      "px-3 py-1.5 border-2 border-foreground rounded-full font-mono text-[10px] font-bold uppercase tracking-tight transition-all",
                      active ? "bg-secondary text-secondary-foreground shadow-stamp -translate-x-0.5 -translate-y-0.5" : "bg-card hover:bg-accent",
                    ].join(" ")}
                  >
                    #{t}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Skills */}
          <section className="bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:200ms]">
            <div className="flex justify-between items-center mb-5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Skills</label>
              <button onClick={() => handleAddCustom("skill")} className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold text-primary hover:underline">
                <Plus className="size-3" /> Add Your Own
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5 max-h-[350px] overflow-y-auto pr-2 pb-2 custom-scrollbar">
              {allSkills.map((t) => {
                const active = profile.skills.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleSkill(t)}
                    className={[
                      "px-3 py-1.5 border-2 border-foreground rounded-full font-mono text-[10px] font-bold uppercase tracking-tight transition-all",
                      active ? "bg-foreground text-background shadow-stamp -translate-x-0.5 -translate-y-0.5" : "bg-card hover:bg-accent",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </section>

        </div>

        <div className="space-y-8">
          {/* COOKING Sticky Note */}
          <section className="bg-lime border-2 border-foreground rounded-none shadow-stamp p-7 relative animate-entry [animation-delay:100ms] rotate-2 hover:rotate-0 transition-transform">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-5 bg-foreground/20 rotate-[-4deg]" />
            <label className="font-display text-4xl uppercase tracking-tighter block mb-3">COOKING</label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onBlur={() => update({ goal: goal.trim() })}
              placeholder="Cracking SWE Internship 2026..."
              className="w-full h-40 bg-transparent border-none font-mono text-sm resize-none focus:outline-none placeholder:text-foreground/50 leading-relaxed"
            />
          </section>

          {/* AI Resume Analyzer */}
          <section className="bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:120ms]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-4 text-primary" />
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">AI Resume Analyzer</label>
            </div>
            <p className="text-sm text-foreground/70 mb-5 leading-snug">
              Upload your PDF resume. Our AI will automatically extract your skills, languages, and interests to personalize your feed.
            </p>
            
            {analyzeError && (
              <div className="text-red-500 font-mono text-xs mb-3 font-bold uppercase">{analyzeError}</div>
            )}

            <label className={`
              border-2 border-dashed border-foreground/30 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:bg-foreground/5 hover:border-foreground/50 transition-colors
              ${isAnalyzing ? "opacity-50 pointer-events-none" : ""}
            `}>
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isAnalyzing}
              />
              {isAnalyzing ? (
                <>
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <span className="font-mono text-xs uppercase tracking-widest font-bold">Analyzing...</span>
                </>
              ) : (
                <>
                  <Upload className="size-6 text-foreground/60" />
                  <span className="font-mono text-xs uppercase tracking-widest font-bold">Select PDF (Max 10MB)</span>
                </>
              )}
            </label>
          </section>

          {/* Professional Links */}
          <section className="bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:140ms]">
            <div className="flex justify-between items-center mb-5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">Professional Links</label>
              {!isEditingLinks && (
                <button onClick={() => setIsEditingLinks(true)} className="font-mono text-[10px] uppercase font-bold text-primary hover:underline">
                  EDIT
                </button>
              )}
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase block mb-1">Email</label>
                {!isEditingLinks && email ? (
                  <a href={`mailto:${email}`} className="block w-full bg-background/50 border-2 border-transparent rounded-lg px-3 py-2 font-mono text-xs text-primary hover:underline truncate">{email}</a>
                ) : (
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!isEditingLinks} placeholder="you@example.com" className={`w-full bg-background border-2 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none ${!isEditingLinks ? 'border-transparent bg-background/50 text-foreground/70' : 'border-foreground/30 focus:border-foreground'}`} />
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase block mb-1">Portfolio</label>
                {!isEditingLinks && portfolio ? (
                  <a href={portfolio} target="_blank" rel="noreferrer" className="block w-full bg-background/50 border-2 border-transparent rounded-lg px-3 py-2 font-mono text-xs text-primary hover:underline truncate">{portfolio}</a>
                ) : (
                  <input value={portfolio} onChange={(e) => setPortfolio(e.target.value)} readOnly={!isEditingLinks} placeholder="https://..." className={`w-full bg-background border-2 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none ${!isEditingLinks ? 'border-transparent bg-background/50 text-foreground/70' : 'border-foreground/30 focus:border-foreground'}`} />
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase block mb-1">GitHub</label>
                {!isEditingLinks && github ? (
                  <a href={github} target="_blank" rel="noreferrer" className="block w-full bg-background/50 border-2 border-transparent rounded-lg px-3 py-2 font-mono text-xs text-primary hover:underline truncate">{github}</a>
                ) : (
                  <input value={github} onChange={(e) => setGithub(e.target.value)} readOnly={!isEditingLinks} placeholder="https://github.com/..." className={`w-full bg-background border-2 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none ${!isEditingLinks ? 'border-transparent bg-background/50 text-foreground/70' : 'border-foreground/30 focus:border-foreground'}`} />
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase block mb-1">LeetCode</label>
                {!isEditingLinks && leetcode ? (
                  <a href={leetcode} target="_blank" rel="noreferrer" className="block w-full bg-background/50 border-2 border-transparent rounded-lg px-3 py-2 font-mono text-xs text-primary hover:underline truncate">{leetcode}</a>
                ) : (
                  <input value={leetcode} onChange={(e) => setLeetcode(e.target.value)} readOnly={!isEditingLinks} placeholder="https://leetcode.com/..." className={`w-full bg-background border-2 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none ${!isEditingLinks ? 'border-transparent bg-background/50 text-foreground/70' : 'border-foreground/30 focus:border-foreground'}`} />
                )}
              </div>
              {isEditingLinks && (
                <button onClick={handleSaveLinks} className="w-full py-2.5 bg-foreground text-background rounded-lg font-mono text-xs font-bold uppercase hover:bg-primary transition-colors">
                  Save Links
                </button>
              )}
            </div>
          </section>

          {/* AI Personalized Feed */}
          <section className="bg-primary/10 border-2 border-primary rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:160ms]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="size-4 text-primary" />
              <label className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">Generate Personalized Feed</label>
            </div>
            <p className="text-sm text-foreground/70 mb-5 leading-snug">
              Let our AI generate 5 realistic opportunities tailored perfectly to your skills, interests, and location preferences in real-time.
            </p>
            
            {generateFeedError && (
              <div className="text-red-500 font-mono text-xs mb-3 font-bold uppercase">{generateFeedError}</div>
            )}

            <button
              onClick={handleGenerateFeed}
              disabled={isGeneratingFeed}
              className={`w-full py-3 bg-primary text-primary-foreground rounded-xl font-mono text-xs font-bold uppercase hover:opacity-90 transition-all shadow-stamp flex items-center justify-center gap-2 ${isGeneratingFeed ? 'opacity-70 pointer-events-none' : ''}`}
            >
              {isGeneratingFeed ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate My Feed ✨
                </>
              )}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
