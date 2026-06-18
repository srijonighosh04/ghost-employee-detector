# Sentinel — API Endpoint Contracts

This document contains JSON request/response structures and routing paths for the Sentinel REST API v1.

---

## 1. Employees Endpoints

### Get All Employees
*   **Path:** `GET /api/v1/employees/`
*   **Response Body (`200 OK`):**
    ```json
    [
      {
        "id": "e1",
        "name": "Priya Nair",
        "role": "Principal Infrastructure Engineer",
        "team": "Platform Infrastructure",
        "risk_score": 92,
        "risk_level": "critical",
        "tenure_years": 7.0,
        "documentation_coverage": 18,
        "dependents": 11,
        "last_active": "2 hours ago"
      }
    ]
    ```

### Get Single Employee
*   **Path:** `GET /api/v1/employees/{id}`
*   **Response Body (`200 OK`):**
    ```json
    {
      "id": "e1",
      "name": "Priya Nair",
      "role": "Principal Infrastructure Engineer",
      "team": "Platform Infrastructure",
      "risk_score": 92,
      "risk_level": "critical",
      "tenure_years": 7.0,
      "documentation_coverage": 18,
      "dependents": 11,
      "last_active": "2 hours ago",
      "owned_projects_names": "Core Deployment Pipeline, Multi-Region Failover",
      "authored_docs_names": "Deploy Pipeline Runbook, Failover Drill Postmortem"
    }
    ```

---

## 2. Projects Endpoints

### Get All Projects
*   **Path:** `GET /api/v1/projects/`
*   **Response Body (`200 OK`):**
    ```json
    [
      {
        "id": "p1",
        "name": "Core Deployment Pipeline",
        "status": "at-risk",
        "owner_id": "e1",
        "team": "Platform Infrastructure"
      }
    ]
    ```

---

## 3. Simulator Endpoints

### Run Resignation Simulation
*   **Path:** `GET /api/v1/simulator/{employee_id}`
*   **Response Body (`200 OK`):**
    ```json
    {
      "employee_id": "e1",
      "impacted_projects": [
        {
          "project_id": "p1",
          "name": "Core Deployment Pipeline",
          "severity": "critical",
          "reason": "Priya Nair is the listed owner with no documented backup."
        }
      ],
      "impacted_teammates": 2,
      "knowledge_gap_score": 88,
      "estimated_ramp_weeks": 11,
      "undocumented_areas": [
        "Day-to-day decisions on Core Deployment Pipeline aren't written down anywhere"
      ]
    }
    ```

---

## 4. Handover Endpoints

### Generate / Fetch Handover Brief
*   **Path:** `POST /api/v1/handover/{employee_id}` or `GET /api/v1/handover/{employee_id}`
*   **Response Body (`200 OK`):**
    ```json
    {
      "employee_id": "e1",
      "title": "Knowledge Transfer Brief — Priya Nair, Principal Infrastructure Engineer",
      "generated_at": "June 18, 2026 at 08:30 UTC",
      "sections": [
        {
          "heading": "Scope",
          "body": "This brief covers the active responsibilities of Priya Nair..."
        },
        {
          "heading": "Existing documentation",
          "body": "An audit of files indicates that Priya Nair has authored..."
        },
        {
          "heading": "Open knowledge gaps",
          "body": "The simulation process identified the following undocumented areas..."
        },
        {
          "heading": "Suggested successor ramp plan",
          "body": "To mitigate transition friction, we estimate a successor ramp window..."
        }
      ]
    }
    ```

---

## 5. Assistant Endpoints

### Ask RAG Assistant
*   **Path:** `POST /api/v1/assistant/chat` (also accepts `/api/v1/assistant/`)
*   **Request Body (`application/json`):**
    ```json
    {
      "message": "Who owns the Core Deployment Pipeline and are there any documents?"
    }
    ```
*   **Response Body (`200 OK`):**
    ```json
    {
      "content": "Priya Nair owns the Core Deployment Pipeline. It is currently marked at-risk. Their individual Knowledge Risk Score is 92, which indicates a single point of failure.",
      "cited_docs": [
        "Deploy Pipeline Runbook"
      ]
    }
    ```
