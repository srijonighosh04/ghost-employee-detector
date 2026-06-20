# NexusIQ — Frontend

The complete, working frontend for **NexusIQ** (the Ghost Employee Detector / organizational
knowledge continuity platform). Built with Next.js 14 (App Router), TypeScript, Tailwind CSS,
React Flow, and Framer Motion. Runs entirely on in-memory sample data — no backend required to
explore the UI.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

```bash
npm run build   # production build
npm run start   # serve the production build
```

## What's here

- `/` — marketing landing page with an interactive "resignation simulation" graph in the hero.
- `/dashboard` — overview with org-wide stats, top-risk employees, and documentation freshness.
- `/dashboard/knowledge-graph` — interactive React Flow graph of employees, projects, documents, and teams. Click any node for details.
- `/dashboard/risk-scores` — sortable table of every employee's Knowledge Risk Score.
- `/dashboard/simulator` — Resignation Impact Simulator: pick anyone, see what breaks.
- `/dashboard/assistant` — AI Knowledge Assistant chat (rule-based demo answers grounded in the sample graph; swap in the real Gemini + LangChain backend later).
- `/dashboard/handover` — AI Handover Generator that drafts and downloads a knowledge transfer brief.
- `/dashboard/settings` — workspace status placeholder.

## Structure

```
app/                  Next.js App Router routes
components/
  ui/                 Design-system primitives (GlassPanel, Button, RiskBadge, RiskGauge, Avatar, StatCard)
  landing/             Marketing page sections
  dashboard/           Dashboard shell + feature panels
  graph/               React Flow knowledge graph view + custom node renderers
lib/
  mock-data.ts         Sample employees, projects, documents, teams
  simulate.ts          Resignation impact calculation (sample logic, ready to swap for a real API call)
  handover.ts          Handover doc generation (sample logic, ready to swap for a real API call)
  assistant.ts          Keyword-matched demo answers for the AI assistant
  haptics.ts           Vibration API wrapper for tactile feedback on supported devices
  utils.ts             Shared class-name + risk-color helpers
types/                 Shared TypeScript types for the domain model
```

## Connecting a real backend

Every place that currently reads from `lib/mock-data.ts` is a clean seam for a real API call —
`lib/simulate.ts`, `lib/handover.ts`, and `lib/assistant.ts` each export a single function that
can be swapped for a `fetch` to the FastAPI backend (see `../backend`) without touching any
component code.

## Notes on "haptics"

True tactile vibration (`navigator.vibrate`) only fires on supporting Android/PWA contexts over
HTTPS — it's wired up in `lib/haptics.ts` and triggered on key taps, but most desktop browsers
will simply no-op it. Every interactive element also gets a `press-feedback` micro-animation
(scale + brightness dip on `:active`) so the tactile feel is consistent everywhere, vibration or
not.
