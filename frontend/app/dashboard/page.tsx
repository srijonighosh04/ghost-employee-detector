import { employees, documents, projects } from "@/lib/mock-data";
import { StatCard } from "@/components/ui/StatCard";
import { TopRiskList } from "@/components/dashboard/TopRiskList";
import { DocStalenessList } from "@/components/dashboard/DocStalenessList";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Users, ShieldAlert, FileWarning, GitBranchPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OverviewPage() {
  const critical = employees.filter((e) => e.riskLevel === "critical").length;
  const avgDocCoverage = Math.round(
    employees.reduce((s, e) => s + e.documentationCoverage, 0) / employees.length
  );
  const atRiskProjects = projects.filter((p) => p.status !== "on-track").length;
  const topRisk = [...employees].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Employees mapped"
          value={String(employees.length)}
          trend="Across 4 teams"
          icon={<Users size={16} />}
          accent="cyan"
        />
        <StatCard
          label="Critical knowledge risk"
          value={String(critical)}
          trend="+1 vs last review"
          trendDirection="up"
          icon={<ShieldAlert size={16} />}
          accent="coral"
        />
        <StatCard
          label="Avg. documentation coverage"
          value={`${avgDocCoverage}%`}
          trend="Below 60% target"
          trendDirection="up"
          icon={<FileWarning size={16} />}
          accent="amber"
        />
        <StatCard
          label="Projects at risk or blocked"
          value={String(atRiskProjects)}
          trend={`of ${projects.length} active projects`}
          icon={<GitBranchPlus size={16} />}
          accent="amber"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <TopRiskList employees={topRisk} />
        <DocStalenessList documents={documents} employees={employees} />
      </div>

      <GlassPanel variant="raised" className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-base font-medium text-bone">
            Priya Nair is your single highest exposure right now.
          </h3>
          <p className="mt-1 text-sm text-slate">
            Critical risk score of 92, three at-risk projects, and a deploy runbook that hasn&apos;t been touched in 14 months.
          </p>
        </div>
        <Link href="/dashboard/simulator?employee=e1" className="shrink-0">
          <Button variant="primary">Simulate her resignation</Button>
        </Link>
      </GlassPanel>
    </div>
  );
}
