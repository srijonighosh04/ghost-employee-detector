"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const meta = TITLES[pathname] ?? { title: "NexusIQ", sub: "" };

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchVal.trim();
    if (!q) return;
    fireHaptic("tap");
    // Route to assistant page with query pre-filled via URL param
    router.push(`/dashboard/assistant?q=${encodeURIComponent(q)}`);
    setSearchVal("");
    searchRef.current?.blur();
  }

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
          <form
            onSubmit={handleSearchSubmit}
            className={cn(
              "hidden items-center gap-2 rounded-full border bg-white/[0.03] px-3 py-1.5 sm:flex transition-all duration-200",
              searchFocused
                ? "border-signal/40 shadow-glow-amber w-56"
                : "border-white/10 w-44"
            )}
          >
            <Search size={14} className="shrink-0 text-slate" />
            <input
              ref={searchRef}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={searchFocused ? "Press Enter to ask the graph…" : "Ask the graph…"}
              className="w-full bg-transparent text-xs text-bone placeholder:text-slate focus:outline-none"
            />
          </form>
          <button className="press-feedback flex h-9 w-9 items-center justify-center rounded-full text-slate hover:text-bone relative">
            <Bell size={17} />
            {/* Notification dot */}
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-alert animate-pulse-soft" />
          </button>
          <Avatar initials="MR" color="#46C2D8" size={32} />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="glass-raised absolute left-3 right-3 top-3 rounded-xl2 p-4">
            <div className="flex items-center justify-between px-1 pb-3">
              <span className="font-display text-base font-semibold text-bone">NexusIQ</span>
              <button
                onClick={() => setOpen(false)}
                className="press-feedback text-slate hover:text-bone"
                aria-label="Close navigation"
              >
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
