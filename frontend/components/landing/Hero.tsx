import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HeroGraph } from "./HeroGraph";

export function Hero() {
  return (
    <section className="px-4 pt-16 pb-20 md:pt-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-mono uppercase tracking-wide text-slate">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-soft" />
            Knowledge continuity, mapped
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] text-bone sm:text-5xl md:text-[3.4rem]">
            Find out who&apos;s about to
            <br />
            walk out with your{" "}
            <span className="text-gradient-signal">org chart&apos;s</span> memory.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate">
            Sentinel graphs every employee, project, and document into one Organizational
            Knowledge Graph, then scores who&apos;s quietly become a single point of failure —
            before their resignation letter tells you.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/dashboard">
              <Button variant="primary" size="lg">Open the dashboard</Button>
            </Link>
            <Link href="/dashboard/simulator">
              <Button variant="outline" size="lg">Run a resignation simulation</Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs font-mono text-slate">
            <span>10 employees mapped</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>3 flagged critical</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>8 active projects</span>
          </div>
        </div>

        <div className="glass-raised rounded-xl2 p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wide text-slate">
              Live dependency map
            </span>
            <span className="rounded-full bg-alert/15 px-2 py-0.5 text-[10px] font-mono text-alert-glow">
              critical node
            </span>
          </div>
          <HeroGraph />
        </div>
      </div>
    </section>
  );
}
