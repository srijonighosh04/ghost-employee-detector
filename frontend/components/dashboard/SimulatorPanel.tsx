"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { employees } from "@/lib/mock-data";
import { getSimulation } from "@/lib/simulate";
import { Avatar } from "@/components/ui/Avatar";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { RiskGauge } from "@/components/ui/RiskGauge";
import { Button } from "@/components/ui/Button";
import { cn, riskColor } from "@/lib/utils";
import { fireHaptic } from "@/lib/haptics";
import { AlertTriangle, Clock, Users } from "lucide-react";

export function SimulatorPanel() {
  const params = useSearchParams();
  const initial = params.get("employee") ?? "e1";
  const [selectedId, setSelectedId] = useState(initial);

  const employee = employees.find((e) => e.id === selectedId) ?? employees[0];
  const result = getSimulation(employee.id);

  return (
    <div className="grid gap-5 lg:grid-cols-[20rem_1fr]">
      <GlassPanel className="h-fit p-4">
        <h3 className="px-1 pb-3 font-display text-sm font-medium text-bone">Choose an employee</h3>
        <div className="flex flex-col gap-1">
          {employees.map((e) => {
            const active = e.id === employee.id;
            return (
              <button
                key={e.id}
                onClick={() => {
                  fireHaptic("select");
                  setSelectedId(e.id);
                }}
                className={cn(
                  "press-feedback flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors",
                  active ? "bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" : "hover:bg-white/[0.04]"
                )}
              >
                <Avatar initials={e.initials} color={e.avatarColor} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-bone">{e.name}</p>
                  <p className="truncate text-xs text-slate">{e.role}</p>
                </div>
                <span className={cn("h-2 w-2 shrink-0 rounded-full", riskColor(e.riskLevel).dot)} />
              </button>
            );
          })}
        </div>
      </GlassPanel>

      <div className="space-y-5">
        <GlassPanel variant="raised" className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar initials={employee.initials} color={employee.avatarColor} size={48} />
              <div>
                <h2 className="font-display text-lg font-medium text-bone">
                  If {employee.name.split(" ")[0]} resigned tomorrow…
                </h2>
                <p className="text-sm text-slate">{employee.role} · {employee.team}</p>
              </div>
            </div>
            <RiskBadge level={employee.riskLevel} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric icon={<AlertTriangle size={14} />} label="Knowledge gap" value={`${result.knowledgeGapScore}`} accent="coral" />
            <Metric icon={<Users size={14} />} label="Teammates exposed" value={String(result.impactedTeammates)} accent="amber" />
            <Metric icon={<Clock size={14} />} label="Est. ramp time" value={`${result.estimatedRampWeeks}w`} accent="cyan" />
            <div className="flex items-center justify-center">
              <RiskGauge score={employee.riskScore} level={employee.riskLevel} size={72} label="risk" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h3 className="font-display text-base font-medium text-bone">Projects affected</h3>
          {result.impactedProjects.length === 0 ? (
            <p className="mt-3 text-sm text-slate">No active projects would lose their owner.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {result.impactedProjects.map((p) => {
                const c = riskColor(p.severity);
                return (
                  <div key={p.projectId} className={cn("rounded-xl border p-4", c.border, c.bg)}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-bone">{p.name}</p>
                      <RiskBadge level={p.severity} />
                    </div>
                    <p className="mt-1.5 text-xs text-slate">{p.reason}</p>
                  </div>
                );
              })}
            </div>
          )}
        </GlassPanel>

        {result.undocumentedAreas.length > 0 && (
          <GlassPanel className="p-6">
            <h3 className="font-display text-base font-medium text-bone">Undocumented areas</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate">
              {result.undocumentedAreas.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-alert" />
                  {a}
                </li>
              ))}
            </ul>
          </GlassPanel>
        )}

        <div className="flex justify-end">
          <Link href={`/dashboard/handover?employee=${employee.id}`}>
            <Button variant="primary">Generate handover brief for {employee.name.split(" ")[0]}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "amber" | "cyan" | "coral";
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
      <span
        className={cn(
          "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
          accent === "amber" && "bg-signal/15 text-signal-glow",
          accent === "cyan" && "bg-pulse/15 text-pulse-glow",
          accent === "coral" && "bg-alert/15 text-alert-glow"
        )}
      >
        {icon}
      </span>
      <p className="mt-2 font-mono text-lg text-bone">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-slate">{label}</p>
    </div>
  );
}
