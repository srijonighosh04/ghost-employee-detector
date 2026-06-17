export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Employee {
  id: string;
  name: string;
  role: string;
  team: string;
  avatarColor: string;
  initials: string;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  tenureYears: number;
  documentationCoverage: number; // 0-100, percentage of their knowledge that's written down
  ownedProjects: string[]; // project ids
  dependents: number; // how many people/processes depend on them
  lastActive: string;
}

export interface Project {
  id: string;
  name: string;
  status: "on-track" | "at-risk" | "blocked";
  ownerId: string;
  team: string;
  contributors: string[]; // employee ids
}

export interface DocumentRecord {
  id: string;
  title: string;
  type: "SOP" | "Runbook" | "Architecture" | "Onboarding" | "Postmortem";
  authorId: string;
  lastUpdated: string;
  staleness: "fresh" | "aging" | "stale";
}

export interface Team {
  id: string;
  name: string;
  memberIds: string[];
}

export type GraphNodeKind = "employee" | "project" | "document" | "team";

export interface GraphNodeData {
  kind: GraphNodeKind;
  label: string;
  sublabel?: string;
  riskLevel?: RiskLevel;
  refId: string;
}

export interface ImpactedProject {
  projectId: string;
  name: string;
  severity: RiskLevel;
  reason: string;
}

export interface SimulationResult {
  employeeId: string;
  impactedProjects: ImpactedProject[];
  impactedTeammates: number;
  knowledgeGapScore: number; // 0-100
  estimatedRampWeeks: number;
  undocumentedAreas: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citedDocs?: string[];
}

export interface HandoverSection {
  heading: string;
  body: string;
}

export interface HandoverDoc {
  employeeId: string;
  title: string;
  generatedAt: string;
  sections: HandoverSection[];
}
