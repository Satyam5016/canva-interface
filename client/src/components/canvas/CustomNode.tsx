import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { Cpu, Database, HardDrive, MemoryStick, Server, Settings } from "lucide-react";
import { cn } from "../../lib/utils";
import type { ServiceFlowNode } from "../../types";

const statusClasses = {
  Healthy: "border-emerald-400/70 bg-emerald-500/20 text-emerald-300",
  Degraded: "border-amber-400/70 bg-amber-500/20 text-amber-200",
  Down: "border-red-400/60 bg-red-500/20 text-red-300"
};

const typeIcons = {
  service: Server,
  database: Database,
  cache: MemoryStick
};

const typeTile = {
  service: "bg-indigo-500 text-white",
  database: "bg-white text-[#1c2a30]",
  cache: "bg-white text-red-500"
};

export function CustomNode({ data, selected }: NodeProps<ServiceFlowNode>) {
  const Icon = typeIcons[data.type];

  return (
    <div
      className={cn(
        "w-[445px] rounded-md border bg-black p-6 shadow-2xl shadow-black/40 transition",
        selected ? "border-blue-400/80 ring-4 ring-blue-500/20" : "border-white/5"
      )}
    >
      <Handle type="target" position={Position.Left} className="!border-blue-300 !bg-blue-500" />
      <Handle type="source" position={Position.Right} className="!border-blue-300 !bg-blue-500" />

      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", typeTile[data.type])}>
            <Icon size={19} />
          </span>
          <h3 className="truncate text-lg font-bold text-white">{data.name}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="rounded-md border border-emerald-400/70 px-2.5 py-2 text-xs font-bold text-emerald-400">
            $0.03/HR
          </span>
          <button className="flex h-9 w-9 items-center justify-center rounded-md bg-[#111827] text-white/90">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2 px-1 text-center text-sm text-white">
        <span>{data.metrics.cpu.toFixed(2)}</span>
        <span>{data.metrics.memory}</span>
        <span>{data.metrics.disk}</span>
        <span>{data.metrics.region === "us-east-1" ? "1" : data.metrics.region}</span>
      </div>

      <div className="mb-6 grid grid-cols-4 overflow-hidden rounded-md bg-[#111827] text-sm text-white">
        <span className="flex h-9 items-center justify-center gap-1.5 rounded-md bg-white font-semibold text-black">
          <Cpu size={16} /> CPU
        </span>
        <span className="flex h-9 items-center justify-center gap-1.5">
          <MemoryStick size={16} className="text-white/65" /> Memory
        </span>
        <span className="flex h-9 items-center justify-center gap-1.5">
          <HardDrive size={16} className="text-white/65" /> Disk
        </span>
        <span className="flex h-9 items-center justify-center gap-1.5">
          <Database size={16} className="text-white/65" /> Region
        </span>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500">
          <div className="relative h-full" style={{ width: `${Math.max(4, data.sliderValue)}%` }}>
            <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-white" />
          </div>
        </div>
        <span className="flex h-10 w-[104px] items-center justify-end rounded-md border border-white/10 bg-black px-4 text-sm text-white">
          {data.resourceValue.toFixed(2)}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <span className={cn("rounded-md border px-3 py-1.5 text-sm font-bold", statusClasses[data.status])}>
          {data.status === "Healthy" ? "Success" : data.status === "Down" ? "Error" : "Degraded"}
        </span>
        <span className="text-3xl font-black tracking-normal text-orange-400">aws</span>
      </div>
    </div>
  );
}
