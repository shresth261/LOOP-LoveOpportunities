import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { opportunityByIdQuery, categoryColor } from "@/lib/opportunities";
import { useSaved, useApplied, useProfile, matchScore } from "@/lib/local-store";
import { MatchPie } from "@/components/MatchPie";
import { format, formatDistanceToNowStrict, differenceInDays } from "date-fns";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Users,
  Calendar,
  Trophy,
  Check,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/opportunity/$id")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(opportunityByIdQuery(params.id));
    if (!data) throw notFound();
    return data as import("@/lib/opportunities").Opportunity;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — LOOP` : "Opportunity" },
      { name: "description", content: loaderData?.description ?? "" },
    ],
  }),
  component: DetailPage,
  errorComponent: () => <div className="p-10 font-mono">Failed to load.</div>,
  notFoundComponent: () => (
    <div className="max-w-md mx-auto py-20 text-center">
      <p className="font-display text-5xl uppercase">Gone.</p>
      <Link to="/" className="font-mono text-xs uppercase underline">
        Back to feed
      </Link>
    </div>
  ),
});

function DetailPage() {
  const opp = Route.useLoaderData();
  const { data: live } = useSuspenseQuery(opportunityByIdQuery(opp.id));
  const o: import("@/lib/opportunities").Opportunity = live ?? opp;
  const { isSaved, toggle } = useSaved();
  const { isApplied, toggle: toggleApplied } = useApplied();
  const { profile } = useProfile();
  const saved = isSaved(o.id);
  const applied = isApplied(o.id);
  const score = matchScore(profile, o.tags);
  const profileTokens = new Set(
    [...profile.skills, ...profile.interests].map((s) => s.toLowerCase()),
  );
  const matched = o.tags.filter((t) => profileTokens.has(t.toLowerCase()));
  const missing = o.tags.filter((t) => !profileTokens.has(t.toLowerCase()));
  const now = new Date();
  const startsIn = o.application_start_date ? differenceInDays(new Date(o.application_start_date), now) : -1;
  const daysLeft = differenceInDays(new Date(o.deadline), now);
  const isFuture = startsIn > 0;

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="size-3.5" /> Back to feed
      </Link>

      <div className="animate-entry bg-card border-2 border-foreground rounded-[32px] shadow-stamp-lg overflow-hidden">
        <div
          className={`px-8 py-3 ${categoryColor[o.category]} font-mono text-[11px] font-bold uppercase tracking-wider`}
        >
          {o.category} · posted {formatDistanceToNowStrict(new Date(o.posted_at))} ago
          {o.verified && (
            <span className="ml-3 px-2 py-0.5 bg-blue-500 text-white font-mono text-[10px] font-bold uppercase rounded-sm">
              ✓ Verified
            </span>
          )}
        </div>

        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 mb-6 items-start">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                {o.organization}
              </p>
              <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tight leading-[0.9] text-balance">
                {o.title}
              </h1>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1">
              <MatchPie score={score} size={140} />
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                profile match
              </div>
            </div>
          </div>
          <p className="text-lg leading-relaxed text-foreground/80 max-w-prose mb-8">
            {o.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Stat
              icon={<Calendar className="size-4" />}
              label={isFuture ? "Opens In" : "Deadline"}
              value={isFuture ? `${startsIn} days` : daysLeft <= 0 ? "Today" : `${daysLeft} days`}
              sub={isFuture && o.application_start_date ? format(new Date(o.application_start_date), "MMM dd, yyyy") : format(new Date(o.deadline), "MMM dd, yyyy")}
            />
            <Stat 
              icon={<MapPin className="size-4" />} 
              label="Location" 
              value={o.location}
              sub={o.work_mode?.toUpperCase()}
            />
            {o.prize_amount && (
              <Stat icon={<Trophy className="size-4" />} label="Reward" value={o.prize_amount} />
            )}
            {o.participants ? (
              <Stat
                icon={<Users className="size-4" />}
                label="Applied"
                value={o.participants.toLocaleString()}
              />
            ) : null}
          </div>

          <div className="mb-8 border-2 border-foreground/15 rounded-3xl p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <Sparkles className="size-3" /> Skills required for this opportunity
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
                  You have ({matched.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matched.length ? (
                    matched.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded-full font-mono text-[10px] font-bold uppercase inline-flex items-center gap-1"
                      >
                        <Check className="size-3" />
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">
                      Add skills to your profile
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Grow into ({missing.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {missing.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 border-2 border-dashed border-foreground/30 rounded-full font-mono text-[10px] font-bold uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {o.apply_url && (
              <a
                href={o.apply_url}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => {
                  if (!applied) toggleApplied(o.id);
                }}
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-primary transition-colors"
              >
                Apply now <ExternalLink className="size-3.5" />
              </a>
            )}
            <button
              onClick={() => toggle(o.id)}
              className={`inline-flex items-center gap-2 border-2 border-foreground px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase transition-colors ${saved ? "bg-secondary text-secondary-foreground" : "bg-card hover:bg-accent"}`}
            >
              {saved ? (
                <>
                  <BookmarkCheck className="size-4" /> Saved
                </>
              ) : (
                <>
                  <Bookmark className="size-4" /> Save
                </>
              )}
            </button>
            <button
              onClick={() => toggleApplied(o.id)}
              className={`inline-flex items-center gap-2 border-2 border-foreground px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase transition-colors ${applied ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}
            >
              <Check className="size-4" /> {applied ? "Marked applied" : "Mark applied"}
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined" && navigator.share) {
                  navigator.share({ title: o.title, url: window.location.href }).catch(() => {});
                } else if (typeof window !== "undefined") {
                  navigator.clipboard?.writeText(window.location.href);
                }
              }}
              className="inline-flex items-center gap-2 border-2 border-foreground px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-accent"
            >
              Share link
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="border-2 border-foreground/15 rounded-2xl p-4">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </div>
      <div className="font-display text-2xl uppercase leading-tight mt-1">{value}</div>
      {sub && (
        <div className="font-mono text-[10px] text-muted-foreground uppercase mt-0.5">{sub}</div>
      )}
    </div>
  );
}
