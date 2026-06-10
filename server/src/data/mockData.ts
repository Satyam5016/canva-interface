export type AppSummary = {
  id: string;
  name: string;
  icon: "bulb" | "settings" | "rocket" | "briefcase" | "puzzle";
};

export type GraphNodeType = "service" | "database" | "cache";
export type GraphNodeStatus = "Healthy" | "Degraded" | "Down";

export type GraphNode = {
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

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
};

export const apps: AppSummary[] = [
  { id: "supertokens-golang", name: "supertokens-golang", icon: "bulb" },
  { id: "supertokens-java", name: "supertokens-java", icon: "settings" },
  { id: "supertokens-python", name: "supertokens-python", icon: "rocket" },
  { id: "supertokens-ruby", name: "supertokens-ruby", icon: "briefcase" },
  { id: "supertokens-go", name: "supertokens-go", icon: "puzzle" }
];

const baseNodes: GraphNode[] = [
  {
    id: "auth-api",
    name: "Auth API",
    type: "service",
    status: "Healthy",
    description: "Primary token verification and session service for customer workloads.",
    sliderValue: 76,
    resourceValue: 0.02,
    provider: "aws",
    position: { x: 210, y: 120 },
    metrics: { cpu: 0.02, memory: "0.05 GB", disk: "10.00 GB", region: "us-east-1" }
  },
  {
    id: "postgres",
    name: "Postgres",
    type: "database",
    status: "Healthy",
    description: "Durable relational store for user metadata and app configuration.",
    sliderValue: 86,
    resourceValue: 0.02,
    provider: "aws",
    position: { x: 760, y: 190 },
    metrics: { cpu: 0.02, memory: "0.05 GB", disk: "10.00 GB", region: "us-east-1" }
  },
  {
    id: "redis",
    name: "Redis",
    type: "cache",
    status: "Down",
    description: "Low-latency cache for token sessions, revocation lists, and rate limits.",
    sliderValue: 78,
    resourceValue: 0.02,
    provider: "aws",
    position: { x: 280, y: 560 },
    metrics: { cpu: 0.02, memory: "0.05 GB", disk: "10.00 GB", region: "us-east-1" }
  },
  {
    id: "mongodb",
    name: "Mongodb",
    type: "database",
    status: "Degraded",
    description: "Document store used by tenant analytics and audit aggregation jobs.",
    sliderValue: 90,
    resourceValue: 0.02,
    provider: "aws",
    position: { x: 870, y: 630 },
    metrics: { cpu: 0.02, memory: "0.05 GB", disk: "10.00 GB", region: "eu-west-1" }
  }
];

export const getGraphForApp = (appId: string) => {
  const offset = apps.findIndex((app) => app.id === appId) * 18;
  return {
    nodes: baseNodes.map((node) => ({
      ...node,
      position: { x: node.position.x + offset, y: node.position.y + offset / 2 }
    })),
    edges: [
      { id: "auth-api-postgres", source: "auth-api", target: "postgres" },
      { id: "auth-api-redis", source: "auth-api", target: "redis" },
      { id: "postgres-mongodb", source: "postgres", target: "mongodb" }
    ] satisfies GraphEdge[]
  };
};
