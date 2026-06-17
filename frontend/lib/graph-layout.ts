import { Node, Edge, MarkerType } from "reactflow";
import { employees, projects, documents, teams } from "@/lib/mock-data";

const TEAM_X: Record<string, number> = {
  "Platform Infrastructure": 80,
  "Payments & Billing": 480,
  "Data & Analytics": 880,
  "Growth Engineering": 1280,
};

export function buildGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  teams.forEach((t) => {
    nodes.push({
      id: t.id,
      type: "team",
      position: { x: TEAM_X[t.name] ?? 0, y: 0 },
      data: { label: t.name, sublabel: `${t.memberIds.length} members` },
    });
  });

  const teamEmployeeIndex: Record<string, number> = {};
  employees.forEach((e) => {
    const idx = teamEmployeeIndex[e.team] ?? 0;
    teamEmployeeIndex[e.team] = idx + 1;
    const baseX = TEAM_X[e.team] ?? 0;
    nodes.push({
      id: e.id,
      type: "employee",
      position: { x: baseX + idx * 190, y: 170 },
      data: e,
    });
    const team = teams.find((t) => t.name === e.team);
    if (team) {
      edges.push({
        id: `${team.id}-${e.id}`,
        source: team.id,
        target: e.id,
        type: "straight",
        style: { stroke: "rgba(255,255,255,0.14)" },
      });
    }
  });

  const ownerProjectIndex: Record<string, number> = {};
  projects.forEach((p) => {
    const owner = employees.find((e) => e.id === p.ownerId);
    const baseX = owner ? (TEAM_X[owner.team] ?? 0) : 0;
    const idx = ownerProjectIndex[p.ownerId] ?? 0;
    ownerProjectIndex[p.ownerId] = idx + 1;
    nodes.push({
      id: p.id,
      type: "project",
      position: { x: baseX + idx * 210, y: 360 },
      data: p,
    });
    p.contributors.forEach((cid) => {
      const isOwner = cid === p.ownerId;
      edges.push({
        id: `${p.id}-${cid}`,
        source: cid,
        target: p.id,
        animated: isOwner,
        style: {
          stroke: isOwner ? "rgba(240,169,59,0.7)" : "rgba(143,228,242,0.4)",
          strokeWidth: isOwner ? 2 : 1.5,
        },
        markerEnd: isOwner
          ? { type: MarkerType.ArrowClosed, color: "rgba(240,169,59,0.7)", width: 14, height: 14 }
          : undefined,
      });
    });
  });

  const authorDocIndex: Record<string, number> = {};
  documents.forEach((d) => {
    const author = employees.find((e) => e.id === d.authorId);
    const baseX = author ? (TEAM_X[author.team] ?? 0) : 0;
    const idx = authorDocIndex[d.authorId] ?? 0;
    authorDocIndex[d.authorId] = idx + 1;
    nodes.push({
      id: d.id,
      type: "document",
      position: { x: baseX + idx * 210, y: 540 },
      data: d,
    });
    edges.push({
      id: `${d.authorId}-${d.id}`,
      source: d.authorId,
      target: d.id,
      style: { stroke: "rgba(255,255,255,0.16)", strokeDasharray: "3 4" },
    });
  });

  return { nodes, edges };
}
