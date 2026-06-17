"use client";

import { RiskLevel } from "@/types";

const STROKE: Record<RiskLevel, string> = {
  low: "#8891A8",
  medium: "#46C2D8",
  high: "#F0A93B",
  critical: "#E15C5C",
};

export function RiskGauge({
  score,
  level,
  size = 64,
  label,
}: {
  score: number;
  level: RiskLevel;
  size?: number;
  label?: string;
}) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = STROKE[level];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.2,0.8,0.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-mono text-sm font-medium text-bone">{score}</span>
        {label && <span className="text-[9px] uppercase tracking-wide text-slate">{label}</span>}
      </div>
    </div>
  );
}
