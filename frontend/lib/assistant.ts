import { employees, projects, documents } from "@/lib/mock-data";
import { getSimulation } from "@/lib/simulate";

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

export function answerQuery(query: string): { content: string; citedDocs?: string[] } {
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
    const sim = getSimulation(employee.id);
    const names = sim.impactedProjects.map((p) => p.name).join(", ");
    return {
      content:
        sim.impactedProjects.length > 0
          ? `${sim.impactedProjects.length} active project${sim.impactedProjects.length > 1 ? "s" : ""} depend on ${employee.name}: ${names}. Estimated ramp time for a successor is ${sim.estimatedRampWeeks} weeks, with a knowledge gap score of ${sim.knowledgeGapScore}.`
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
      "I can answer questions grounded in the knowledge graph — try asking about a specific person (\"What does Priya Nair own?\"), a project (\"Who is responsible for the Subscription Billing Engine?\"), or an impact scenario (\"What happens if Tobias Hahn leaves?\").",
  };
}
