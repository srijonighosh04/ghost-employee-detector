import { Handle, Position, NodeProps } from "reactflow";
import { DocumentRecord } from "@/types";
import { FileText } from "lucide-react";

const STALE_STYLE: Record<DocumentRecord["staleness"], { text: string; bg: string; border: string }> = {
  fresh: { text: "text-pulse-glow", bg: "bg-pulse/10", border: "border-pulse/30" },
  aging: { text: "text-signal-glow", bg: "bg-signal/10", border: "border-signal/30" },
  stale: { text: "text-alert-glow", bg: "bg-alert/10", border: "border-alert/30" },
};

export function DocumentNode({ data }: NodeProps<DocumentRecord>) {
  const s = STALE_STYLE[data.staleness];
  return (
    <div className={`glass-inset w-40 rounded-xl2 border p-3 ${s.border}`}>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-white/30" />
      <div className="flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${s.bg} ${s.text}`}>
          <FileText size={12} />
        </span>
        <p className="truncate text-xs font-medium text-bone">{data.title}</p>
      </div>
      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-mono uppercase ${s.bg} ${s.text}`}>
        {data.staleness}
      </span>
    </div>
  );
}
