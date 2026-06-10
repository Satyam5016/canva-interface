import { Box, Boxes, Braces, Github, GitFork, Leaf, Network, Rows3, Table2 } from "lucide-react";
import { cn } from "../../lib/utils";

const railItems = [
  { label: "GitHub", icon: Github, active: true },
  { label: "Postgres", icon: Braces, color: "text-sky-300" },
  { label: "Redis", icon: Boxes, color: "text-red-400" },
  { label: "MongoDB", icon: Leaf, color: "text-green-500" },
  { label: "Containers", icon: Box },
  { label: "Storage", icon: Rows3, color: "text-yellow-300" },
  { label: "Tables", icon: Table2, color: "text-amber-300" },
  { label: "Network", icon: GitFork, color: "text-emerald-400" }
];

export function LeftRail() {
  return (
    <aside className="fixed left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-md border border-white/10 bg-black/90 p-2 shadow-2xl shadow-black/30 md:block">
      <nav className="flex flex-col gap-2">
        {railItems.map((item) => (
          <button
            key={item.label}
            aria-label={item.label}
            title={item.label}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 hover:text-white",
              item.active && "bg-[#111827] text-white ring-1 ring-blue-500/40",
              item.color
            )}
          >
            <item.icon size={24} />
          </button>
        ))}
      </nav>
      <div className="mt-2 flex justify-center text-emerald-400">
        <Network size={22} />
      </div>
    </aside>
  );
}
