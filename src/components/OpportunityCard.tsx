import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, MapPin, Users } from "lucide-react";
import { formatDistanceToNowStrict, format, differenceInDays } from "date-fns";
import { categoryColor, type Opportunity } from "@/lib/opportunities";
import { useSaved, useProfile, matchScore, useInterested } from "@/lib/local-store";
import { MatchPie } from "./MatchPie";
import { CountdownTimer } from "./CountdownTimer";

export function OpportunityCard({ opp, index = 0 }: { opp: Opportunity; index?: number }) {
  const { saved, toggle: toggleSaved } = useSaved();
  const { profile } = useProfile();
  
  const isSaved = saved.includes(opp.id);
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(opp.id);
  };

  const score = matchScore(profile, opp.tags);
  const now = new Date();
  const startsIn = opp.application_start_date ? differenceInDays(new Date(opp.application_start_date), now) : -1;
  const daysLeft = differenceInDays(new Date(opp.deadline), now);
  const urgent = startsIn <= 0 && daysLeft <= 7;
  const isFuture = startsIn > 0;

  return (
    <article
      className="animate-entry bg-card border-2 border-foreground rounded-[28px] shadow-stamp hover:shadow-stamp-lg hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${categoryColor[opp.category]}`}
            >
              {opp.category}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              · Posted {formatDistanceToNowStrict(new Date(opp.posted_at))} ago
            </span>
            {opp.featured && (
              <span className="px-2 py-0.5 bg-lime text-foreground font-mono text-[10px] font-bold uppercase">
                ★ Featured
              </span>
            )}
            {opp.verified && (
              <span className="px-2 py-0.5 bg-blue-500 text-white font-mono text-[10px] font-bold uppercase rounded-sm">
                ✓ Verified
              </span>
            )}
          </div>

          <Link to="/opportunity/$id" params={{ id: opp.id }} className="block group">
            <h3 className="font-display text-3xl md:text-4xl uppercase tracking-tight leading-[0.95] mb-3 group-hover:text-primary transition-colors text-balance">
              {opp.title}
            </h3>
          </Link>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            {opp.organization}
          </p>
          <p className="text-sm leading-relaxed text-foreground/70 max-w-prose line-clamp-2">
            {opp.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {opp.location}
            </span>
            {opp.work_mode && (
              <span className="inline-flex items-center gap-1.5 font-mono uppercase text-[10px] border border-foreground/20 px-2 py-0.5 rounded-full">
                {opp.work_mode}
              </span>
            )}
            {opp.participants ? (
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5" />
                {opp.participants.toLocaleString()} applied
              </span>
            ) : null}
            <div className="flex flex-wrap gap-1.5">
              {opp.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 border border-foreground/15 rounded-full font-mono text-[10px] uppercase"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex md:flex-col md:items-end justify-between md:w-44 gap-3 md:border-l-2 md:border-dashed md:border-foreground/20 md:pl-6">
          <div className="text-left md:text-right">
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              {isFuture ? "Opens in" : urgent ? "Closing" : "Deadline"}
            </div>
            <div
              className={`font-display text-xl md:text-2xl uppercase leading-none mt-1 ${urgent ? "text-primary" : ""}`}
            >
              <CountdownTimer deadline={opp.deadline} />
            </div>
            {opp.prize_amount && (
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-2">
                {opp.prize_amount}
              </div>
            )}
          </div>
          <div className="md:self-end">
            <MatchPie score={score} size={84} />
          </div>

          <div className="flex md:flex-col gap-2 md:w-full">
            <Link
              to="/opportunity/$id"
              params={{ id: opp.id }}
              className="flex-1 text-center py-2.5 bg-foreground text-background font-mono text-[11px] font-bold uppercase rounded-lg hover:bg-primary transition-colors"
            >
              View
            </Link>
            <button
              type="button"
              onClick={handleToggle}
              aria-label={isSaved ? "Unsave" : "Save"}
              className={`flex items-center justify-center gap-2 shrink-0 py-2.5 px-4 rounded-lg border-2 border-foreground font-mono text-[11px] font-bold uppercase transition-colors ${isSaved ? "bg-secondary text-secondary-foreground" : "bg-card hover:bg-accent"}`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="size-4" /> Saved
                </>
              ) : (
                <>
                  <Bookmark className="size-4" /> Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
