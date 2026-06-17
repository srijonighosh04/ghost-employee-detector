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

const nodeTypes = {
  employee: EmployeeNode,
  project: ProjectNode,
  document: DocumentNode,
  team: TeamNode,
};

export function KnowledgeGraphView() {
  const { nodes, edges } = useMemo(() => buildGraph(), []);
  const [selected, setSelected] = useState<Node | null>(null);

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    fireHaptic("select");
    setSelected(node);
  }, []);

  const isEmployee = selected?.type === "employee";
  const employeeData = isEmployee ? (selected!.data as Employee) : null;

  return (
    <div className="relative h-[calc(100vh-9.5rem)] overflow-hidden rounded-xl2">
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

      <GlassPanel className="absolute left-4 top-4 hidden gap-4 px-4 py-2.5 text-[11px] text-slate sm:flex">
        <Legend color="#46C2D8" label="Team" />
        <Legend color="#EDEFF5" label="Employee" />
        <Legend color="#8FE4F2" label="Project" />
        <Legend color="rgba(255,255,255,0.5)" label="Document" />
      </GlassPanel>

      {selected && (
        <GlassPanel variant="raised" className="absolute right-4 top-4 w-[min(20rem,calc(100vw-2rem))] p-5">
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
              </dl>
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
