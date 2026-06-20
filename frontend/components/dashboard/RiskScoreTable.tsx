"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Employee } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { fireHaptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

type SortKey = "riskScore" | "documentationCoverage" | "dependents" | "tenureYears";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "riskScore", label: "Risk score" },
  { key: "documentationCoverage", label: "Doc coverage" },
  { key: "dependents", label: "Dependents" },
  { key: "tenureYears", label: "Tenure" },
];

function DocBar({ pct }: { pct: number }) {
  const color =
    pct >= 70 ? "#46C2D8" : pct >= 45 ? "#F0A93B" : "#E15C5C";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-xs tabular-nums" style={{ color }}>{pct}%</span>
    </div>
  );
}

function RiskBar({ score, level }: { score: number; level: Employee["riskLevel"] }) {
  const colors: Record<Employee["riskLevel"], string> = {
    critical: "#E15C5C",
    high: "#F0A93B",
    medium: "#46C2D8",
    low: "#8891A8",
  };
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: colors[level] }}
        />
      </div>
      <span className="font-mono text-xs tabular-nums text-bone">{score}</span>
    </div>
  );
}

export function RiskScoreTable({ employees }: { employees: Employee[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [desc, setDesc] = useState(true);
  const [filter, setFilter] = useState<Employee["riskLevel"] | "all">("all");

  const sorted = useMemo(() => {
    const copy = [...employees].filter((e) => filter === "all" || e.riskLevel === filter);
    copy.sort((a, b) => (desc ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]));
    return copy;
  }, [employees, sortKey, desc, filter]);

  function toggleSort(key: SortKey) {
    fireHaptic("tap");
    if (key === sortKey) {
      setDesc((d) => !d);
    } else {
      setSortKey(key);
      setDesc(true);
    }
  }

  const criticalCount = employees.filter((e) => e.riskLevel === "critical").length;
  const highCount = employees.filter((e) => e.riskLevel === "high").length;

  const FILTERS: { label: string; value: Employee["riskLevel"] | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Critical", value: "critical" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate">
        <span>{employees.length} employees mapped</span>
        <span className="h-1 w-1 rounded-full bg-white/20" />
        <span className="text-alert-glow">{criticalCount} critical</span>
        <span className="h-1 w-1 rounded-full bg-white/20" />
        <span className="text-signal-glow">{highCount} high</span>
        <span className="h-1 w-1 rounded-full bg-white/20" />
        <span>
          avg doc coverage{" "}
          {Math.round(employees.reduce((s, e) => s + e.documentationCoverage, 0) / employees.length)}%
        </span>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              fireHaptic("tap");
              setFilter(f.value);
            }}
            className={cn(
              "press-feedback rounded-full border px-3 py-1 text-xs font-mono transition-colors",
              filter === f.value
                ? "border-signal/50 bg-signal/15 text-signal-glow"
                : "border-white/10 bg-white/[0.03] text-slate hover:bg-white/[0.06] hover:text-bone"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <GlassPanel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-slate">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium text-slate">Team</th>
                {COLUMNS.map((c) => (
                  <th key={c.key} className="px-5 py-3 font-medium">
                    <button
                      onClick={() => toggleSort(c.key)}
                      className="press-feedback flex items-center gap-1.5 hover:text-bone"
                    >
                      {c.label}
                      <ArrowUpDown
                        size={11}
                        className={sortKey === c.key ? "text-signal-glow" : ""}
                      />
                    </button>
                  </th>
                ))}
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={e.initials} color={e.avatarColor} size={30} />
                      <div>
                        <p className="text-bone">{e.name}</p>
                        <p className="text-xs text-slate">{e.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate">{e.team}</td>
                  <td className="px-5 py-3">
                    <RiskBar score={e.riskScore} level={e.riskLevel} />
                  </td>
                  <td className="px-5 py-3">
                    <DocBar pct={e.documentationCoverage} />
                  </td>
                  <td className="px-5 py-3 font-mono text-slate">{e.dependents}</td>
                  <td className="px-5 py-3 font-mono text-slate">{e.tenureYears} yrs</td>
                  <td className="px-5 py-3">
                    <RiskBadge level={e.riskLevel} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/dashboard/simulator?employee=${e.id}`}
                      className="inline-flex items-center gap-1 text-xs text-pulse-glow hover:underline"
                    >
                      Simulate <ExternalLink size={10} />
                    </Link>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-sm text-slate">
                    No employees match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
