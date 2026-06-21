# NexusIQ — Hackathon Demo Script

This document details a step-by-step flow to demonstrate **NexusIQ** during a live hackathon pitch, showing off the risk index, graph layout, simulation tools, and RAG AI assistant.

---

## 1. Setup & Preparation

1.  Start the Next.js frontend:
    ```bash
    cd frontend && npm run dev
    ```
2.  Start the FastAPI backend:
    ```bash
    cd backend && venv\Scripts\activate && uvicorn app.main:app --reload
    ```
3.  Open `http://localhost:3000` in your browser.

---

## 2. Walkthrough Flow

### Phase 1: The Landing Page (Hook)
*   **What to say:**
    *   "Every engineering organization suffers from a silent threat: tribal knowledge loss. When key engineers resign, critical systems halt, ramp-ups drag for months, and system documentation walks out the door. We built NexusIQ to solve this."
*   **What to show:**
    *   Show the main landing page. Scroll to the animated hero graph visual showing node connections that light up and fade as we select roles.

### Phase 2: Risk Dashboard Overview
*   **What to do:**
    *   Navigate to **Dashboard** (`http://localhost:3000/dashboard`).
*   **What to say:**
    *   "Here we have our live organizational health check. It aggregates standard metadata (PR cycles, auth logs) and scores every employee's risk factor. We see that out of 10 mapped employees, we have 2 critical risks: Priya Nair and Tobias Hahn."
    *   Point out the **Documentation Coverage** gauge: "Our overall team documentation coverage is a dangerously low 50%."

### Phase 3: Resignation Impact Simulator
*   **What to do:**
    *   Go to **Simulator** tab.
    *   Select **Priya Nair** from the dropdown and click **Simulate Resignation**.
*   **What to say:**
    *   "What happens if Priya Nair leaves? Let's run a live simulation. NexusIQ checks our relational bindings and traces the graph dependencies."
    *   "The system warns us that **Core Deployment Pipeline** and **Multi-Region Failover** will immediately become orphaned and blocked. It calculates that Priya has **no documented backup**, estimating a staggering **11-week successor ramp window**."

### Phase 4: AI Handover Generator
*   **What to do:**
    *   Go to **Handover** tab.
    *   Select **Priya Nair** and click **Generate Handover Brief**.
*   **What to say:**
    *   "Rather than letting this knowledge vanish, we use the NexusIQ AI Handover Engine. By querying Gemini over our documentation vectors, we draft a comprehensive Knowledge Transfer Brief in real-time."
    *   Show the generated output sections: **Scope**, **Existing documentation** (calling out the stale Deploy Pipeline Runbook), **Open knowledge gaps**, and the structured **Successor ramp plan**.
    *   Click **Download .txt** to show that the report is immediately ready for use.

### Phase 5: AI Knowledge Assistant
*   **What to do:**
    *   Navigate to **AI Assistant**.
    *   Type the query: `Who is responsible for Core Deployment Pipeline and are there runbooks?`
*   **What to say:**
    *   "Lastly, managers can chat with the NexusIQ RAG Assistant. Under the hood, it embeds the query, searches our vector database of runbooks, and returns grounded, cited feedback."
    *   Show the result showing Priya Nair as owner and citing the *Deploy Pipeline Runbook*. 
