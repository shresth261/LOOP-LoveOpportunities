import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { opportunitiesQuery } from "@/lib/opportunities";
import { useInterested, useSaved } from "@/lib/local-store";
import { Clock, X } from "lucide-react";

function fmt(ms: number) {
  if (ms <= 0) return "00:00:00:00";
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(days)}:${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}

export function DeadlinePopup() {
  const { data: opps = [] } = useQuery(opportunitiesQuery());
  const { interested } = useInterested();
  const { saved } = useSaved();
  const [now, setNow] = useState<number>(() => Date.now());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const next = useMemo(() => {
    const tracked = new Set([...interested, ...saved]);
    const list = opps
      .filter((o) => tracked.has(o.id) && new Date(o.deadline).getTime() > now)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    return list[0];
  }, [opps, interested, saved, now]);

  if (!next || dismissed) return null;

  const remaining = new Date(next.deadline).getTime() - now;
  const urgent = remaining < 1000 * 60 * 60 * 72; // < 72h

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-xs animate-entry">
      <div
        className={`bg-foreground text-background rounded-2xl p-4 shadow-stamp-lg border-2 ${urgent ? "border-primary" : "border-foreground"}`}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-1.5">
            <span
              className={`size-1.5 rounded-full ${urgent ? "bg-primary animate-pulse" : "bg-lime"}`}
            />
            {urgent ? "Closing soon" : "Up next"}
          </div>
          <button
            aria-label="Dismiss"
            onClick={() => setDismissed(true)}
            className="opacity-50 hover:opacity-100"
          >
            <X className="size-3.5" />
          </button>
        </div>
        <Link to="/opportunity/$id" params={{ id: next.id }} className="block">
          <div className="font-display text-lg uppercase leading-tight line-clamp-2">
            {next.title}
          </div>
          <div className="font-mono text-[10px] opacity-60 uppercase tracking-widest mt-1">
            {next.organization}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Clock className={`size-4 ${urgent ? "text-primary" : ""}`} />
            <div className="font-mono text-base font-bold tabular-nums tracking-tight">
              {fmt(remaining)}
            </div>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest opacity-50 mt-1">
            days : hrs : min : sec
          </div>
        </Link>
      </div>
    </div>
  );
}
