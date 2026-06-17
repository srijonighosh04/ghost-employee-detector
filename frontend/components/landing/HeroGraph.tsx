"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fireHaptic } from "@/lib/haptics";

type NodeKind = "risk-employee" | "project" | "employee" | "document" | "team";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  sub: string;
  kind: NodeKind;
}

const NODES: Node[] = [
  { id: "core", x: 300, y: 210, label: "P. Nair", sub: "Infra Lead", kind: "risk-employee" },
  { id: "deploy", x: 130, y: 95, label: "Deploy Pipeline", sub: "project", kind: "project" },
  { id: "failover", x: 470, y: 95, label: "Failover System", sub: "project", kind: "project" },
  { id: "runbook", x: 300, y: 40, label: "Release Runbook", sub: "14mo stale", kind: "document" },
  { id: "daniel", x: 105, y: 320, label: "D. Osei", sub: "SRE", kind: "employee" },
  { id: "ztrust", x: 495, y: 320, label: "Zero-Trust Rollout", sub: "project", kind: "project" },
  { id: "team", x: 300, y: 385, label: "Platform Infra", sub: "9 engineers", kind: "team" },
];

const EDGES: [string, string][] = [
  ["core", "deploy"],
  ["core", "failover"],
  ["core", "runbook"],
  ["core", "daniel"],
  ["core", "ztrust"],
  ["core", "team"],
];

const CRITICAL_TARGETS = new Set(["deploy", "failover", "ztrust"]);

function nodeRadius(kind: NodeKind) {
  if (kind === "risk-employee") return 30;
  if (kind === "team") return 26;
  return 22;
}

function nodeFill(kind: NodeKind, simulated: boolean) {
  if (kind === "risk-employee") return simulated ? "#E15C5C" : "#F0A93B";
  if (kind === "document") return "rgba(255,255,255,0.12)";
  return "rgba(255,255,255,0.08)";
}

function nodeStroke(kind: NodeKind, simulated: boolean, critical: boolean) {
  if (kind === "risk-employee") return simulated ? "#FF8A8A" : "#FFC876";
  if (simulated && critical) return "#FF8A8A";
  return "rgba(255,255,255,0.18)";
}

export function HeroGraph() {
  const [simulated, setSimulated] = useState(false);

  function toggle() {
    fireHaptic(simulated ? "select" : "warning");
    setSimulated((s) => !s);
  }

  return (
    <div className="relative">
      <svg viewBox="0 0 600 420" className="h-auto w-full max-w-xl select-none">
        {EDGES.map(([from, to]) => {
          const a = NODES.find((n) => n.id === from)!;
          const b = NODES.find((n) => n.id === to)!;
          const critical = CRITICAL_TARGETS.has(to);
          const broken = simulated && critical;
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={broken ? "#E15C5C" : "rgba(143,228,242,0.4)"}
              strokeWidth={broken ? 2 : 1.5}
              strokeDasharray={broken ? "5 6" : "0"}
              animate={broken ? { strokeDashoffset: [0, -22] } : { strokeDashoffset: 0 }}
              transition={broken ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            />
          );
        })}

        {NODES.map((n) => {
          const r = nodeRadius(n.kind);
          const critical = CRITICAL_TARGETS.has(n.id);
          return (
            <g
              key={n.id}
              role={n.id === "core" ? "button" : undefined}
              tabIndex={n.id === "core" ? 0 : undefined}
              aria-label={n.id === "core" ? "Simulate resignation of P. Nair" : undefined}
              onClick={n.id === "core" ? toggle : undefined}
              onKeyDown={
                n.id === "core"
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") toggle();
                    }
                  : undefined
              }
              style={{ cursor: n.id === "core" ? "pointer" : "default" }}
            >
              {n.kind === "risk-employee" && (
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={r + 10}
                  fill="none"
                  stroke={simulated ? "rgba(225,92,92,0.35)" : "rgba(240,169,59,0.35)"}
                  strokeWidth={2}
                  animate={{ r: [r + 6, r + 16], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill={nodeFill(n.kind, simulated && critical)}
                stroke={nodeStroke(n.kind, simulated, critical)}
                strokeWidth={1.5}
                animate={simulated && critical ? { y: [0, -3, 0] } : { y: 0 }}
                transition={{ duration: 0.4 }}
              />
              <text
                x={n.x}
                y={n.y + r + 16}
                textAnchor="middle"
                className="font-mono"
                fontSize="11"
                fill={simulated && critical ? "#FF8A8A" : "#EDEFF5"}
              >
                {n.label}
              </text>
              <text x={n.x} y={n.y + r + 29} textAnchor="middle" fontSize="9" fill="#8891A8">
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {simulated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full border border-alert/40 bg-alert/15 px-3 py-1 text-xs font-mono text-alert-glow"
          >
            3 critical dependencies exposed
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggle}
        className="press-feedback mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-center text-xs font-mono uppercase tracking-wide text-slate hover:text-bone hover:bg-white/[0.06]"
      >
        {simulated ? "Reset simulation" : "Click the highlighted node to simulate a resignation"}
      </button>
    </div>
  );
}
