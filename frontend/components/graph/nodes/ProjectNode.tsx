import { Handle, Position, NodeProps } from "reactflow";
import { Project } from "@/types";
import { Boxes } from "lucide-react";

const STATUS_STYLE: Record<Project["status"], { text: string; bg: string; border: string }> = {
  "on-track": { text: "text-pulse-glow", bg: "bg-pulse/10", border: "border-pulse/30" },
  "at-risk": { text: "text-signal-glow", bg: "bg-signal/10", border: "border-signal/30" },
  blocked: { text: "text-alert-glow", bg: "bg-alert/10", border: "border-alert/30" },
};

export function ProjectNode({ data }: NodeProps<Project>) {
  const s = STATUS_STYLE[data.status];
  return (
    <div className={`glass w-40 rounded-xl2 border p-3 ${s.border}`}>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-pulse" />
      <div className="flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${s.bg} ${s.text}`}>
          <Boxes size={12} />
        </span>
        <p className="truncate text-xs font-medium text-bone">{data.name}</p>
      </div>
      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-mono uppercase ${s.bg} ${s.text}`}>
        {data.status.replace("-", " ")}
      </span>
    </div>
  );
}
