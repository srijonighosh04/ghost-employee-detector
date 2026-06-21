const STEPS = [
  {
    n: "01",
    title: "Connect & ingest",
    body: "NexusIQ reads from your existing tools — ticketing, docs, repos, org charts — no new process required from your team.",
  },
  {
    n: "02",
    title: "Build the graph",
    body: "Employees, projects, documents, and teams are linked into a single Neo4j knowledge graph reflecting how work actually flows.",
  },
  {
    n: "03",
    title: "Score the risk",
    body: "Each employee gets a Knowledge Risk Score from project ownership, dependency count, and documentation coverage.",
  },
  {
    n: "04",
    title: "Simulate the exit",
    body: "Run a resignation simulation on anyone, anytime, and see the blast radius before it's real.",
  },
  {
    n: "05",
    title: "Generate the handover",
    body: "The AI Handover Generator drafts SOPs and training guides from what's already in the graph, ready for review.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-mono uppercase tracking-wide text-signal-glow">Process</span>
        <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold text-bone sm:text-4xl">
          From scattered tools to one continuity map.
        </h2>

        <div className="mt-12 grid gap-0 md:grid-cols-5">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative border-t border-white/10 pt-6 pr-4 md:border-t-0 md:border-l md:pl-6 md:pt-0">
              <span className="font-mono text-sm text-slate">{s.n}</span>
              <h3 className="mt-3 font-display text-base font-medium text-bone">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{s.body}</p>
              {i < STEPS.length - 1 && (
                <span className="absolute -right-px top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
