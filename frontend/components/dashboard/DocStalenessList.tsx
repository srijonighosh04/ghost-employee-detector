import { DocumentRecord, Employee } from "@/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";
import { FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";

const STALE_CONFIG: Record<
  DocumentRecord["staleness"],
  { pill: string; icon: string; label: string }
> = {
  fresh: {
    pill: "text-pulse-glow bg-pulse/15 border-pulse/30",
    icon: "bg-pulse/10 text-pulse",
    label: "Fresh",
  },
  aging: {
    pill: "text-signal-glow bg-signal/15 border-signal/30",
    icon: "bg-signal/10 text-signal",
    label: "Aging",
  },
  stale: {
    pill: "text-alert-glow bg-alert/15 border-alert/30",
    icon: "bg-alert/10 text-alert",
    label: "Stale",
  },
};

export function DocStalenessList({
  documents,
  employees,
}: {
  documents: DocumentRecord[];
  employees: Employee[];
}) {
  function authorName(id: string) {
    return employees.find((e) => e.id === id)?.name ?? "Unknown";
  }

  const staleCount = documents.filter((d) => d.staleness === "stale").length;
  const agingCount = documents.filter((d) => d.staleness === "aging").length;

  return (
    <GlassPanel className="p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-display text-base font-medium text-bone">Documentation freshness</h3>
          <p className="mt-0.5 text-xs font-mono text-slate">
            {documents.length} tracked ·{" "}
            <span className="text-alert-glow">{staleCount} stale</span>
            {agingCount > 0 && (
              <>
                {" "}·{" "}
                <span className="text-signal-glow">{agingCount} aging</span>
              </>
            )}
          </p>
        </div>
        {staleCount > 0 && (
          <span className="flex items-center gap-1 rounded-full border border-alert/30 bg-alert/10 px-2 py-1 text-[10px] font-mono text-alert-glow">
            <AlertTriangle size={10} />
            Action needed
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {documents
          .slice()
          .sort((a, b) => {
            const order = { stale: 0, aging: 1, fresh: 2 };
            return order[a.staleness] - order[b.staleness];
          })
          .map((d) => {
            const cfg = STALE_CONFIG[d.staleness];
            return (
              <div
                key={d.id}
                className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.04]"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                    cfg.icon
                  )}
                >
                  <FileText size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-bone">{d.title}</p>
                  <p className="truncate text-xs text-slate">
                    {d.type} · {authorName(d.authorId)} · updated {d.lastUpdated}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide",
                    cfg.pill
                  )}
                >
                  {cfg.label}
                </span>
              </div>
            );
          })}
      </div>
      <Link
        href="/dashboard/handover"
        className="mt-3 block text-center text-xs text-pulse-glow hover:underline"
      >
        Generate handover briefs →
      </Link>
    </GlassPanel>
  );
}
