export type AppIcon = "bulb" | "settings" | "rocket" | "briefcase" | "puzzle";

export type AppSummary = {
  id: string;
  name: string;
  icon: AppIcon;
};

export type GraphNodeType = "service" | "database" | "cache";
export type GraphNodeStatus = "Healthy" | "Degraded" | "Down";

export type ServiceNodeData = Record<string, unknown> & {
  id: string;
  name: string;
  type: GraphNodeType;
  status: GraphNodeStatus;
  description: string;
  sliderValue: number;
  resourceValue: number;
  provider: string;
  metrics: {
    cpu: number;
    memory: string;
    disk: string;
    region: string;
  };
  lastUpdated: string;
};

export type ServiceFlowNode = Node<ServiceNodeData, "serviceNode">;

export type ApiGraphNode = {
  id: string;
  name: string;
  type: GraphNodeType;
  status: GraphNodeStatus;
  description: string;
  sliderValue: number;
  resourceValue: number;
  provider: string;
  position: { x: number; y: number };
  metrics: {
    cpu: number;
    memory: string;
    disk: string;
    region: string;
  };
};

export type ApiGraphEdge = {
  id: string;
  source: string;
  target: string;
};

export type GraphResponse = {
  nodes: ApiGraphNode[];
  edges: ApiGraphEdge[];
};
import type { Node } from "@xyflow/react";
