import { ReactFlowProvider } from "@xyflow/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { AppPanel } from "./components/panels/AppPanel";
import { GraphCanvas } from "./components/canvas/GraphCanvas";
import { LeftRail } from "./components/layout/LeftRail";
import { NodeInspector } from "./components/panels/NodeInspector";
import { TopBar } from "./components/layout/TopBar";
import { useAppsQuery } from "./hooks/useAppsQuery";
import { cn } from "./lib/utils";
import { useAppStore } from "./store/useAppStore";
import type { ServiceFlowNode, ServiceNodeData } from "./types";

export function App() {
  const { data: apps } = useAppsQuery();
  const { selectedAppId, isMobilePanelOpen, isPanelCollapsed, setMobilePanelOpen } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<ServiceFlowNode | null>(null);
  const [nodeUpdater, setNodeUpdater] = useState<((nodeId: string, data: Partial<ServiceNodeData>) => void) | null>(null);
  const fitViewRef = useRef<() => void>(() => undefined);

  const selectedAppName = useMemo(
    () => apps?.find((app) => app.id === selectedAppId)?.name ?? selectedAppId,
    [apps, selectedAppId]
  );

  const handleFitViewReady = useCallback((handler: () => void) => {
    fitViewRef.current = handler;
  }, []);

  const handleNodeUpdaterReady = useCallback((handler: (nodeId: string, data: Partial<ServiceNodeData>) => void) => {
    setNodeUpdater(() => handler);
  }, []);

  return (
    <ReactFlowProvider>
      <main className="canvas-dots relative h-screen w-screen overflow-hidden bg-[#111315]">
        <TopBar selectedAppName={selectedAppName} onFitView={() => fitViewRef.current()} />
        <LeftRail />

        <GraphCanvas
          onSelectedNodeChange={setSelectedNode}
          onFitViewReady={handleFitViewReady}
          onNodeUpdaterReady={handleNodeUpdaterReady}
        />

        <DesktopPanels
          selectedNode={selectedNode}
          isCollapsed={isPanelCollapsed}
          onUpdateNode={(nodeId, data) => nodeUpdater?.(nodeId, data)}
        />

        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition md:hidden",
            isMobilePanelOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
          onClick={() => setMobilePanelOpen(false)}
        />
        <aside
          className={cn(
            "fixed right-0 top-0 z-50 h-full w-[min(92vw,410px)] transform border-l border-white/10 bg-[#050506] p-4 transition md:hidden",
            isMobilePanelOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex h-full min-h-0 flex-col gap-4 pt-2">
            <AppPanel />
            <NodeInspector node={selectedNode} onUpdateNode={(nodeId, data) => nodeUpdater?.(nodeId, data)} />
          </div>
        </aside>
      </main>
    </ReactFlowProvider>
  );
}

type DesktopPanelsProps = {
  selectedNode: ServiceFlowNode | null;
  isCollapsed: boolean;
  onUpdateNode: (nodeId: string, data: Partial<ServiceNodeData>) => void;
};

function DesktopPanels({ selectedNode, isCollapsed, onUpdateNode }: DesktopPanelsProps) {
  return (
    <aside
      className={cn(
        "fixed left-[102px] top-[76px] z-20 hidden h-[calc(100vh-96px)] w-[402px] flex-col gap-4 transition md:flex",
        isCollapsed && "-translate-x-[430px] opacity-0"
      )}
    >
      <div className="min-h-0 flex-[1.15]">
        <AppPanel />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <NodeInspector node={selectedNode} onUpdateNode={onUpdateNode} />
      </div>
    </aside>
  );
}
