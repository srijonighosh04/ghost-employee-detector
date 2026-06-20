"use client";

import { useMemo, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { buildGraph } from "@/lib/graph-layout";
import { EmployeeNode } from "./nodes/EmployeeNode";
import { ProjectNode } from "./nodes/ProjectNode";
import { DocumentNode } from "./nodes/DocumentNode";
import { TeamNode } from "./nodes/TeamNode";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Employee } from "@/types";
import Link from "next/link";
import { fireHaptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { employees, teams } from "@/lib/mock-data";

const nodeTypes = {
  employee: EmployeeNode,
  project: ProjectNode,
  document: DocumentNode,
  team: TeamNode,
};

type NodeFilter = "all" | "critical" | "high" | "medium" | "low";
type TypeFilter = "all" | "employee" | "project" | "document" | "team";

const RISK_FILTERS: { label: string; value: NodeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const TYPE_FILTERS: { label: string; value: TypeFilter }[] = [
  { label: "All types", value: "all" },
  { label: "Employees", value: "employee" },
  { label: "Projects", value: "project" },
  { label: "Documents", value: "document" },
  { label: "Teams", value: "team" },
];

export function KnowledgeGraphView() {
  const { nodes: allNodes, edges } = useMemo(() => buildGraph(), []);
  const [selected, setSelected] = useState<Node | null>(null);
  const [riskFilter, setRiskFilter] = useState<NodeFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const nodes = useMemo(() => {
    return allNodes.map((n) => {
      let hidden = false;
      if (typeFilter !== "all" && n.type !== typeFilter) hidden = true;
      if (riskFilter !== "all" && n.type === "employee") {
        const emp = employees.find((e) => e.id === n.id);
        if (emp && emp.riskLevel !== riskFilter) hidden = true;
      } else if (riskFilter !== "all" && n.type !== "employee") {
        // hide non-employee nodes when filtering by risk
        hidden = true;
      }
      return { ...n, hidden };
    });
  }, [allNodes, riskFilter, typeFilter]);

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    fireHaptic("select");
    setSelected(node);
  }, []);

  const isEmployee = selected?.type === "employee";
  const employeeData = isEmployee ? (selected!.data as Employee) : null;

  const visibleCount = nodes.filter((n) => !n.hidden).length;

  return (
    <div className="relative h-[calc(100vh-9.5rem)] overflow-hidden rounded-xl2">
      {/* Filter bar */}
      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
        <GlassPanel className="flex flex-wrap gap-1.5 px-3 py-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                fireHaptic("tap");
                setTypeFilter(f.value);
                setRiskFilter("all");
              }}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide transition-colors",
                typeFilter === f.value
                  ? "bg-pulse/20 text-pulse-glow"
                  : "text-slate hover:text-bone"
              )}
            >
              {f.label}
            </button>
          ))}
        </GlassPanel>

        {(typeFilter === "all" || typeFilter === "employee") && (
          <GlassPanel className="flex flex-wrap gap-1.5 px-3 py-2">
            <span className="text-[10px] font-mono uppercase tracking-wide text-slate mr-1 self-center">Risk:</span>
            {RISK_FILTERS.map((f) => {
              const colors: Record<NodeFilter, string> = {
                all: "text-slate hover:text-bone",
                critical: "text-alert-glow",
                high: "text-signal-glow",
                medium: "text-pulse-glow",
                low: "text-slate",
              };
              return (
                <button
                  key={f.value}
                  onClick={() => {
                    fireHaptic("tap");
                    setRiskFilter(f.value);
                  }}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide transition-colors",
                    riskFilter === f.value
                      ? `${colors[f.value]} bg-white/10`
                      : colors[f.value]
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </GlassPanel>
        )}

        <GlassPanel className="px-3 py-1.5 text-[10px] font-mono text-slate">
          {visibleCount} node{visibleCount !== 1 ? "s" : ""} visible
        </GlassPanel>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="rf-dark"
      >
        <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255,0.08)" gap={24} />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          maskColor="rgba(6,9,26,0.6)"
          nodeColor={() => "rgba(143,228,242,0.6)"}
        />
      </ReactFlow>

      {/* Legend — bottom left */}
      <GlassPanel className="absolute bottom-4 left-4 hidden gap-4 px-4 py-2.5 text-[11px] text-slate sm:flex">
        <Legend color="#46C2D8" label="Team" />
        <Legend color="#EDEFF5" label="Employee" />
        <Legend color="#8FE4F2" label="Project" />
        <Legend color="rgba(255,255,255,0.5)" label="Document" />
      </GlassPanel>

      {selected && (
        <GlassPanel variant="raised" className="absolute right-4 top-4 w-[min(20rem,calc(100vw-2rem))] p-5 animate-scale-in">
          <button
            onClick={() => setSelected(null)}
            className="press-feedback absolute right-3 top-3 text-slate hover:text-bone"
            aria-label="Close details"
          >
            ✕
          </button>

          {employeeData ? (
            <>
              <div className="flex items-center gap-3 pr-4">
                <Avatar initials={employeeData.initials} color={employeeData.avatarColor} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-bone">{employeeData.name}</p>
                  <p className="truncate text-xs text-slate">{employeeData.role}</p>
                </div>
              </div>
              <div className="mt-3">
                <RiskBadge level={employeeData.riskLevel} />
              </div>
              <dl className="mt-4 space-y-2 text-xs">
                <Row label="Knowledge Risk Score" value={String(employeeData.riskScore)} />
                <Row label="Documentation coverage" value={`${employeeData.documentationCoverage}%`} />
                <Row label="Dependents" value={String(employeeData.dependents)} />
                <Row label="Tenure" value={`${employeeData.tenureYears} yrs`} />
                <Row label="Last active" value={employeeData.lastActive} />
              </dl>

              {/* Doc coverage mini-bar */}
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-[10px] font-mono text-slate">
                  <span>Doc coverage</span>
                  <span>{employeeData.documentationCoverage}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${employeeData.documentationCoverage}%`,
                      backgroundColor:
                        employeeData.documentationCoverage >= 70
                          ? "#46C2D8"
                          : employeeData.documentationCoverage >= 45
                          ? "#F0A93B"
                          : "#E15C5C",
                    }}
                  />
                </div>
              </div>

              <Link href={`/dashboard/simulator?employee=${employeeData.id}`} className="mt-4 block">
                <Button variant="primary" size="sm" className="w-full">
                  Simulate resignation
                </Button>
              </Link>
            </>
          ) : (
            <div className="pr-4">
              <p className="text-sm font-medium text-bone">{String(selected.data.label ?? "Node")}</p>
              <p className="mt-1 text-xs text-slate">
                {String(selected.data.sublabel ?? selected.type)}
              </p>
            </div>
          )}
        </GlassPanel>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate">{label}</dt>
      <dd className="font-mono text-bone">{value}</dd>
    </div>
  );
}
