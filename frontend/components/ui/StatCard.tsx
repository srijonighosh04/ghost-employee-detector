import { ReactNode } from "react";
import { GlassPanel } from "./GlassPanel";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  trend,
  trendDirection = "neutral",
  icon,
  accent = "amber",
}: {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon?: ReactNode;
  accent?: "amber" | "cyan" | "coral";
}) {
  return (
    <GlassPanel className="p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-slate">{label}</span>
        {icon && (
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              accent === "amber" && "bg-signal/15 text-signal-glow",
              accent === "cyan" && "bg-pulse/15 text-pulse-glow",
              accent === "coral" && "bg-alert/15 text-alert-glow"
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold text-bone">{value}</div>
      {trend && (
        <div
          className={cn(
            "mt-2 text-xs font-mono",
            trendDirection === "up" && "text-alert-glow",
            trendDirection === "down" && "text-pulse-glow",
            trendDirection === "neutral" && "text-slate"
          )}
        >
          {trend}
        </div>
      )}
    </GlassPanel>
  );
}
