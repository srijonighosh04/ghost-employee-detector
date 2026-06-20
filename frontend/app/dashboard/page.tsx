import { employees, documents, projects } from "@/lib/mock-data";
import { StatCard } from "@/components/ui/StatCard";
import { TopRiskList } from "@/components/dashboard/TopRiskList";
import { DocStalenessList } from "@/components/dashboard/DocStalenessList";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Users, ShieldAlert, FileWarning, GitBranchPlus, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OverviewPage() {
  const critical = employees.filter((e) => e.riskLevel === "critical").length;
  const avgDocCoverage = Math.round(
    employees.reduce((s, e) => s + e.documentationCoverage, 0) / employees.length
  );
  const atRiskProjects = projects.filter((p) => p.status !== "on-track").length;
  const topRisk = [...employees].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  const staleDocs = documents.filter((d) => d.staleness === "stale").length;
  const highestRisk = topRisk[0];

  const ACTIONS = [
    {
      label: `Simulate ${highestRisk.name.split(" ")[0]}'s resignation`,
      sub: `Risk score ${highestRisk.riskScore} — your highest exposure`,
      href: `/dashboard/simulator?employee=${highestRisk.id}`,
      color: "text-alert-glow bg-alert/15 border-alert/30",
      badge: "Critical",
    },
    {
      label: `Generate handover brief for ${highestRisk.name.split(" ")[0]}`,
      sub: `Only ${highestRisk.documentationCoverage}% of their knowledge is documented`,
      href: `/dashboard/handover?employee=${highestRisk.id}`,
      color: "text-signal-glow bg-signal/15 border-signal/30",
      badge: "High priority",
    },
    {
      label: `Review ${staleDocs} stale document${staleDocs !== 1 ? "s" : ""}`,
      sub: "Out-of-date runbooks and SOPs are a continuity risk",
      href: `/dashboard`,
      color: "text-pulse-glow bg-pulse/15 border-pulse/30",
      badge: "Recommended",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stat cards */}
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

      {/* Risk + docs */}
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <TopRiskList employees={topRisk} />
        <DocStalenessList documents={documents} employees={employees} />
      </div>

      {/* Recommended actions */}
      <GlassPanel variant="raised" className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal/15 text-signal-glow">
            <Zap size={13} />
          </span>
          <h3 className="font-display text-base font-medium text-bone">Recommended actions</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {ACTIONS.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="press-feedback group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors"
            >
              <span
                className={`self-start rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wide ${a.color}`}
              >
                {a.badge}
              </span>
              <p className="text-sm font-medium text-bone leading-snug">{a.label}</p>
              <p className="text-xs text-slate leading-relaxed">{a.sub}</p>
              <span className="mt-auto flex items-center gap-1 text-xs text-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity">
                Go <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>
      </GlassPanel>

      {/* Primary CTA banner */}
      <GlassPanel
        variant="raised"
        className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center"
        glow="amber"
      >
        <div>
          <h3 className="font-display text-base font-medium text-bone">
            Priya Nair is your single highest exposure right now.
          </h3>
          <p className="mt-1 text-sm text-slate">
            Critical risk score of 92, three at-risk projects, and a deploy runbook that hasn&apos;t
            been touched in 14 months.
          </p>
        </div>
        <Link href="/dashboard/simulator?employee=e1" className="shrink-0">
          <Button variant="primary">Simulate her resignation</Button>
        </Link>
      </GlassPanel>
    </div>
  );
}
