import { Eye, Maximize2, Menu, Moon, PanelRightClose, Share2, Sparkles, Sun } from "lucide-react";
import { Button } from "../ui/Button";
import { useAppStore } from "../../store/useAppStore";

type TopBarProps = {
  selectedAppName: string;
  onFitView: () => void;
};

export function TopBar({ selectedAppName, onFitView }: TopBarProps) {
  const { isPanelCollapsed, setMobilePanelOpen, togglePanel } = useAppStore();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex h-[76px] items-center justify-between px-5 md:px-8">
      <div className="pointer-events-auto flex min-w-0 items-center overflow-hidden rounded-md border border-white/20 bg-[#0a0b0d]/95 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex h-12 w-12 items-center justify-center border-r border-white/10 bg-white">
          <div className="relative h-8 w-8 overflow-hidden bg-black">
            <div className="absolute -right-2 top-1 h-9 w-9 rounded-tl-[24px] border-[6px] border-white" />
          </div>
        </div>
        <Button
          aria-label="Open app panel"
          title="Open app panel"
          size="icon"
          className="mx-2 bg-indigo-500 hover:bg-indigo-400 md:hidden"
          onClick={() => setMobilePanelOpen(true)}
        >
          <Menu size={18} />
        </Button>
        <div className="hidden h-12 w-12 items-center justify-center border-r border-white/10 bg-indigo-500 md:flex">
          <Sparkles size={20} />
        </div>
        <div className="min-w-0 px-4">
          <p className="truncate text-sm font-semibold text-white">{selectedAppName}</p>
        </div>
        <Button
          aria-label="Toggle panel"
          title="Toggle panel"
          size="icon"
          variant="ghost"
          className="hidden rounded-none md:inline-flex"
          onClick={togglePanel}
        >
          <PanelRightClose className={isPanelCollapsed ? "rotate-180 transition" : "transition"} size={18} />
        </Button>
      </div>

      <div className="pointer-events-auto flex items-center gap-2 rounded-md border border-white/15 bg-[#0a0b0d]/90 p-1 shadow-2xl shadow-black/20 backdrop-blur">
        <Button aria-label="Share" title="Share" size="icon" variant="ghost">
          <Share2 size={18} />
        </Button>
        <Button aria-label="Fit view" title="Fit view" size="icon" variant="panel" onClick={onFitView}>
          <Maximize2 size={18} />
        </Button>
        <Button aria-label="Preview" title="Preview" size="icon" variant="ghost">
          <Eye size={18} />
        </Button>
        <Button aria-label="Theme" title="Theme" size="icon" variant="ghost" className="hidden sm:inline-flex">
          <Moon size={17} />
          <Sun size={15} className="opacity-35" />
        </Button>
        <div className="h-9 w-9 overflow-hidden rounded-full border border-fuchsia-300/60 bg-gradient-to-br from-fuchsia-400 via-blue-500 to-cyan-300 p-[2px]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#231427] text-sm font-black text-white">
            SY
          </div>
        </div>
      </div>
    </header>
  );
}
