import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  differenceInDays,
} from "date-fns";
import { opportunitiesQuery, categoryColor } from "@/lib/opportunities";
import { useInterested, useSaved } from "@/lib/local-store";
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — LOOP" },
      { name: "description", content: "All deadlines on one page." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(opportunitiesQuery()),
  component: CalendarPage,
  errorComponent: () => <div className="p-10 font-mono">Failed to load.</div>,
  notFoundComponent: () => <div className="p-10 font-mono">Not found.</div>,
});

function CalendarPage() {
  const { data: opps } = useSuspenseQuery(opportunitiesQuery());
  const { interested } = useInterested();
  const { saved } = useSaved();
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(new Date());
  const [filter, setFilter] = useState<"all" | "tracked">("all");

  const tracked = useMemo(() => new Set([...interested, ...saved]), [interested, saved]);
  const visible = useMemo(
    () => (filter === "tracked" ? opps.filter((o) => tracked.has(o.id)) : opps),
    [opps, filter, tracked],
  );

  const byDay = useMemo(() => {
    const m = new Map<string, typeof opps>();
    visible.forEach((o) => {
      const key = format(new Date(o.deadline), "yyyy-MM-dd");
      const arr = m.get(key) ?? [];
      arr.push(o);
      m.set(key, arr);
    });
    return m;
  }, [visible]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    const out: Date[] = [];
    let d = start;
    while (d <= end) {
      out.push(d);
      d = addDays(d, 1);
    }
    return out;
  }, [cursor]);

  const selectedItems = selected ? (byDay.get(format(selected, "yyyy-MM-dd")) ?? []) : [];

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <CalIcon className="size-3" /> Schedule
          </p>
          <h1 className="font-display text-6xl uppercase tracking-tighter italic leading-[0.85]">
            Deadline
            <br />
            Map.
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border-2 border-foreground p-0.5">
            {(["all", "tracked"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest rounded-full ${filter === f ? "bg-foreground text-background" : ""}`}
              >
                {f === "all" ? "All" : `Tracked · ${tracked.size}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8 bg-card border-2 border-foreground rounded-[28px] p-5 shadow-stamp">
          <header className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCursor(subMonths(cursor, 1))}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="font-display text-3xl uppercase tracking-tight">
              {format(cursor, "MMMM yyyy")}
            </div>
            <button
              onClick={() => setCursor(addMonths(cursor, 1))}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <ChevronRight className="size-4" />
            </button>
          </header>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div
                key={i}
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center py-1"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => {
              const key = format(d, "yyyy-MM-dd");
              const list = byDay.get(key) ?? [];
              const inMonth = isSameMonth(d, cursor);
              const isToday = isSameDay(d, new Date());
              const isSel = selected && isSameDay(d, selected);
              return (
                <button
                  key={key}
                  onClick={() => setSelected(d)}
                  className={`relative aspect-square p-1.5 rounded-xl border-2 flex flex-col items-start text-left transition-all
                    ${isSel ? "border-foreground bg-foreground text-background" : "border-transparent hover:border-foreground/30"}
                    ${!inMonth ? "opacity-30" : ""}`}
                >
                  <span className={`font-mono text-xs ${isToday ? "font-bold text-primary" : ""}`}>
                    {format(d, "d")}
                  </span>
                  <div className="mt-auto flex flex-wrap gap-0.5">
                    {list.slice(0, 3).map((o) => (
                      <span
                        key={o.id}
                        className={`size-1.5 rounded-full ${categoryColor[o.category].split(" ")[0]}`}
                      />
                    ))}
                    {list.length > 3 && (
                      <span className="font-mono text-[8px] opacity-60">+{list.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4">
          <div className="bg-foreground text-background rounded-[28px] p-6 shadow-stamp-lg sticky top-24">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-1">
              {selected ? format(selected, "EEEE") : "Pick a day"}
            </div>
            <div className="font-display text-4xl uppercase leading-none mb-5">
              {selected ? format(selected, "MMM dd").toUpperCase() : "—"}
            </div>
            {selectedItems.length === 0 ? (
              <p className="font-mono text-xs opacity-60">No deadlines on this day.</p>
            ) : (
              <ul className="space-y-3 max-h-[420px] overflow-auto pr-1">
                {selectedItems.map((o) => {
                  const d = differenceInDays(new Date(o.deadline), new Date());
                  return (
                    <li key={o.id}>
                      <Link
                        to="/opportunity/$id"
                        params={{ id: o.id }}
                        className="block border-l-2 border-primary pl-3 hover:opacity-80"
                      >
                        <div className="font-mono text-[9px] uppercase tracking-widest opacity-60">
                          {o.category} · {d <= 0 ? "today" : `in ${d}d`}
                        </div>
                        <div className="text-sm font-semibold leading-tight">{o.title}</div>
                        <div className="font-mono text-[10px] opacity-50">{o.organization}</div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
