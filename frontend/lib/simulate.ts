import { employees, projects, simulations } from "@/lib/mock-data";
import { SimulationResult, RiskLevel } from "@/types";

function severityFor(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}

export function getSimulation(employeeId: string): SimulationResult {
  if (simulations[employeeId]) return simulations[employeeId];

  const employee = employees.find((e) => e.id === employeeId);
  if (!employee) {
    return {
      employeeId,
      impactedProjects: [],
      impactedTeammates: 0,
      knowledgeGapScore: 0,
      estimatedRampWeeks: 0,
      undocumentedAreas: [],
    };
  }

  const owned = projects.filter((p) => p.ownerId === employeeId);
  const impactedProjects = owned.map((p) => ({
    projectId: p.id,
    name: p.name,
    severity: severityFor(employee.riskScore),
    reason: `${employee.name} is the listed owner with no documented backup.`,
  }));

  const impactedTeammates = Math.max(
    1,
    owned.reduce((sum, p) => sum + Math.max(p.contributors.length - 1, 0), 0)
  );

  const knowledgeGapScore = Math.round(
    employee.riskScore * 0.6 + (100 - employee.documentationCoverage) * 0.4
  );

  const estimatedRampWeeks = Math.max(2, Math.round(employee.tenureYears * 1.6));

  return {
    employeeId,
    impactedProjects,
    impactedTeammates,
    knowledgeGapScore,
    estimatedRampWeeks,
    undocumentedAreas:
      employee.documentationCoverage < 60
        ? [`Day-to-day decisions on ${owned[0]?.name ?? "their primary project"} aren't written down anywhere`]
        : [],
  };
}
