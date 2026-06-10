import { create } from "zustand";

type InspectorTab = "config" | "runtime";

type AppStore = {
  selectedAppId: string;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
  isPanelCollapsed: boolean;
  setSelectedAppId: (appId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setMobilePanelOpen: (isOpen: boolean) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  togglePanel: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  selectedAppId: "supertokens-golang",
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: "config",
  isPanelCollapsed: false,
  setSelectedAppId: (selectedAppId) =>
    set({ selectedAppId, selectedNodeId: null, isMobilePanelOpen: false }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  setMobilePanelOpen: (isMobilePanelOpen) => set({ isMobilePanelOpen }),
  setActiveInspectorTab: (activeInspectorTab) => set({ activeInspectorTab }),
  togglePanel: () => set((state) => ({ isPanelCollapsed: !state.isPanelCollapsed }))
}));
