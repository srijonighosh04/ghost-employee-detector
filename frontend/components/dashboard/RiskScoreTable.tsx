"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Employee } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowUpDown } from "lucide-react";
import { fireHaptic } from "@/lib/haptics";

type SortKey = "riskScore" | "documentationCoverage" | "dependents" | "tenureYears";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "riskScore", label: "Risk score" },
  { key: "documentationCoverage", label: "Doc coverage" },
  { key: "dependents", label: "Dependents" },
  { key: "tenureYears", label: "Tenure" },
];

export function RiskScoreTable({ employees }: { employees: Employee[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [desc, setDesc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...employees];
    copy.sort((a, b) => (desc ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]));
    return copy;
  }, [employees, sortKey, desc]);

  function toggleSort(key: SortKey) {
    fireHaptic("tap");
    if (key === sortKey) {
      setDesc((d) => !d);
    } else {
      setSortKey(key);
      setDesc(true);
    }
  }

  return (
    <GlassPanel className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs text-slate">
              <th className="px-5 py-3 font-medium">Employee</th>
              {COLUMNS.map((c) => (
                <th key={c.key} className="px-5 py-3 font-medium">
                  <button
                    onClick={() => toggleSort(c.key)}
                    className="press-feedback flex items-center gap-1.5 hover:text-bone"
                  >
                    {c.label}
                    <ArrowUpDown size={11} className={sortKey === c.key ? "text-signal-glow" : ""} />
                  </button>
                </th>
              ))}
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => (
              <tr key={e.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={e.initials} color={e.avatarColor} size={30} />
                    <div>
                      <p className="text-bone">{e.name}</p>
                      <p className="text-xs text-slate">{e.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-bone">{e.riskScore}</td>
                <td className="px-5 py-3 font-mono text-slate">{e.documentationCoverage}%</td>
                <td className="px-5 py-3 font-mono text-slate">{e.dependents}</td>
                <td className="px-5 py-3 font-mono text-slate">{e.tenureYears} yrs</td>
                <td className="px-5 py-3">
                  <RiskBadge level={e.riskLevel} />
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/dashboard/simulator?employee=${e.id}`}
                    className="text-xs text-pulse-glow hover:underline"
                  >
                    Simulate →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}
