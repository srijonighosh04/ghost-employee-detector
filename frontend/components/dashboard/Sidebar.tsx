"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Network,
  Gauge,
  GitBranch,
  MessageSquareText,
  FileStack,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fireHaptic } from "@/lib/haptics";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/knowledge-graph", label: "Knowledge Graph", icon: Network },
  { href: "/dashboard/risk-scores", label: "Risk Scores", icon: Gauge },
  { href: "/dashboard/simulator", label: "Resignation Simulator", icon: GitBranch },
  { href: "/dashboard/assistant", label: "AI Assistant", icon: MessageSquareText },
  { href: "/dashboard/handover", label: "Handover Generator", icon: FileStack },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col rounded-xl2 p-4 md:flex">
      <Link href="/" className="flex items-center gap-2 px-2 py-2 font-display text-base font-semibold text-bone">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal/20 text-signal-glow">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
            <circle cx="5" cy="18" r="2.4" stroke="currentColor" strokeWidth="2" />
            <circle cx="19" cy="18" r="2.4" stroke="currentColor" strokeWidth="2" />
            <path d="M10 8L6.5 16M14 8l3.5 8" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
        NexusIQ
      </Link>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => fireHaptic("select")}
              className={cn(
                "press-feedback flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-white/[0.08] text-bone shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                  : "text-slate hover:bg-white/[0.04] hover:text-bone"
              )}
            >
              <Icon size={17} className={active ? "text-signal-glow" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-3">
        <Link
          href="/dashboard/settings"
          className="press-feedback flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate hover:bg-white/[0.04] hover:text-bone"
        >
          <Settings size={17} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
