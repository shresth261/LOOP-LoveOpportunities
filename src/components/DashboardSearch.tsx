import { useState, useEffect, useRef } from "react";
import { Search, Compass, Heart, ArrowRight, Bookmark } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { opportunitiesQuery } from "@/lib/opportunities";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export function DashboardSearch({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (q: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch top 5 suggestions based on query
  const { data: suggestions } = useQuery({
    ...opportunitiesQuery({ q: query, limit: 5 }),
    enabled: query.length > 0 && open,
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full z-50" ref={containerRef}>
      <Command 
        className="overflow-visible bg-transparent border-none"
        shouldFilter={false} // We rely on the server to filter
      >
        <div className="relative">
          <input
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search opportunities…"
            className="w-full bg-card border-2 border-foreground rounded-2xl px-4 py-3 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:shadow-stamp focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-4 opacity-50" />
        </div>

        {open && (
          <div className="absolute top-full mt-2 w-full bg-card border-2 border-foreground rounded-2xl shadow-stamp overflow-hidden animate-in fade-in slide-in-from-top-2">
            <CommandList className="max-h-[350px] overflow-y-auto p-2 space-y-2">
              {!query ? (
                <>
                  <CommandGroup heading="Quick Actions" className="font-mono">
                    <CommandItem 
                      onSelect={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="cursor-pointer rounded-xl font-mono text-xs uppercase"
                    >
                      <Compass className="mr-2 size-4" /> Go to Home Feed
                    </CommandItem>
                    <CommandItem 
                      onSelect={() => { setOpen(false); navigate({ to: "/profile" }); }}
                      className="cursor-pointer rounded-xl font-mono text-xs uppercase"
                    >
                      <Heart className="mr-2 size-4" /> For You Profile
                    </CommandItem>
                  </CommandGroup>
                </>
              ) : (
                <>
                  {suggestions && suggestions.length > 0 ? (
                    <CommandGroup heading={`Matches for "${query}"`} className="font-mono">
                      {suggestions.map((opp) => (
                        <CommandItem
                          key={opp.id}
                          onSelect={() => {
                            setOpen(false);
                            navigate({ to: "/opportunity/$id", params: { id: opp.id } });
                          }}
                          className="cursor-pointer rounded-xl flex items-center justify-between"
                        >
                          <div className="flex flex-col max-w-[80%]">
                            <span className="font-bold text-sm truncate leading-tight mb-1">{opp.title}</span>
                            <span className="font-mono text-[10px] uppercase opacity-70 truncate">{opp.organization}</span>
                          </div>
                          <ArrowRight className="size-4 opacity-50 shrink-0" />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandEmpty className="py-6 font-mono text-xs text-center text-muted-foreground uppercase tracking-widest">
                      No results found.
                    </CommandEmpty>
                  )}
                </>
              )}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
