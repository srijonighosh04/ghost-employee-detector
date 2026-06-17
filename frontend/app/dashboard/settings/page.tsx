import { GlassPanel } from "@/components/ui/GlassPanel";
import { Settings } from "lucide-react";

const ROWS = [
  { label: "Organization", value: "Demo Workspace" },
  { label: "Data sources", value: "Sample dataset (10 employees, 8 projects)" },
  { label: "Graph engine", value: "Neo4j — not yet connected" },
  { label: "AI provider", value: "Gemini API — not yet connected" },
];

export default function SettingsPage() {
  return (
    <GlassPanel className="mx-auto max-w-2xl p-6 sm:p-8">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-slate">
        <Settings size={18} />
      </span>
      <h2 className="mt-4 font-display text-lg font-medium text-bone">Workspace settings</h2>
      <p className="mt-1 text-sm text-slate">
        This build runs entirely on sample data. Connect a backend to replace it with your real org graph.
      </p>
      <dl className="mt-6 divide-y divide-white/10">
        {ROWS.map((r) => (
          <div key={r.label} className="flex items-center justify-between py-3 text-sm">
            <dt className="text-slate">{r.label}</dt>
            <dd className="text-bone">{r.value}</dd>
          </div>
        ))}
      </dl>
    </GlassPanel>
  );
}
