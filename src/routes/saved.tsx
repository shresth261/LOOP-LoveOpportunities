import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { opportunitiesQuery } from "@/lib/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { useSaved } from "@/lib/local-store";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved — LOOP" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(opportunitiesQuery()),
  component: SavedPage,
});

function SavedPage() {
  const { data: all } = useSuspenseQuery(opportunitiesQuery());
  const { saved } = useSaved();
  const list = all.filter((o) => saved.includes(o.id));

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10 animate-entry">
        <h1 className="font-display text-7xl uppercase tracking-tighter italic leading-none">
          Saved.
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-3">
          {list.length} opportunities you're tracking
        </p>
      </header>

      {list.length === 0 ? (
        <div className="border-2 border-dashed border-foreground/20 rounded-3xl p-16 text-center">
          <p className="font-display text-4xl uppercase">No saves yet.</p>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2 mb-6">
            Tap the bookmark on any opp to track it.
          </p>
          <Link
            to="/"
            className="inline-block bg-foreground text-background px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase"
          >
            Browse feed
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {list.map((o, i) => (
            <OpportunityCard key={o.id} opp={o} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
