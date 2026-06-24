import { useEffect, useState } from "react";
import { useProfile, analyseResume, SKILL_DICTIONARY } from "@/lib/local-store";
import { Sparkles, FileText, PenLine, ArrowRight, Check } from "lucide-react";

const FIELDS = [
  "Software Engineering",
  "Design",
  "Data & AI",
  "Product",
  "Business",
  "Research",
  "Creative",
];

export function OnboardingModal() {
  const { profile, update } = useProfile();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<"resume" | "manual" | null>(null);
  const [name, setName] = useState("");
  const [resume, setResume] = useState("");
  const [field, setField] = useState("Software Engineering");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Open after mount if not onboarded
    const t = setTimeout(() => {
      if (!profile.onboarded) setOpen(true);
    }, 250);
    return () => clearTimeout(t);
  }, [profile.onboarded]);

  if (!open) return null;

  const toggleIn = (s: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(s) ? list.filter((x) => x !== s) : [...list, s]);

  const runAnalyse = () => {
    setBusy(true);
    setTimeout(() => {
      const out = analyseResume(resume);
      setSkills(out.skills);
      setField(out.field);
      setBusy(false);
      setStep(3);
    }, 700);
  };

  const finish = () => {
    update({
      name: name.trim() || "Student",
      onboarded: true,
      field,
      skills,
      interests: interests.length ? interests : skills.slice(0, 6),
    });
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/80 backdrop-blur-md animate-entry">
      <div className="w-full max-w-2xl bg-card border-2 border-foreground rounded-[32px] shadow-stamp-lg overflow-hidden">
        <div className="px-6 py-3 bg-foreground text-background flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="size-3" /> Welcome to LOOP
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1 w-6 rounded-full ${n <= step ? "bg-primary" : "bg-background/20"}`}
              />
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Step 01
                </p>
                <h2 className="font-display text-5xl uppercase tracking-tight leading-[0.9] mt-1">
                  What's your name?
                </h2>
                <p className="text-sm text-foreground/70 mt-3 max-w-md">
                  Pick a username — we'll build a personalised feed of internships, scholarships and
                  competitions just for you.
                </p>
              </div>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ada_lovelace"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) setStep(2);
                }}
                className="w-full bg-transparent border-b-4 border-foreground px-1 py-3 font-display text-3xl uppercase tracking-tight focus:outline-none focus:border-primary"
              />
              <button
                disabled={!name.trim()}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase disabled:opacity-30 hover:bg-primary transition-colors"
              >
                Continue <ArrowRight className="size-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Step 02
                </p>
                <h2 className="font-display text-5xl uppercase tracking-tight leading-[0.9] mt-1">
                  Build your profile
                </h2>
                <p className="text-sm text-foreground/70 mt-3">
                  Paste your resume and we'll extract skills, or fill it in manually.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode("resume")}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${mode === "resume" ? "border-foreground bg-foreground text-background" : "border-foreground/20 hover:border-foreground/40"}`}
                >
                  <FileText className="size-5 mb-3" />
                  <div className="font-display text-xl uppercase">Resume scan</div>
                  <div className="text-xs opacity-70 mt-1">Paste → auto-extract</div>
                </button>
                <button
                  onClick={() => {
                    setMode("manual");
                    setStep(3);
                  }}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${mode === "manual" ? "border-foreground bg-foreground text-background" : "border-foreground/20 hover:border-foreground/40"}`}
                >
                  <PenLine className="size-5 mb-3" />
                  <div className="font-display text-xl uppercase">Type it out</div>
                  <div className="text-xs opacity-70 mt-1">Pick skills yourself</div>
                </button>
              </div>

              {mode === "resume" && (
                <div className="space-y-3">
                  <textarea
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    placeholder="Paste your resume text here…"
                    rows={6}
                    className="w-full p-4 border-2 border-foreground/20 rounded-2xl font-mono text-xs bg-transparent focus:outline-none focus:border-foreground"
                  />
                  <button
                    disabled={!resume.trim() || busy}
                    onClick={runAnalyse}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase disabled:opacity-30"
                  >
                    {busy ? (
                      "Analysing…"
                    ) : (
                      <>
                        Analyse resume <Sparkles className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              <button
                onClick={() => setStep(1)}
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Step 03
                </p>
                <h2 className="font-display text-5xl uppercase tracking-tight leading-[0.9] mt-1">
                  Tune your feed
                </h2>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Primary field
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {FIELDS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setField(f)}
                      className={`px-3 py-1.5 rounded-full border-2 font-mono text-[11px] uppercase ${field === f ? "border-foreground bg-foreground text-background" : "border-foreground/20 hover:border-foreground/50"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                  Skills{" "}
                  {skills.length > 0 && (
                    <span className="text-primary">· {skills.length} detected</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-auto p-1">
                  {SKILL_DICTIONARY.map((s) => {
                    const on = skills.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleIn(s, skills, setSkills)}
                        className={`px-2.5 py-1 rounded-full border-2 font-mono text-[10px] uppercase ${on ? "border-primary bg-primary text-primary-foreground" : "border-foreground/15 hover:border-foreground/40"}`}
                      >
                        {on && <Check className="size-2.5 inline mr-1" />}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Also interested in
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Internship",
                    "Scholarship",
                    "Hackathon",
                    "Fellowship",
                    "Competition",
                    "Remote",
                    "Paid",
                  ].map((s) => {
                    const on = interests.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleIn(s, interests, setInterests)}
                        className={`px-3 py-1.5 rounded-full border-2 font-mono text-[11px] uppercase ${on ? "border-foreground bg-foreground text-background" : "border-foreground/20 hover:border-foreground/50"}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
                <button
                  onClick={finish}
                  className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-primary transition-colors"
                >
                  Launch my feed <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
