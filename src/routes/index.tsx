import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { useState, useMemo, useDeferredValue } from "react";
import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { opportunitiesQuery, fetchOpportunities, type Category, opportunitiesByIdsQuery } from "@/lib/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { FilterRail } from "@/components/FilterRail";
import { SwipeStack } from "@/components/SwipeStack";
import { useProfile, useSaved, useInterested, matchScore } from "@/lib/local-store";
import { differenceInDays } from "date-fns";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  component: function IndexPage() {
    const { user } = useRouteContext({ from: "__root__" });
    if (!user) {
      return <LandingPage />;
    }
    return <FeedPage />;
  },
  errorComponent: ({ error }: { error: any }) => <div className="p-10 font-mono">Failed to load: {error.message}</div>,
  notFoundComponent: () => <div className="p-10 font-mono">Not found.</div>,
});

function FeedPage() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [isWatchlistExpanded, setIsWatchlistExpanded] = useState(true);
  const deferredQuery = useDeferredValue(query);
  const { profile } = useProfile();
  const { saved } = useSaved();
  const { interested } = useInterested();
  const profileTokens = useMemo(
    () => Array.from(new Set([...profile.skills, ...profile.interests, profile.field].filter(Boolean))),
    [profile]
  );

  const allTrackedIds = useMemo(() => Array.from(new Set([...saved])), [saved]);
  const { data: trackedOpps } = useSuspenseQuery(opportunitiesByIdsQuery(allTrackedIds));
  const activeSavedCount = trackedOpps 
    ? trackedOpps.filter(a => new Date(a.deadline).getTime() >= Date.now()).length 
    : 0;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ["opportunities_infinite", category, deferredQuery, profileTokens],
    queryFn: ({ pageParam }) =>
      fetchOpportunities({
        data: {
          category,
          q: deferredQuery,
          page: pageParam as number,
          limit: 20,
          profileTokens,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 20 ? allPages.length + 1 : undefined),
  });

  const filtered = useMemo(() => {
    const arr = [...data.pages.flat()];
    arr.sort((a, b) => {
      const scoreA = matchScore(profile, a.tags);
      const scoreB = matchScore(profile, b.tags);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
    return arr;
  }, [data, profile]);

  // For the watchlist sidebar, we can still fetch a separate small query, or just derive it from the current feed.
  // We'll derive it from the current feed for performance.
  const upcoming = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 5),
    [filtered],
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 lg:py-14 grid grid-cols-12 gap-8 lg:gap-12">
      <aside className="col-span-12 lg:col-span-4 flex flex-col gap-7 lg:sticky lg:top-10 lg:self-start lg:max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar pb-6">
        <div className="animate-entry">
          <h1 className="font-display text-6xl uppercase tracking-tighter leading-[0.85] italic">
            Hey,
            <br />
            {(profile.name || "Student").split(" ")[0]}.
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mt-3">
            {filtered.length} opps · {activeSavedCount} saved · {interested.length} ♥
          </p>
        </div>

        <div className="relative z-50 animate-entry [animation-delay:80ms]">
          <FilterRail
            category={category}
            onCategoryChange={setCategory}
            query={query}
            onQueryChange={setQuery}
          />
        </div>

        <Link to="/profile" className="block animate-entry [animation-delay:160ms] p-6 bg-foreground text-background rounded-3xl hover:-translate-y-1 hover:shadow-stamp-lg transition-all">
          <div className="font-mono text-[10px] opacity-50 mb-4 tracking-widest flex items-center justify-between">
            <span>USER_PROFILE</span>
            <span className="text-[8px] border border-background/20 px-1.5 py-0.5 rounded">EDIT →</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-full bg-primary flex items-center justify-center font-display text-xl text-primary-foreground overflow-hidden shrink-0">
              {profile.avatar ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" /> : (profile.name || "ST").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">{profile.name || "Student"}</div>
              <div className="text-xs opacity-60 line-clamp-2">{profile.future_you || "Dream your future..."}</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] opacity-50 tracking-widest">SKILLS</div>
            <div className="flex flex-wrap gap-1">
              {(profile.skills.length ? profile.skills : ["Add", "Some", "Skills"])
                .slice(0, 8)
                .map((t: string) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-background/10 rounded-full font-mono text-[10px] uppercase"
                  >
                    {t}
                  </span>
                ))}
            </div>
          </div>
        </Link>
      </aside>

      <section className="col-span-12 lg:col-span-8 flex flex-col gap-8 lg:pl-4">
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
              <>
                {filtered.map((opp, i) => <OpportunityCard key={opp.id} opp={opp} index={i} />)}
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="w-full mt-4 py-4 bg-foreground text-background font-mono text-xs font-bold uppercase rounded-2xl hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <aside className="hidden xl:block fixed right-6 bottom-6 w-64 bg-foreground text-background rounded-3xl p-5 shadow-stamp-lg z-30 transition-all">
        <button 
          onClick={() => setIsWatchlistExpanded(!isWatchlistExpanded)}
          className="w-full flex items-center justify-between font-mono text-[10px] opacity-70 hover:opacity-100 tracking-widest outline-none"
        >
          <div className="flex items-center gap-2">
            <span className="size-1.5 bg-primary rounded-full animate-pulse" /> WATCHLIST
          </div>
          {isWatchlistExpanded ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
        </button>
        {isWatchlistExpanded && (
          <ul className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-1">
            {upcoming.map((o) => {
              return (
                <li key={o.id} className="border-l-2 border-primary pl-3">
                  <div className="font-mono text-[9px] uppercase opacity-60">
                    <CountdownTimer deadline={o.deadline} short />
                  </div>
                  <div className="text-xs font-semibold leading-tight truncate">{o.title}</div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </main>
  );
}

function LandingPage() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-7xl md:text-9xl uppercase tracking-tighter leading-none italic">
        LOOP<span className="text-primary">.</span>
      </h1>
      <p className="mt-6 font-mono text-sm uppercase tracking-widest text-muted-foreground max-w-2xl">
        No more missed deadlines. A curated feed of internships, scholarships, and competitions tailored for you.
      </p>
      <div className="mt-12 flex items-center justify-center gap-4">
        <Link
          to="/signup"
          className="bg-foreground text-background px-8 py-4 rounded-full font-mono text-sm font-bold uppercase hover:bg-primary transition-colors"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="border-2 border-foreground px-8 py-4 rounded-full font-mono text-sm font-bold uppercase hover:bg-foreground/5 transition-colors"
        >
          Log In
        </Link>
      </div>
    </main>
  );
}
