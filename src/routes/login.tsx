import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authenticate } from "@/lib/auth";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;

    setLoading(true);
    setError("");
    try {
      await authenticate({ data: { name: name.trim(), password } });
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="font-display text-5xl uppercase tracking-tight leading-[0.9] mb-8">
          Welcome<br />Back.
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="USERNAME"
            className="w-full bg-transparent border-b-4 border-foreground px-1 py-3 font-display text-3xl uppercase tracking-tight focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
            className="w-full bg-transparent border-b-4 border-foreground px-1 py-3 font-display text-3xl uppercase tracking-tight focus:outline-none focus:border-primary"
          />
          {error && <div className="text-red-500 font-mono text-xs uppercase tracking-widest">{error}</div>}
          <button
            type="submit"
            disabled={!name.trim() || !password.trim() || loading}
            className="mt-4 inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-4 rounded-xl font-mono text-xs font-bold uppercase disabled:opacity-30 hover:bg-primary transition-colors"
          >
            {loading ? "Processing..." : "Log In"} <ArrowRight className="size-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
