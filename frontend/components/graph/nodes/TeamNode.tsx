import { Handle, Position, NodeProps } from "reactflow";
import { Users2 } from "lucide-react";

export function TeamNode({ data }: NodeProps<{ label: string; sublabel: string }>) {
  return (
    <div className="glass-raised w-44 rounded-xl2 border border-white/15 p-3 shadow-glow-cyan">
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-pulse" />
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pulse/15 text-pulse-glow">
          <Users2 size={14} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-bone">{data.label}</p>
          <p className="truncate text-[10px] text-slate">{data.sublabel}</p>
        </div>
      </div>
    </div>
  );
}
