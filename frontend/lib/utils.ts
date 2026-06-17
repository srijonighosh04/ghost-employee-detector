import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function riskColor(level: "low" | "medium" | "high" | "critical") {
  switch (level) {
    case "critical":
      return { text: "text-alert-glow", bg: "bg-alert/15", border: "border-alert/40", dot: "bg-alert" };
    case "high":
      return { text: "text-signal-glow", bg: "bg-signal/15", border: "border-signal/40", dot: "bg-signal" };
    case "medium":
      return { text: "text-pulse-glow", bg: "bg-pulse/15", border: "border-pulse/40", dot: "bg-pulse" };
    case "low":
    default:
      return { text: "text-bone", bg: "bg-white/5", border: "border-white/15", dot: "bg-slate" };
  }
}
