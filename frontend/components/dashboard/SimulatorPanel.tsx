"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { employees, teams } from "@/lib/mock-data";
import { getSimulation } from "@/lib/simulate";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { RiskGauge } from "@/components/ui/RiskGauge";
import { Button } from "@/components/ui/Button";
import { cn, riskColor } from "@/lib/utils";
import { fireHaptic } from "@/lib/haptics";
import { AlertTriangle, Clock, Users, ShieldAlert, BookOpen } from "lucide-react";

export function SimulatorPanel() {
  const params = useSearchParams();
  const initial = params.get("employee") ?? "e1";
  const [selectedId, setSelectedId] = useState(initial);

  const employee = employees.find((e) => e.id === selectedId) ?? employees[0];
  const [result, setResult] = useState<any>(null);
  const [loadingResult, setLoadingResult] = useState(false);

  useEffect(() => {
    setLoadingResult(true);
    setResult(null);
    getSimulation(employee.id).then((r) => {
      setResult(r);
      setLoadingResult(false);
    });
  }, [employee.id]);

  // Compute exposed teammates from same team
  const employeeTeam = teams.find((t) => t.name === employee.team);
  const exposedTeammates = (employeeTeam?.memberIds ?? []).filter((id) => id !== employee.id);

  return (
    <div className="grid gap-5 lg:grid-cols-[20rem_1fr]">
      {/* Employee selector */}
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
        {/* Employee header card */}
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
            <Metric
              icon={<ShieldAlert size={14} />}
              label="Knowledge gap"
              value={loadingResult || !result ? "…" : `${result.knowledgeGapScore}`}
              accent="coral"
            />
            <Metric
              icon={<Users size={14} />}
              label="Teammates exposed"
              value={loadingResult || !result ? "…" : String(result.impactedTeammates)}
              accent="amber"
            />
            <Metric
              icon={<Clock size={14} />}
              label="Est. ramp time"
              value={loadingResult || !result ? "…" : `${result.estimatedRampWeeks}w`}
              accent="cyan"
            />
            <div className="flex items-center justify-center">
              <RiskGauge score={employee.riskScore} level={employee.riskLevel} size={72} label="risk" />
            </div>
          </div>

          {/* Documentation coverage bar */}
          <div className="mt-5 border-t border-white/10 pt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate">
                <BookOpen size={12} />
                Documentation coverage
              </span>
              <span
                className="font-mono"
                style={{
                  color:
                    employee.documentationCoverage >= 70
                      ? "#46C2D8"
                      : employee.documentationCoverage >= 45
                      ? "#F0A93B"
                      : "#E15C5C",
                }}
              >
                {employee.documentationCoverage}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${employee.documentationCoverage}%`,
                  backgroundColor:
                    employee.documentationCoverage >= 70
                      ? "#46C2D8"
                      : employee.documentationCoverage >= 45
                      ? "#F0A93B"
                      : "#E15C5C",
                }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate">
              {employee.documentationCoverage < 40
                ? `Critical — the vast majority of ${employee.name.split(" ")[0]}'s institutional knowledge is undocumented.`
                : employee.documentationCoverage < 65
                ? `Below target — a significant portion of their work isn't written down yet.`
                : `Acceptable — most knowledge is documented, but gaps remain.`}
            </p>
          </div>
        </GlassPanel>

        {/* Projects affected */}
        <GlassPanel className="p-6">
          <h3 className="font-display text-base font-medium text-bone">Projects affected</h3>
          {!result || loadingResult ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate">
              <span className="h-1.5 w-1.5 rounded-full bg-slate animate-pulse-soft" />
              Running simulation…
            </div>
          ) : result.impactedProjects.length === 0 ? (
            <p className="mt-3 text-sm text-slate">No active projects would lose their owner.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {result.impactedProjects.map((p: any, i: number) => {
                const c = riskColor(p.severity);
                return (
                  <div
                    key={p.projectId}
                    className={cn(
                      "rounded-xl border p-4 animate-slide-up",
                      c.border, c.bg,
                      `stagger-${Math.min(i + 1, 5)}`
                    )}
                  >
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

        {/* Undocumented areas */}
        {result?.undocumentedAreas && result.undocumentedAreas.length > 0 && (
          <GlassPanel className="p-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-alert/15 text-alert-glow">
                <AlertTriangle size={13} />
              </span>
              <h3 className="font-display text-base font-medium text-bone">Undocumented areas</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate">
              {result.undocumentedAreas.map((a: string) => (
                <li key={a} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-alert" />
                  {a}
                </li>
              ))}
            </ul>
          </GlassPanel>
        )}

        {/* Team exposure */}
        {exposedTeammates.length > 0 && (
          <GlassPanel className="p-6">
            <h3 className="font-display text-base font-medium text-bone mb-3">
              Exposed teammates in {employee.team}
            </h3>
            <div className="flex flex-wrap gap-2">
              {exposedTeammates.map((id) => {
                const emp = employees.find((e) => e.id === id);
                if (!emp) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                  >
                    <Avatar initials={emp.initials} color={emp.avatarColor} size={24} />
                    <div>
                      <p className="text-xs text-bone">{emp.name}</p>
                      <p className="text-[10px] text-slate">{emp.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate">
              These teammates share projects or processes with {employee.name.split(" ")[0]} and would
              feel the knowledge gap most immediately.
            </p>
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
