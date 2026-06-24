import { useQuery } from "@tanstack/react-query";
import { fetchTickerOpportunities } from "@/lib/opportunities";
import { formatDistanceToNowStrict } from "date-fns";

export function DeadlineTicker() {
  const { data } = useQuery({
    queryKey: ["ticker"],
    queryFn: async () => {
      const data = await fetchTickerOpportunities();
      return data ?? [];
    },
    staleTime: 60_000,
  });

  const items =
    data && data.length
      ? data
      : [
          {
            title: "Loading opportunities",
            organization: "LOOP",
            deadline: new Date().toISOString(),
          },
        ];
  // duplicate for seamless marquee
  const loop = [...items, ...items];

  return (
    <div className="sticky top-0 z-50 bg-primary text-primary-foreground py-1.5 overflow-hidden border-b-2 border-foreground">
      <div className="marquee-content gap-10 whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-tight">
        {loop.map((o, i) => (
          <span key={i} className="inline-flex items-center gap-3">
            <span>
              {o.organization} · {o.title}
            </span>
            <span className="opacity-60">
              closes in {formatDistanceToNowStrict(new Date(o.deadline))}
            </span>
            <span className="opacity-50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
