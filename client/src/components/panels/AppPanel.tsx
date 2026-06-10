import { Briefcase, ChevronRight, Plus, Puzzle, Rocket, Search, Settings, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import { useAppsQuery } from "../../hooks/useAppsQuery";
import { useAppStore } from "../../store/useAppStore";
import type { AppIcon } from "../../types";
import { Button } from "../ui/Button";

const iconMap: Record<AppIcon, typeof Sparkles> = {
  bulb: Sparkles,
  settings: Settings,
  rocket: Rocket,
  briefcase: Briefcase,
  puzzle: Puzzle
};

const iconColors: Record<AppIcon, string> = {
  bulb: "bg-indigo-500",
  settings: "bg-violet-500",
  rocket: "bg-red-500",
  briefcase: "bg-fuchsia-500",
  puzzle: "bg-purple-500"
};

export function AppPanel() {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError, refetch } = useAppsQuery();
  const { selectedAppId, setSelectedAppId, setMobilePanelOpen } = useAppStore();

  const apps = useMemo(() => {
    const value = query.trim().toLowerCase();
    return (data ?? []).filter((app) => app.name.toLowerCase().includes(value));
  }, [data, query]);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-md border border-white/10 bg-black/95 p-6 shadow-2xl shadow-black/40">
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Application</h2>
        <Button
          aria-label="Close panel"
          size="sm"
          variant="ghost"
          className="md:hidden"
          onClick={() => setMobilePanelOpen(false)}
        >
          Close
        </Button>
      </div>

      <div className="mb-4 flex gap-3">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search applications</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            className="h-10 w-full rounded-md border border-white/10 bg-[#222426] px-3 pr-10 text-white outline-none placeholder:text-white/35 focus:border-blue-400/70"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35" size={19} />
        </label>
        <Button aria-label="Add application" title="Add application" size="icon" variant="primary">
          <Plus size={20} />
        </Button>
      </div>

      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-md bg-white/10" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-md border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
            <p className="mb-3 font-medium">Apps failed to load.</p>
            <Button size="sm" variant="danger" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <div className="space-y-2">
            {apps.map((app) => {
              const Icon = iconMap[app.icon];
              const selected = app.id === selectedAppId;
              return (
                <button
                  key={app.id}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-0 py-2 text-left text-white transition hover:bg-white/5",
                    selected && "bg-white/[0.03]"
                  )}
                  onClick={() => setSelectedAppId(app.id)}
                >
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-md", iconColors[app.icon])}>
                    <Icon size={22} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-base font-semibold">{app.name}</span>
                  <ChevronRight size={18} className="text-white" />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
