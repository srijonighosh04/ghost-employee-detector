import { employees, projects, documents, handoverDocs } from "@/lib/mock-data";
import { getSimulation } from "@/lib/simulate";
import { HandoverDoc } from "@/types";

export function getHandoverDoc(employeeId: string): HandoverDoc {
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

  const sim = getSimulation(employeeId);
  const owned = projects.filter((p) => p.ownerId === employeeId);
  const authoredDocs = documents.filter((d) => d.authorId === employeeId);

  return {
    employeeId,
    title: `Knowledge Transfer Brief — ${employee.name}, ${employee.role}`,
    generatedAt: "Generated just now",
    sections: [
      {
        heading: "Scope",
        body: `Covers the ${owned.length} project${owned.length === 1 ? "" : "s"} owned by ${employee.name} (${owned
          .map((p) => p.name)
          .join(", ") || "no active projects"}) and the working knowledge behind them.`,
      },
      {
        heading: "Existing documentation",
        body:
          authoredDocs.length > 0
            ? `${authoredDocs.length} document${authoredDocs.length === 1 ? "" : "s"} already exist: ${authoredDocs
                .map((d) => d.title)
                .join(", ")}. Treat anything marked stale as a starting point only.`
            : "No documentation is currently attributed to this person in the graph — this brief is the first written record.",
      },
      {
        heading: "Open knowledge gaps",
        body:
          sim.undocumentedAreas.length > 0
            ? sim.undocumentedAreas.join(" ")
            : "No major undocumented areas were flagged, though a short shadowing period is still recommended.",
      },
      {
        heading: "Suggested successor ramp plan",
        body: `Pair a successor on the next active cycle of each owned project, and budget roughly ${sim.estimatedRampWeeks} weeks before they can operate independently.`,
      },
    ],
  };
}
