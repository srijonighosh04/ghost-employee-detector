-- NexusIQ Mock Database Seed Data (PostgreSQL)
-- Insert records matching the application's mock dataset structure.

-- Clear existing data
DELETE FROM project_contributors;
DELETE FROM documents;
DELETE FROM projects;
DELETE FROM employees;
DELETE FROM teams;

-- 1. Populate Teams
INSERT INTO teams (id, name) VALUES
('t-platform', 'Platform Infrastructure'),
('t-payments', 'Payments & Billing'),
('t-data', 'Data & Analytics'),
('t-growth', 'Growth Engineering');

-- 2. Populate Employees
INSERT INTO employees (id, name, role, team, team_id, avatar_color, initials, risk_score, risk_level, tenure_years, documentation_coverage, dependents, last_active) VALUES
('e1', 'Priya Nair', 'Principal Infrastructure Engineer', 'Platform Infrastructure', 't-platform', '#F0A93B', 'PN', 92, 'critical', 7.0, 18, 11, '2 hours ago'),
('e2', 'Marcus Webb', 'Staff Engineer, Billing Core', 'Payments & Billing', 't-payments', '#E15C5C', 'MW', 81, 'high', 5.0, 34, 7, '1 day ago'),
('e3', 'Sofia Reyes', 'Lead Data Engineer', 'Data & Analytics', 't-data', '#46C2D8', 'SR', 58, 'medium', 3.0, 61, 4, '3 hours ago'),
('e4', 'Daniel Osei', 'Senior SRE', 'Platform Infrastructure', 't-platform', '#8FE4F2', 'DO', 47, 'medium', 2.0, 55, 3, '5 hours ago'),
('e5', 'Lena Kowalski', 'Growth Tech Lead', 'Growth Engineering', 't-growth', '#F0A93B', 'LK', 39, 'low', 2.0, 72, 2, '30 minutes ago'),
('e6', 'Tobias Hahn', 'Payments Architect', 'Payments & Billing', 't-payments', '#FF8A8A', 'TH', 87, 'critical', 9.0, 22, 9, 'Yesterday'),
('e7', 'Imani Carter', 'Platform Security Engineer', 'Platform Infrastructure', 't-platform', '#46C2D8', 'IC', 64, 'high', 4.0, 41, 5, '4 hours ago'),
('e8', 'Yuki Tanaka', 'Analytics Engineer', 'Data & Analytics', 't-data', '#8FE4F2', 'YT', 28, 'low', 1.0, 80, 1, '1 hour ago'),
('e9', 'Omar Farouk', 'Frontend Engineer', 'Growth Engineering', 't-growth', '#F0A93B', 'OF', 22, 'low', 1.0, 86, 1, '20 minutes ago'),
('e10', 'Hannah Brooks', 'Growth PM', 'Growth Engineering', 't-growth', '#E15C5C', 'HB', 35, 'low', 2.0, 75, 2, '2 hours ago');

-- 3. Populate Projects
INSERT INTO projects (id, name, status, owner_id, team) VALUES
('p1', 'Core Deployment Pipeline', 'at-risk', 'e1', 'Platform Infrastructure'),
('p2', 'Subscription Billing Engine', 'at-risk', 'e2', 'Payments & Billing'),
('p3', 'Customer Analytics Warehouse', 'on-track', 'e3', 'Data & Analytics'),
('p4', 'Multi-Region Failover', 'blocked', 'e1', 'Platform Infrastructure'),
('p5', 'Observability Stack Migration', 'on-track', 'e4', 'Platform Infrastructure'),
('p6', 'Onboarding Funnel Revamp', 'on-track', 'e5', 'Growth Engineering'),
('p7', 'Legacy Invoicing Bridge', 'blocked', 'e6', 'Payments & Billing'),
('p8', 'Zero-Trust Access Rollout', 'at-risk', 'e7', 'Platform Infrastructure');

-- 4. Populate Project Contributors Junction Table (Many-to-Many)
INSERT INTO project_contributors (project_id, employee_id) VALUES
('p1', 'e1'), ('p1', 'e4'),
('p2', 'e2'), ('p2', 'e6'),
('p3', 'e3'), ('p3', 'e8'),
('p4', 'e1'), ('p4', 'e7'),
('p5', 'e4'),
('p6', 'e5'), ('p6', 'e9'), ('p6', 'e10'),
('p7', 'e6'),
('p8', 'e7'), ('p8', 'e1');

-- 5. Populate Documents
INSERT INTO documents (id, title, type, author_id, last_updated, staleness) VALUES
('d1', 'Deploy Pipeline Runbook', 'Runbook', 'e1', '14 months ago', 'stale'),
('d2', 'Billing Engine Architecture', 'Architecture', 'e2', '9 months ago', 'aging'),
('d3', 'Warehouse ETL SOP', 'SOP', 'e3', '1 month ago', 'fresh'),
('d4', 'Failover Drill Postmortem', 'Postmortem', 'e1', '11 months ago', 'stale'),
('d5', 'Observability Onboarding Guide', 'Onboarding', 'e4', '2 months ago', 'fresh'),
('d6', 'Growth Funnel Experiment Log', 'SOP', 'e5', '3 weeks ago', 'fresh'),
('d7', 'Legacy Invoicing Bridge Notes', 'Architecture', 'e6', '21 months ago', 'stale'),
('d8', 'Zero-Trust Rollout SOP', 'SOP', 'e7', '6 months ago', 'aging');
