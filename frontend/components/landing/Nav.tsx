import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 px-4 pt-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-bone">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal/20 text-signal-glow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
              <circle cx="5" cy="18" r="2.4" stroke="currentColor" strokeWidth="2" />
              <circle cx="19" cy="18" r="2.4" stroke="currentColor" strokeWidth="2" />
              <path d="M10 8L6.5 16M14 8l3.5 8" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          NexusIQ
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-slate md:flex">
          <a href="#how-it-works" className="hover:text-bone transition-colors">How it works</a>
          <a href="#features" className="hover:text-bone transition-colors">Platform</a>
          <a href="#risk-radar" className="hover:text-bone transition-colors">Risk radar</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hidden sm:block">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm">Open dashboard</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
