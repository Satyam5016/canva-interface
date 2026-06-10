import { Activity, Clock, Cpu, Database, HardDrive, MemoryStick, Server } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppStore } from "../../store/useAppStore";
import type { ServiceFlowNode, ServiceNodeData } from "../../types";

type NodeInspectorProps = {
  node: ServiceFlowNode | null;
  onUpdateNode: (nodeId: string, data: Partial<ServiceNodeData>) => void;
};

const statusClasses = {
  Healthy: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Degraded: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  Down: "bg-red-500/15 text-red-300 border-red-400/30"
};

export function NodeInspector({ node, onUpdateNode }: NodeInspectorProps) {
  const { activeInspectorTab, setActiveInspectorTab } = useAppStore();

  if (!node) {
    return (
      <section className="rounded-md border border-white/10 bg-black/95 p-5 shadow-2xl shadow-black/35">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#111827] text-white">
            <Server size={19} />
          </span>
          <div>
            <h2 className="font-bold text-white">Service Node</h2>
            <p className="text-sm text-white/45">Select a node to inspect runtime details.</p>
          </div>
        </div>
      </section>
    );
  }

  const data = node.data;

  return (
    <section className="rounded-md border border-white/10 bg-black/95 p-5 shadow-2xl shadow-black/35">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Service Node</p>
          <h2 className="truncate text-xl font-bold text-white">{data.name}</h2>
        </div>
        <span className={cn("shrink-0 rounded-md border px-2.5 py-1 text-xs font-bold", statusClasses[data.status])}>
          {data.status}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-md bg-[#111827] p-1">
        {(["config", "runtime"] as const).map((tab) => (
          <button
            key={tab}
            className={cn(
              "h-9 rounded-md text-sm font-semibold capitalize text-white/65 transition",
              activeInspectorTab === tab && "bg-white text-black"
            )}
            onClick={() => setActiveInspectorTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeInspectorTab === "config" ? (
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/65">Name</span>
            <input
              value={data.name}
              onChange={(event) => onUpdateNode(node.id, { name: event.target.value })}
              className="h-10 w-full rounded-md border border-white/10 bg-[#15171b] px-3 text-white outline-none focus:border-blue-400/70"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/65">Description</span>
            <textarea
              value={data.description}
              onChange={(event) => onUpdateNode(node.id, { description: event.target.value })}
              rows={4}
              className="w-full resize-none rounded-md border border-white/10 bg-[#15171b] p-3 text-sm leading-6 text-white outline-none focus:border-blue-400/70"
            />
          </label>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-white/65">
              <span>Resource slider</span>
              <span>{data.sliderValue}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                aria-label="Resource slider"
                className="range-rainbow flex-1"
                min={0}
                max={100}
                type="range"
                value={data.sliderValue}
                onChange={(event) => onUpdateNode(node.id, { sliderValue: Number(event.target.value) })}
              />
              <input
                aria-label="Resource value"
                min={0}
                max={100}
                type="number"
                value={data.sliderValue}
                onChange={(event) => onUpdateNode(node.id, { sliderValue: Number(event.target.value) })}
                className="h-10 w-20 rounded-md border border-white/10 bg-[#15171b] px-3 text-right text-white outline-none focus:border-blue-400/70"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Metric icon={Cpu} label="CPU" value={data.metrics.cpu.toFixed(2)} />
          <Metric icon={MemoryStick} label="Memory" value={data.metrics.memory} />
          <Metric icon={HardDrive} label="Disk" value={data.metrics.disk} />
          <Metric icon={Database} label="Region" value={data.metrics.region} />
          <Metric icon={Activity} label="Provider" value={data.provider.toUpperCase()} />
          <Metric icon={Server} label="Status" value={data.status} />
          <Metric icon={Clock} label="Last updated" value={data.lastUpdated} />
        </div>
      )}
    </section>
  );
}

type MetricProps = {
  icon: typeof Cpu;
  label: string;
  value: string;
};

function Metric({ icon: Icon, label, value }: MetricProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-[#101215] p-3">
      <span className="flex items-center gap-2 text-sm text-white/55">
        <Icon size={16} />
        {label}
      </span>
      <span className="min-w-0 truncate text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
