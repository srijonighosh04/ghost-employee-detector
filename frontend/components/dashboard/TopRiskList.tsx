import Link from "next/link";
import { Employee } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { RiskGauge } from "@/components/ui/RiskGauge";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function TopRiskList({ employees }: { employees: Employee[] }) {
  return (
    <GlassPanel className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-medium text-bone">Highest knowledge risk</h3>
        <Link href="/dashboard/risk-scores" className="text-xs text-pulse-glow hover:underline">
          View all
        </Link>
      </div>
      <div className="flex flex-col gap-1">
        {employees.map((e) => (
          <Link
            key={e.id}
            href={`/dashboard/simulator?employee=${e.id}`}
            className="press-feedback flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-white/[0.04]"
          >
            <Avatar initials={e.initials} color={e.avatarColor} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-bone">{e.name}</p>
              <p className="truncate text-xs text-slate">{e.role}</p>
            </div>
            <RiskBadge level={e.riskLevel} className="hidden sm:flex" />
            <RiskGauge score={e.riskScore} level={e.riskLevel} size={44} />
          </Link>
        ))}
      </div>
    </GlassPanel>
  );
}
