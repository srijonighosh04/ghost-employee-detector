"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSigningIn(true);
    localStorage.setItem("nexusiq-user", email);
    router.push("/dashboard");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-[#07131c]/90 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-signal-glow">NexusIQ</p>
          <h1 className="text-3xl font-semibold text-bone sm:text-4xl">
            Sign in to your risk intelligence workspace
          </h1>
          <p className="text-sm leading-6 text-slate">
            Access your dashboard, monitor knowledge risk, and respond faster with NexusIQ.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0d1d29] px-4 py-3 text-base text-bone outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0d1d29] px-4 py-3 text-base text-bone outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
              placeholder="Enter your password"
            />
          </div>

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <Button type="submit" size="lg" className="w-full" disabled={isSigningIn}>
            {isSigningIn ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate">
          <p className="space-x-1">
            <span>No account yet?</span>
            <Link href="/" className="font-semibold text-bone hover:text-white">
              Return home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
