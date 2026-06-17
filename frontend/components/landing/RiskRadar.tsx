import { employees, teams } from "@/lib/mock-data";
import { GlassPanel } from "@/components/ui/GlassPanel";

function teamRisk(teamName: string) {
  const members = employees.filter((e) => e.team === teamName);
  const avg = members.reduce((sum, e) => sum + e.riskScore, 0) / members.length;
  const critical = members.filter((e) => e.riskLevel === "critical").length;
  return { avg: Math.round(avg), critical, count: members.length };
}

function barColor(avg: number) {
  if (avg >= 75) return "#E15C5C";
  if (avg >= 55) return "#F0A93B";
  if (avg >= 35) return "#46C2D8";
  return "#8891A8";
}

export function RiskRadar() {
  const rows = teams.map((t) => ({ name: t.name, ...teamRisk(t.name) }));

  return (
    <section id="risk-radar" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-mono uppercase tracking-wide text-pulse-glow">Sample org</span>
        <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold text-bone sm:text-4xl">
          What the radar looks like on day one.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate">
          A demo org of 10 employees across 4 teams, scored the moment the graph finishes building.
        </p>

        <GlassPanel className="mt-10 p-6 sm:p-8">
          <div className="space-y-5">
            {rows.map((r) => (
              <div key={r.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-bone">{r.name}</span>
                  <span className="font-mono text-xs text-slate">
                    avg {r.avg} · {r.critical} critical of {r.count}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${r.avg}%`, backgroundColor: barColor(r.avg) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
