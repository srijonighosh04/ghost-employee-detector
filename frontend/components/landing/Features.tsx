import { GlassPanel } from "@/components/ui/GlassPanel";
import { Network, Gauge, GitBranch, MessageSquareText, FileStack } from "lucide-react";

const FEATURES = [
  {
    icon: Network,
    title: "Organizational Knowledge Graph",
    body: "Every employee, project, document, and team connected into one live graph — built automatically from how work already happens, not from a wiki nobody updates.",
    accent: "cyan" as const,
    span: "md:col-span-2",
  },
  {
    icon: Gauge,
    title: "Knowledge Risk Score",
    body: "A single score per employee, weighted by project ownership, dependency count, and documentation coverage.",
    accent: "amber" as const,
    span: "",
  },
  {
    icon: GitBranch,
    title: "Resignation Impact Simulator",
    body: "Pick any employee and see, instantly, which projects stall, which teammates are exposed, and how many weeks a replacement would need to ramp.",
    accent: "amber" as const,
    span: "",
  },
  {
    icon: MessageSquareText,
    title: "AI Knowledge Assistant",
    body: "Ask 'who owns this process' or 'what breaks if they leave' in plain language and get an answer grounded in the graph, not a guess.",
    accent: "cyan" as const,
    span: "",
  },
  {
    icon: FileStack,
    title: "AI Handover Generator",
    body: "Turns tribal knowledge into SOPs, training guides, and structured handover briefs — before it leaves with the person who holds it.",
    accent: "cyan" as const,
    span: "md:col-span-2",
  },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <span className="text-xs font-mono uppercase tracking-wide text-pulse-glow">Platform</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-bone sm:text-4xl">
            Five systems, one continuous map.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <GlassPanel key={f.title} className={`p-6 ${f.span}`}>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    f.accent === "amber" ? "bg-signal/15 text-signal-glow" : "bg-pulse/15 text-pulse-glow"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 font-display text-lg font-medium text-bone">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{f.body}</p>
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
}
