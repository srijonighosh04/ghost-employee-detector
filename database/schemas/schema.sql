-- Sentinel Database Schema (PostgreSQL)
-- Schema DDL for Teams, Employees, Projects, Project Contributors, and Documents.

-- Drop tables if they exist to allow clean re-creation
DROP TABLE IF EXISTS project_contributors CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- 1. Teams Table
CREATE TABLE teams (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Employees Table
CREATE TABLE employees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    team VARCHAR(255) NOT NULL,
    team_id VARCHAR(50) REFERENCES teams(id) ON DELETE SET NULL,
    avatar_color VARCHAR(50),
    initials VARCHAR(10),
    risk_score INTEGER DEFAULT 0,
    risk_level VARCHAR(50) DEFAULT 'low',
    tenure_years DOUBLE PRECISION DEFAULT 0.0,
    documentation_coverage INTEGER DEFAULT 0,
    dependents INTEGER DEFAULT 0,
    last_active VARCHAR(100)
);

-- 3. Projects Table
CREATE TABLE projects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'on-track', 'at-risk', 'blocked'
    owner_id VARCHAR(50) REFERENCES employees(id) ON DELETE SET NULL,
    team VARCHAR(255) NOT NULL
);

-- 4. Project Contributors Junction Table (Many-to-Many)
CREATE TABLE project_contributors (
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, employee_id)
);

-- 5. Documents Table
CREATE TABLE documents (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'SOP', 'Runbook', 'Architecture', 'Onboarding', 'Postmortem'
    author_id VARCHAR(50) REFERENCES employees(id) ON DELETE SET NULL,
    last_updated VARCHAR(100),
    staleness VARCHAR(50) -- 'fresh', 'aging', 'stale'
);

-- Create indexes for performance on foreign keys and commonly searched fields
CREATE INDEX idx_employees_team_id ON employees(team_id);
CREATE INDEX idx_employees_risk_score ON employees(risk_score);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_documents_author_id ON documents(author_id);
