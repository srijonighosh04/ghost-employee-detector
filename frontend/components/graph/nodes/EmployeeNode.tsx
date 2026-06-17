import { Handle, Position, NodeProps } from "reactflow";
import { Employee } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { riskColor } from "@/lib/utils";

export function EmployeeNode({ data }: NodeProps<Employee>) {
  const c = riskColor(data.riskLevel);
  return (
    <div className={`glass-raised w-44 rounded-xl2 border p-3 ${c.border}`}>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-pulse" />
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-pulse" />
      <div className="flex items-center gap-2.5">
        <Avatar initials={data.initials} color={data.avatarColor} size={32} />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-bone">{data.name}</p>
          <p className="truncate text-[10px] text-slate">{data.role}</p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-mono uppercase ${c.bg} ${c.text}`}>
          {data.riskLevel}
        </span>
        <span className="font-mono text-[11px] text-bone">{data.riskScore}</span>
      </div>
    </div>
  );
}
