"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { fireHaptic } from "@/lib/haptics";
import {
  LayoutDashboard,
  Network,
  Gauge,
  GitBranch,
  MessageSquareText,
  FileStack,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/knowledge-graph", label: "Knowledge Graph", icon: Network },
  { href: "/dashboard/risk-scores", label: "Risk Scores", icon: Gauge },
  { href: "/dashboard/simulator", label: "Resignation Simulator", icon: GitBranch },
  { href: "/dashboard/assistant", label: "AI Assistant", icon: MessageSquareText },
  { href: "/dashboard/handover", label: "Handover Generator", icon: FileStack },
];

const TITLES: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Overview", sub: "Org-wide knowledge risk at a glance" },
  "/dashboard/knowledge-graph": { title: "Knowledge Graph", sub: "Employees, projects, documents, and teams" },
  "/dashboard/risk-scores": { title: "Risk Scores", sub: "Knowledge Risk Score per employee" },
  "/dashboard/simulator": { title: "Resignation Simulator", sub: "Model the impact before it happens" },
  "/dashboard/assistant": { title: "AI Assistant", sub: "Ask the graph a question" },
  "/dashboard/handover": { title: "Handover Generator", sub: "Draft SOPs and training guides automatically" },
};

export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const meta = TITLES[pathname] ?? { title: "Sentinel", sub: "" };

  return (
    <div className="sticky top-0 z-20 mb-6 pt-4">
      <div className="glass flex items-center justify-between rounded-xl2 px-4 py-3 sm:px-5">
        <button
          className="press-feedback flex h-9 w-9 items-center justify-center rounded-full text-bone md:hidden"
          onClick={() => {
            fireHaptic("tap");
            setOpen(true);
          }}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:block">
          <h1 className="font-display text-base font-medium text-bone">{meta.title}</h1>
          <p className="text-xs text-slate">{meta.sub}</p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 sm:flex">
            <Search size={14} className="text-slate" />
            <input
              placeholder="Ask the graph…"
              className="w-40 bg-transparent text-xs text-bone placeholder:text-slate focus:outline-none"
            />
          </div>
          <button className="press-feedback flex h-9 w-9 items-center justify-center rounded-full text-slate hover:text-bone">
            <Bell size={17} />
          </button>
          <Avatar initials="MR" color="#46C2D8" size={32} />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="glass-raised absolute left-3 right-3 top-3 rounded-xl2 p-4">
            <div className="flex items-center justify-between px-1 pb-3">
              <span className="font-display text-base font-semibold text-bone">Sentinel</span>
              <button onClick={() => setOpen(false)} className="press-feedback text-slate hover:text-bone" aria-label="Close navigation">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      fireHaptic("select");
                      setOpen(false);
                    }}
                    className={cn(
                      "press-feedback flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                      active ? "bg-white/[0.08] text-bone" : "text-slate hover:bg-white/[0.04] hover:text-bone"
                    )}
                  >
                    <Icon size={17} className={active ? "text-signal-glow" : ""} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
