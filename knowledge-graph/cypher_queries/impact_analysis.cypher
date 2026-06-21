// NexusIQ Cypher Query Catalog

// 1. Resignation Impact Path
// Traces the immediate and downstream impact when a specific employee leaves.
// Finds owned projects, their current contributors, and any documentation they authored.
MATCH (e:Employee {id: $employee_id})
OPTIONAL MATCH (e)-[:OWNS]->(p:Project)
OPTIONAL MATCH (contrib:Employee)-[:CONTRIBUTES_TO]->(p) WHERE contrib.id <> $employee_id
OPTIONAL MATCH (e)-[:AUTHORED]->(d:Document)
RETURN 
    e.name AS employeeName,
    collect(DISTINCT p.name) AS ownedProjects,
    collect(DISTINCT contrib.name) AS impactedTeammates,
    collect(DISTINCT d.title) AS authoredDocuments;


// 2. Downstream Risk Propagation (Indirect Impact)
// Traces secondary dependencies: colleagues who share projects with the departing employee,
// and what other projects those colleagues contribute to (which will experience increased load).
MATCH (e:Employee {id: $employee_id})-[:OWNS|CONTRIBUTES_TO]->(p:Project)<-[:CONTRIBUTES_TO|OWNS]-(c:Employee)
WHERE c.id <> $employee_id
OPTIONAL MATCH (c)-[:OWNS|CONTRIBUTES_TO]->(otherProj:Project)
WHERE otherProj.id <> p.id
RETURN 
    c.name AS colleagueName, 
    c.role AS colleagueRole,
    p.name AS sharedProject,
    collect(DISTINCT otherProj.name) AS otherProjectsAtRisk;


// 3. Single Points of Failure (SPOF)
// Identifies projects that have an owner but no other contributors, 
// leaving the project with zero active knowledge backups.
MATCH (p:Project)<-[:OWNS]-(owner:Employee)
WHERE NOT (p)<-[:CONTRIBUTES_TO]-(:Employee)
RETURN 
    p.id AS projectId,
    p.name AS projectName,
    owner.name AS soleOwner,
    owner.riskScore AS riskScore,
    owner.riskLevel AS riskLevel;


// 4. Orphaned Projects
// Identifies projects that currently have no listed owner.
MATCH (p:Project)
WHERE NOT (p)<-[:OWNS]-(:Employee)
RETURN 
    p.id AS projectId,
    p.name AS projectName,
    p.status AS status;


// 5. Team Risk Aggregation
// Aggregates the average risk score and total knowledge assets per team.
MATCH (t:Team)<-[:MEMBER_OF]-(e:Employee)
OPTIONAL MATCH (e)-[:OWNS]->(p:Project)
OPTIONAL MATCH (e)-[:AUTHORED]->(d:Document)
RETURN 
    t.name AS teamName,
    count(DISTINCT e) AS memberCount,
    avg(e.riskScore) AS averageRiskScore,
    count(DISTINCT p) AS totalProjectsOwned,
    count(DISTINCT d) AS totalDocsAuthored
ORDER BY averageRiskScore DESC;
