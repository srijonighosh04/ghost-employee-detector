import { employees, projects, documents, handoverDocs } from "@/lib/mock-data";
import { HandoverDoc } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function localHandover(employeeId: string): HandoverDoc {
  if (handoverDocs[employeeId]) return handoverDocs[employeeId];

  const employee = employees.find((e) => e.id === employeeId);
  if (!employee) {
    return {
      employeeId,
      title: "Knowledge Transfer Brief",
      generatedAt: "Generated just now",
      sections: [],
    };
  }

  const owned = projects.filter((p) => p.ownerId === employeeId);
  const authoredDocs = documents.filter((d) => d.authorId === employeeId);
  const ramp = Math.max(2, Math.round(employee.tenureYears * 1.6));
  const gap = Math.round(employee.riskScore * 0.6 + (100 - employee.documentationCoverage) * 0.4);

  return {
    employeeId,
    title: `Knowledge Transfer Brief — ${employee.name}, ${employee.role}`,
    generatedAt: "Generated just now",
    sections: [
      {
        heading: "Scope",
        body: `Covers the ${owned.length} project${owned.length === 1 ? "" : "s"} owned by ${employee.name} (${
          owned.map((p) => p.name).join(", ") || "no active projects"
        }) and the working knowledge behind them. ${employee.name} has ${employee.tenureYears} years of tenure on the ${employee.team} team.`,
      },
      {
        heading: "Existing documentation",
        body:
          authoredDocs.length > 0
            ? `${authoredDocs.length} document${authoredDocs.length === 1 ? "" : "s"} already exist: ${authoredDocs.map((d) => d.title).join(", ")}. Treat anything marked stale as a starting point only.`
            : "No documentation is currently attributed to this person in the graph — this brief is the first written record.",
      },
      {
        heading: "Open knowledge gaps",
        body:
          employee.documentationCoverage < 60
            ? `Documentation coverage is critically low at ${employee.documentationCoverage}%. Knowledge gap score: ${gap}/100. Day-to-day operational context on ${owned[0]?.name ?? "key projects"} is largely undocumented.`
            : `No major undocumented areas were flagged. Knowledge gap score: ${gap}/100. A short shadowing period is still recommended.`,
      },
      {
        heading: "Suggested successor ramp plan",
        body: `Pair a successor on the next active cycle of each owned project, and budget roughly ${ramp} weeks before they can operate independently. Schedule weekly knowledge-transfer sessions for the first month.`,
      },
    ],
  };
}

function mapApiHandover(data: any, employeeId: string): HandoverDoc {
  return {
    employeeId,
    title: data.title,
    generatedAt: data.generatedAt ?? data.generated_at ?? "Generated just now",
    sections: (data.sections ?? []).map((s: any) => ({
      heading: s.heading,
      body: s.body,
    })),
  };
}

export async function getHandoverDoc(employeeId: string): Promise<HandoverDoc> {
  try {
    const res = await fetch(`${API_URL}/api/v1/handover/${employeeId}`, {
      method: "POST",
      signal: AbortSignal.timeout(30000), // Gemini can be slow
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    const data = await res.json();
    return mapApiHandover(data, employeeId);
  } catch {
    return localHandover(employeeId);
  }
}
