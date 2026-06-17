import { DocumentRecord, Employee } from "@/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

const STALE_STYLE: Record<DocumentRecord["staleness"], string> = {
  fresh: "text-pulse-glow bg-pulse/15 border-pulse/30",
  aging: "text-signal-glow bg-signal/15 border-signal/30",
  stale: "text-alert-glow bg-alert/15 border-alert/30",
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

  return (
    <GlassPanel className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-medium text-bone">Documentation freshness</h3>
        <span className="text-xs text-slate font-mono">{documents.length} tracked docs</span>
      </div>
      <div className="flex flex-col gap-1">
        {documents.map((d) => (
          <div key={d.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-slate">
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
                STALE_STYLE[d.staleness]
              )}
            >
              {d.staleness}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
