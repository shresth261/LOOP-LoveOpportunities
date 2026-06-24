import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { opportunitiesQuery, type Category } from "@/lib/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { FilterRail } from "@/components/FilterRail";
import { SwipeStack } from "@/components/SwipeStack";
import { useProfile, useSaved, useInterested, matchScore } from "@/lib/local-store";
import { differenceInDays } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LOOP — Your opportunity feed" },
      {
        name: "description",
        content: "Personalised feed of internships, scholarships and competitions for students.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(opportunitiesQuery()),
  component: FeedPage,
  errorComponent: ({ error }) => <div className="p-10 font-mono">Failed to load: {error.message}</div>,
  notFoundComponent: () => <div className="p-10 font-mono">Not found.</div>,
});

function FeedPage() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const { data: all } = useSuspenseQuery(opportunitiesQuery());
  const { profile } = useProfile();
  const { saved } = useSaved();
  const { interested } = useInterested();

  const filtered = useMemo(() => {
    let list = all;
    if (category !== "all") list = list.filter((o) => o.category === category);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.organization.toLowerCase().includes(q) ||
          o.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return [...list].sort((a, b) => {
      const aScore = matchScore(profile, a.tags);
      const bScore = matchScore(profile, b.tags);
      if (bScore !== aScore) return bScore - aScore;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [all, category, query, profile]);

  const upcoming = useMemo(
    () =>
      [...all]
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 5),
    [all],
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 lg:py-14 grid grid-cols-12 gap-8">
      <aside className="col-span-12 lg:col-span-3 flex flex-col gap-7">
        <div className="animate-entry">
          <h1 className="font-display text-6xl uppercase tracking-tighter leading-[0.85] italic">
            Hey,
            <br />
            {(profile.name || "Student").split(" ")[0]}.
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mt-3">
            {filtered.length} opps · {saved.length} saved · {interested.length} ♥
          </p>
        </div>

        <div className="animate-entry [animation-delay:80ms]">
          <FilterRail
            category={category}
            onCategoryChange={setCategory}
            query={query}
            onQueryChange={setQuery}
          />
        </div>

        <div className="animate-entry [animation-delay:160ms] p-6 bg-foreground text-background rounded-3xl">
          <div className="font-mono text-[10px] opacity-50 mb-4 tracking-widest">USER_PROFILE</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-full bg-primary flex items-center justify-center font-display text-xl text-primary-foreground">
              {(profile.name || "ST").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">{profile.name || "Student"}</div>
              <div className="text-xs opacity-60">{profile.field || "Set your field"}</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] opacity-50 tracking-widest">SKILLS</div>
            <div className="flex flex-wrap gap-1">
              {(profile.skills.length ? profile.skills : ["Add", "Some", "Skills"])
                .slice(0, 8)
                .map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-background/10 rounded-full font-mono text-[10px] uppercase"
                  >
                    {t}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </aside>

      <section className="col-span-12 lg:col-span-9 flex flex-col gap-8">
        <SwipeStack opps={filtered} />

        <div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                All matches · ranked for you
              </div>
              <h2 className="font-display text-3xl uppercase tracking-tight leading-none mt-1">
                The full feed
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {filtered.length === 0 ? (
              <div className="border-2 border-dashed border-foreground/20 rounded-3xl p-16 text-center">
                <p className="font-display text-4xl uppercase">Nothing matches.</p>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
                  Try clearing the filters.
                </p>
              </div>
            ) : (
              filtered.map((opp, i) => <OpportunityCard key={opp.id} opp={opp} index={i} />)
            )}
          </div>
        </div>
      </section>

      <aside className="hidden xl:block fixed right-6 bottom-6 w-64 bg-foreground text-background rounded-3xl p-5 shadow-stamp-lg z-30">
        <div className="font-mono text-[10px] opacity-50 tracking-widest mb-3 flex items-center gap-2">
          <span className="size-1.5 bg-primary rounded-full animate-pulse" /> WATCHLIST
        </div>
        <ul className="space-y-3">
          {upcoming.map((o) => {
            const d = differenceInDays(new Date(o.deadline), new Date());
            return (
              <li key={o.id} className="border-l-2 border-primary pl-3">
                <div className="font-mono text-[9px] uppercase opacity-60">
                  {d <= 0 ? "Today" : `In ${d}d`}
                </div>
                <div className="text-xs font-semibold leading-tight truncate">{o.title}</div>
              </li>
            );
          })}
        </ul>
      </aside>
    </main>
  );
}
