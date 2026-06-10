import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
  type NodeTypes,
  useReactFlow
} from "@xyflow/react";
import { AlertTriangle, Loader2, Plus, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGraphQuery } from "../../hooks/useGraphQuery";
import { useAppStore } from "../../store/useAppStore";
import type { ServiceFlowNode, ServiceNodeData } from "../../types";
import { Button } from "../ui/Button";
import { CustomNode } from "./CustomNode";

type GraphCanvasProps = {
  onSelectedNodeChange: (node: ServiceFlowNode | null) => void;
  onFitViewReady: (handler: () => void) => void;
  onNodeUpdaterReady: (handler: (nodeId: string, data: Partial<ServiceNodeData>) => void) => void;
};

type CachedGraph = {
  nodes: ServiceFlowNode[];
  edges: Edge[];
};

const nodeTypes = { serviceNode: CustomNode } satisfies NodeTypes;

export function GraphCanvas({ onSelectedNodeChange, onFitViewReady, onNodeUpdaterReady }: GraphCanvasProps) {
  const { selectedAppId, selectedNodeId, setSelectedNodeId, togglePanel, setMobilePanelOpen } = useAppStore();
  const { data, isLoading, isError, refetch } = useGraphQuery(selectedAppId);
  const [nodes, setNodes] = useState<ServiceFlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const graphCacheRef = useRef<Record<string, CachedGraph>>({});
  const { fitView } = useReactFlow();
  const didFitAppRef = useRef<string | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  useEffect(() => {
    onSelectedNodeChange(selectedNode);
  }, [onSelectedNodeChange, selectedNode]);

  useEffect(() => {
    if (!data) {
      return;
    }

    const cached = graphCacheRef.current[selectedAppId];
    if (cached) {
      setNodes(cached.nodes);
      setEdges(cached.edges);
      return;
    }

    const loadedNodes: ServiceFlowNode[] = data.nodes.map(({ position, ...nodeData }) => ({
      id: nodeData.id,
      type: "serviceNode",
      position,
      data: {
        ...nodeData,
        lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    }));

    const loadedEdges: Edge[] = data.edges.map((edge) => ({
      ...edge,
      type: "smoothstep",
      animated: true
    }));

    setNodes(loadedNodes);
    setEdges(loadedEdges);
    graphCacheRef.current[selectedAppId] = { nodes: loadedNodes, edges: loadedEdges };
    didFitAppRef.current = null;
  }, [data, selectedAppId]);

  const persistGraph = useCallback(
    (nextNodes: ServiceFlowNode[], nextEdges: Edge[]) => {
      if (selectedAppId && nextNodes.length > 0) {
        graphCacheRef.current[selectedAppId] = { nodes: nextNodes, edges: nextEdges };
      }
    },
    [selectedAppId]
  );

  const runFitView = useCallback(() => {
    window.requestAnimationFrame(() => {
      fitView({ padding: 0.24, duration: 550, maxZoom: 1 });
    });
  }, [fitView]);

  const updateNodeData = useCallback(
    (nodeId: string, dataUpdate: Partial<ServiceNodeData>) => {
      setNodes((current) => {
        const nextNodes = current.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...dataUpdate,
                  lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
              }
            : node
        );
        persistGraph(nextNodes, edges);
        return nextNodes;
      });
    },
    [edges, persistGraph]
  );

  useEffect(() => {
    onFitViewReady(runFitView);
  }, [onFitViewReady, runFitView]);

  useEffect(() => {
    onNodeUpdaterReady(updateNodeData);
  }, [onNodeUpdaterReady, updateNodeData]);

  useEffect(() => {
    if (nodes.length > 0 && didFitAppRef.current !== selectedAppId) {
      didFitAppRef.current = selectedAppId;
      runFitView();
    }
  }, [nodes.length, runFitView, selectedAppId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      if (isTyping) {
        return;
      }

      if ((event.key === "Delete" || event.key === "Backspace") && selectedNodeId) {
        const nextNodes = nodes.filter((node) => node.id !== selectedNodeId);
        const nextEdges = edges.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId);

        setNodes(nextNodes);
        setEdges(nextEdges);
        if (nextNodes.length > 0) {
          persistGraph(nextNodes, nextEdges);
        } else {
          delete graphCacheRef.current[selectedAppId];
        }
        setSelectedNodeId(null);
      }

      if (event.key.toLowerCase() === "f") {
        runFitView();
      }

      if (event.key.toLowerCase() === "p") {
        togglePanel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [edges, nodes, persistGraph, runFitView, selectedAppId, selectedNodeId, setSelectedNodeId, togglePanel]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((current) => {
        const nextEdges = addEdge({ ...connection, type: "smoothstep", animated: true }, current);
        persistGraph(nodes, nextEdges);
        return nextEdges;
      }),
    [nodes, persistGraph]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<ServiceFlowNode>[]) => {
      setNodes((current) => {
        const nextNodes = applyNodeChanges(changes, current) as ServiceFlowNode[];
        persistGraph(nextNodes, edges);
        return nextNodes;
      });
    },
    [edges, persistGraph]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((current) => {
        const nextEdges = applyEdgeChanges(changes, current);
        persistGraph(nodes, nextEdges);
        return nextEdges;
      });
    },
    [nodes, persistGraph]
  );

  const addNode = useCallback(() => {
    const id = `service-${Date.now()}`;
    const nextNode: ServiceFlowNode = {
      id,
      type: "serviceNode",
      position: { x: 420 + nodes.length * 28, y: 260 + nodes.length * 18 },
      data: {
        id,
        name: "New Service",
        type: "service",
        status: "Healthy",
        description: "New service added during this builder session.",
        sliderValue: 52,
        resourceValue: 0.02,
        provider: "aws",
        metrics: { cpu: 0.02, memory: "0.05 GB", disk: "10.00 GB", region: "us-east-1" },
        lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    };

    setNodes((current) => {
      const nextNodes = [...current, nextNode];
      persistGraph(nextNodes, edges);
      return nextNodes;
    });
    setSelectedNodeId(id);
    setMobilePanelOpen(true);
  }, [edges, nodes.length, persistGraph, setMobilePanelOpen, setSelectedNodeId]);

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id);
          setMobilePanelOpen(true);
        }}
        onPaneClick={() => setSelectedNodeId(null)}
        fitView
        minZoom={0.35}
        maxZoom={1.35}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="rgba(255,255,255,0.08)" />
        <MiniMap pannable zoomable nodeColor={() => "#2563eb"} maskColor="rgba(0,0,0,0.38)" />
        <Controls position="bottom-right" />
      </ReactFlow>

      <div className="absolute bottom-6 left-6 z-10 flex gap-2 md:left-24">
        <Button size="sm" variant="primary" onClick={addNode}>
          <Plus size={17} />
          Add Node
        </Button>
        <Button size="sm" variant="panel" onClick={runFitView}>
          <RotateCcw size={17} />
          Fit
        </Button>
      </div>

      {isLoading ? (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/20 backdrop-blur-[1px]">
          <div className="flex items-center gap-3 rounded-md border border-white/10 bg-black/85 px-4 py-3 text-white">
            <Loader2 className="animate-spin" size={19} />
            Loading graph
          </div>
        </div>
      ) : null}

      {isError ? (
        <div className="absolute left-1/2 top-28 z-20 w-[min(420px,calc(100%-32px))] -translate-x-1/2 rounded-md border border-red-400/20 bg-black/95 p-4 text-red-100 shadow-2xl">
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <AlertTriangle size={18} />
            Graph failed to load
          </div>
          <Button size="sm" variant="danger" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : null}
    </div>
  );
}
