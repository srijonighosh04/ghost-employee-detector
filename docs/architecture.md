# NexusIQ — System Architecture

NexusIQ is an AI-powered organizational knowledge continuity platform. It builds a live Organizational Knowledge Graph, scores employee knowledge risk, simulates the impact of resignations, and generates AI handover documentation.

---

## Architecture Overview

NexusIQ is structured as a decoupled multi-tier web application consisting of a web frontend, REST backend api, relational and graph database nodes, and a RAG-backed AI reasoning pipeline.

```mermaid
graph TD
    subgraph Client Layer (Vercel)
        FE[Next.js 14 Frontend UI]
    end

    subgraph Service Layer (Render)
        BE[FastAPI REST API Server]
        AI[AI / RAG Engine]
    end

    subgraph Storage Layer
        DB[(PostgreSQL / SQLite)]
        KG[(Neo4j Graph Database)]
    end

    FE -->|HTTP REST API calls| BE
    BE -->|SQLAlchemy ORM| DB
    BE -->|Neo4j Python Driver| KG
    BE -->|Invokes Chains| AI
    AI -->|Similarity Search| RAG[InMemory Vector Store / ChromaDB]
    AI -->|Generates Content| Gemini[Gemini API]
```

---

## Component Breakdowns

### 1. Frontend UI Layer (`/frontend`)
*   **Core Framework:** Next.js 14 (App Router) with TypeScript.
*   **Styling & Design System:** Tailwind CSS with a dark-mode, glassmorphic UI. Micro-animations and press scale-downs provide tactile feedback.
*   **Knowledge Graph Visualizer:** Powered by `React Flow` to render visual networks representing nodes (Employees, Teams, Projects, Documents) and edges (Relationships).
*   **Seams:** The frontend is engineered with modular wrappers (`lib/simulate.ts`, `lib/handover.ts`, `lib/assistant.ts`) allowing developers to seamlessly toggle between mock JSON storage and backend HTTP integrations.

### 2. Backend API Layer (`/backend`)
*   **Core Framework:** FastAPI (Python 3.10+).
*   **Router Controllers:** Contains modular endpoint definitions in `app/api/v1` exposing REST services for employee dashboards, resignation simulation modeling, handover reports, and RAG chat.
*   **Service Layer:** Handles risk scoring algorithms, resignation simulation impact analysis (calculating downstream dependencies and identifying Single Points of Failure), and syncing relational tables to the graph.

### 3. Storage Layer (`/database` & `/knowledge-graph`)
*   **Relational Database:** SQLite (for local zero-setup dev runs) or PostgreSQL (for production). Maps schema relationships via SQLAlchemy ORM models:
    *   `Employee` (owned projects, contributing projects, authored documents, risk details).
    *   `Team` (unique teams and list of member employees).
    *   `Project` (owner, contributors, project health/status).
    *   `DocumentRecord` (title, author, type, staleness metadata).
*   **Graph Database:** Neo4j database instance. Stores semantic mappings utilizing labels (`Employee`, `Team`, `Project`, `Document`) and relationship edges (`MEMBER_OF`, `OWNS`, `CONTRIBUTES_TO`, `AUTHORED`). Includes a synchronization script (`sync_graph.py`) to replicate relational schemas into graph nodes.

### 4. AI & RAG Engine Layer (`/ai-engine`)
*   **RAG Ingestion Pipeline:** Processes markdown documents in `knowledge_docs/` into smaller chunks using LangChain's recursive text splitters, compiles embeddings, and registers them in an InMemory/ChromaDB vector store.
*   **Embeddings Factory:** Integrates Google's `models/embedding-001` with an offline deterministic hash-based `MockEmbeddings` fallback.
*   **Chains & Prompt Templates:**
    *   *AI Assistant:* Formulates dynamic answers using database entity dumps combined with retrieved RAG context.
    *   *Handover Generator:* Assembles the resigning user's role profile, project parameters, and simulation results into a structured transition brief.
