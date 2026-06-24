import { createFileRoute } from "@tanstack/react-router";
import { useProfile } from "@/lib/local-store";
import { useState } from "react";

const ALL_TAGS = [
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
  "Safety",
];

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — LOOP" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, update } = useProfile();
  const [name, setName] = useState(profile.name);

  const toggleTag = (t: string) => {
    update({
      interests: profile.interests.includes(t)
        ? profile.interests.filter((x) => x !== t)
        : [...profile.interests, t],
    });
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-10 animate-entry">
        <h1 className="font-display text-7xl uppercase tracking-tighter italic leading-none">
          Profile.
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-3">
          Tune your feed. The more we know, the better the matches.
        </p>
      </header>

      <section className="bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 mb-6 animate-entry">
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Name
        </label>
        <div className="flex gap-2 mt-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => update({ name: name.trim() || "Student" })}
            className="flex-1 bg-background border-2 border-foreground rounded-xl px-4 py-3 font-display text-2xl uppercase tracking-tight focus:outline-none"
          />
          <button
            onClick={() => update({ name: name.trim() || "Student" })}
            className="bg-foreground text-background px-5 rounded-xl font-mono text-xs font-bold uppercase"
          >
            Save
          </button>
        </div>
      </section>

      <section className="bg-card border-2 border-foreground rounded-3xl shadow-stamp p-8 animate-entry [animation-delay:80ms]">
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Interests
        </label>
        <p className="text-sm text-foreground/70 mt-1 mb-5">
          Pick the tags that match what you're building toward.
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((t) => {
            const active = profile.interests.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={[
                  "px-3 py-1.5 border-2 border-foreground rounded-full font-mono text-[10px] font-bold uppercase tracking-tight transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-stamp -translate-x-0.5 -translate-y-0.5"
                    : "bg-card hover:bg-accent",
                ].join(" ")}
              >
                #{t}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-entry [animation-delay:160ms]">
        {[
          { k: "Deadline nudges", v: "On", note: "Browser reminders 7d / 3d / 1d before close." },
          { k: "Weekly digest", v: "Mon 8am", note: "Top picks for your stack." },
          { k: "Calendar sync", v: "Available", note: "Connect Google Calendar from Saved tab." },
        ].map((b) => (
          <div key={b.k} className="bg-foreground text-background rounded-2xl p-5">
            <div className="font-mono text-[10px] opacity-50 tracking-widest uppercase">{b.k}</div>
            <div className="font-display text-2xl uppercase mt-1">{b.v}</div>
            <p className="text-xs opacity-70 mt-2">{b.note}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
