import { employees, projects, documents } from "@/lib/mock-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Local fallback (keyword-based) ---
function findEmployee(query: string) {
  const q = query.toLowerCase();
  return employees.find(
    (e) => q.includes(e.name.toLowerCase()) || q.includes(e.name.split(" ")[0].toLowerCase())
  );
}

function findProject(query: string) {
  const q = query.toLowerCase();
  return projects.find((p) => q.includes(p.name.toLowerCase()));
}

function localAnswer(query: string): { content: string; citedDocs?: string[] } {
  const q = query.toLowerCase();
  const employee = findEmployee(query);
  const project = findProject(query);

  if (project && (q.includes("responsible") || q.includes("owns") || q.includes("who"))) {
    const owner = employees.find((e) => e.id === project.ownerId);
    const docs = documents.filter((d) => d.authorId === project.ownerId).map((d) => d.title);
    return {
      content: owner
        ? `${owner.name} owns ${project.name} (${project.status.replace("-", " ")}). Their Knowledge Risk Score is ${owner.riskScore}, and documentation coverage for their work sits at ${owner.documentationCoverage}%.${
            owner.riskScore >= 75
              ? " That combination makes this project a single point of failure right now."
              : ""
          }`
        : `No owner is currently assigned to ${project.name} in the graph.`,
      citedDocs: docs,
    };
  }

  if (employee && (q.includes("depend") || q.includes("impact") || q.includes("leave") || q.includes("resign"))) {
    const owned = projects.filter((p) => p.ownerId === employee.id);
    const gap = Math.round(employee.riskScore * 0.6 + (100 - employee.documentationCoverage) * 0.4);
    const ramp = Math.max(2, Math.round(employee.tenureYears * 1.6));
    return {
      content:
        owned.length > 0
          ? `${owned.length} active project(s) depend on ${employee.name}: ${owned.map((p) => p.name).join(", ")}. Estimated ramp time for a successor is ${ramp} weeks, with a knowledge gap score of ${gap}.`
          : `No active projects currently depend solely on ${employee.name}.`,
      citedDocs: documents.filter((d) => d.authorId === employee.id).map((d) => d.title),
    };
  }

  if (employee) {
    return {
      content: `${employee.name} is a ${employee.role} on ${employee.team}, with a Knowledge Risk Score of ${employee.riskScore} (${employee.riskLevel}). Documentation coverage for their work is ${employee.documentationCoverage}%, and ${employee.dependents} people or processes currently depend on them.`,
    };
  }

  if (project) {
    const owner = employees.find((e) => e.id === project.ownerId);
    return {
      content: `${project.name} is currently ${project.status.replace("-", " ")}, owned by ${owner?.name ?? "no one"}, with ${project.contributors.length} contributor${project.contributors.length === 1 ? "" : "s"}.`,
    };
  }

  return {
    content:
      "I can answer questions about ownership, dependencies, documentation staleness, and what happens when someone leaves. Try asking: 'Who owns the Core Deployment Pipeline?' or 'What happens if Priya Nair leaves?'",
  };
}

// --- Main export: tries real backend first, falls back to local ---
export async function answerQuery(
  query: string
): Promise<{ content: string; citedDocs?: string[] }> {
  try {
    const res = await fetch(`${API_URL}/api/v1/assistant/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    const data = await res.json();
    return { content: data.content, citedDocs: data.citedDocs ?? data.cited_docs ?? [] };
  } catch {
    return localAnswer(query);
  }
}
