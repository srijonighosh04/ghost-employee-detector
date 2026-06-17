import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function CTA() {
  return (
    <section className="px-4 py-20">
      <GlassPanel variant="raised" className="mx-auto max-w-5xl px-8 py-14 text-center sm:px-14">
        <h2 className="font-display text-3xl font-semibold text-bone sm:text-4xl">
          Don&apos;t wait for the exit interview
          <br />
          to find out what you didn&apos;t know.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-slate">
          Open the dashboard with sample data and run your first resignation simulation in under a minute.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button variant="primary" size="lg">Open the dashboard</Button>
          </Link>
        </div>
      </GlassPanel>
    </section>
  );
}
