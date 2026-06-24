import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-[10rem] leading-none uppercase tracking-tighter italic text-primary">
          404
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Page not in the loop.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 rounded-xl bg-foreground px-5 py-3 font-mono text-xs font-bold uppercase text-background"
        >
          Back to feed
        </Link>
      </div>
    </div>
  );
}
