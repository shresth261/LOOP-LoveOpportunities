import type { Category } from "@/lib/opportunities";
import { DashboardSearch } from "./DashboardSearch";

const CATEGORIES: { id: Category | "all"; label: string; color: string; rotate: string }[] = [
  { id: "all", label: "#FOR_YOU", color: "bg-card", rotate: "-rotate-2" },
  {
    id: "internship",
    label: "#INTERNSHIP",
    color: "bg-primary text-primary-foreground",
    rotate: "rotate-1",
  },
  {
    id: "scholarship",
    label: "#SCHOLARSHIP",
    color: "bg-secondary text-secondary-foreground",
    rotate: "-rotate-1",
  },
  {
    id: "competition",
    label: "#COMPETITION",
    color: "bg-foreground text-background",
    rotate: "rotate-2",
  },
  { id: "fellowship", label: "#FELLOWSHIP", color: "bg-indigo", rotate: "-rotate-2" },
  { id: "hackathon", label: "#HACKATHON", color: "bg-lime", rotate: "rotate-1" },
];

interface Props {
  category: Category | "all";
  onCategoryChange: (c: Category | "all") => void;
  query: string;
  onQueryChange: (q: string) => void;
}

export function FilterRail({ category, onCategoryChange, query, onQueryChange }: Props) {
  return (
    <div className="space-y-5">
      <DashboardSearch query={query} onQueryChange={onQueryChange} />
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onCategoryChange(c.id)}
              className={[
                "px-3 py-1.5 border-2 border-foreground rounded-full font-mono text-[10px] font-bold uppercase tracking-tight transition-transform shrink-0",
                c.color,
                c.rotate,
                "hover:rotate-0 hover:scale-105",
                active ? "shadow-stamp" : "",
              ].join(" ")}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FilterRailControlled() {
  const React = require("react");
  const [cat, setCat] = React.useState<Category | "all">("all");
  const [q, setQ] = React.useState("");
  return <FilterRail category={cat} onCategoryChange={setCat} query={q} onQueryChange={setQ} />;
}
