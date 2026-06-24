import { Link, useRouterState } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Feed" },
  { to: "/calendar", label: "Calendar" },
  { to: "/saved", label: "Saved" },
  { to: "/profile", label: "Profile" },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-[28px] z-40 bg-background/80 backdrop-blur-md border-b-2 border-foreground/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-display text-3xl uppercase tracking-tighter italic leading-none shrink-0"
        >
          LOOP<span className="text-primary">.</span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={[
                  "px-4 py-2 rounded-full font-mono text-[11px] font-bold uppercase tracking-tight transition-all",
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/5",
                ].join(" ")}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
