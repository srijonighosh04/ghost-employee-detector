import { RiskLevel } from "@/types";
import { cn, riskColor } from "@/lib/utils";

const LABEL: Record<RiskLevel, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
  critical: "Critical risk",
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const c = riskColor(level);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium font-mono uppercase tracking-wide",
        c.bg,
        c.border,
        c.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {LABEL[level]}
    </span>
  );
}
