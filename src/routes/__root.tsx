import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { NotFound } from "../components/NotFound";
import { SiteHeader } from "../components/SiteHeader";
import { DeadlineTicker } from "../components/DeadlineTicker";
import { OnboardingModal } from "../components/OnboardingModal";
import { DeadlinePopup } from "../components/DeadlinePopup";
import { getCurrentUser } from "../lib/auth";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl uppercase tracking-tighter">Glitch.</h1>
        <p className="mt-2 font-mono text-xs uppercase text-muted-foreground">
          Something broke on our end.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-xl bg-foreground px-5 py-3 font-mono text-xs font-bold uppercase text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-xl border-2 border-foreground px-5 py-3 font-mono text-xs font-bold uppercase"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export interface RouterContext {
  queryClient: QueryClient;
  user: { userId: string; name: string } | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    return { user };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LOOP — Opportunities for students that actually land" },
      {
        name: "description",
        content:
          "Personalised feed aggregating internships, scholarships, fellowships and competitions. Filter by your profile. Never miss a deadline.",
      },
      { property: "og:title", content: "LOOP — Opportunities for students" },
      {
        property: "og:description",
        content: "A mixtape of internships, scholarships and competitions, curated for you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient, user } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <DeadlineTicker />
        <SiteHeader />
        <Outlet />
        {user && <DeadlinePopup />}
        <footer className="border-t-2 border-foreground/10 mt-24 py-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <div className="font-display text-3xl uppercase tracking-tighter italic">LOOP.</div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest mt-2">
                v.03 — built for the curious
              </p>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              © 2026 · No more missed deadlines.
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
