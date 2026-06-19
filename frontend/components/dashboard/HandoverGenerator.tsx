"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { employees } from "@/lib/mock-data";
import { getHandoverDoc } from "@/lib/handover";
import { Avatar } from "@/components/ui/Avatar";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { cn, riskColor } from "@/lib/utils";
import { fireHaptic } from "@/lib/haptics";
import { Download, FileStack, Loader2 } from "lucide-react";
import { HandoverDoc } from "@/types";

export function HandoverGenerator() {
  const params = useSearchParams();
  const initial = params.get("employee") ?? "e1";
  const [selectedId, setSelectedId] = useState(initial);
  const [generating, setGenerating] = useState(false);
  const [doc, setDoc] = useState<HandoverDoc | null>(null);

  const employee = employees.find((e) => e.id === selectedId) ?? employees[0];

  async function generate() {
    fireHaptic("tap");
    setGenerating(true);
    setDoc(null);
    try {
      const result = await getHandoverDoc(employee.id);
      setDoc(result);
      fireHaptic("success");
    } catch {
      // fallback already handled in lib/handover.ts
    } finally {
      setGenerating(false);
    }
  }

  function download() {
    if (!doc) return;
    fireHaptic("select");
    const text = [
      doc.title,
      "",
      ...doc.sections.flatMap((s) => [s.heading.toUpperCase(), s.body, ""]),
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[20rem_1fr]">
      <GlassPanel className="h-fit p-4">
        <h3 className="px-1 pb-3 font-display text-sm font-medium text-bone">Choose an employee</h3>
        <div className="flex flex-col gap-1">
          {employees.map((e) => {
            const active = e.id === employee.id;
            return (
              <button
                key={e.id}
                onClick={() => {
                  fireHaptic("select");
                  setSelectedId(e.id);
                  setDoc(null);
                }}
                className={cn(
                  "press-feedback flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors",
                  active ? "bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" : "hover:bg-white/[0.04]"
                )}
              >
                <Avatar initials={e.initials} color={e.avatarColor} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-bone">{e.name}</p>
                  <p className="truncate text-xs text-slate">{e.role}</p>
                </div>
                <span className={cn("h-2 w-2 shrink-0 rounded-full", riskColor(e.riskLevel).dot)} />
              </button>
            );
          })}
        </div>
        <Button onClick={generate} disabled={generating} className="mt-4 w-full" variant="primary">
          {generating ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Drafting…
            </>
          ) : (
            <>
              <FileStack size={15} /> Generate handover brief
            </>
          )}
        </Button>
      </GlassPanel>

      <GlassPanel variant="raised" className="p-6 sm:p-8">
        {!doc && !generating && (
          <div className="flex h-full min-h-[20rem] flex-col items-center justify-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pulse/15 text-pulse-glow">
              <FileStack size={20} />
            </span>
            <p className="mt-4 max-w-xs text-sm text-slate">
              Select an employee and generate a handover brief drafted from what the knowledge
              graph already knows about their work.
            </p>
          </div>
        )}

        {generating && (
          <div className="flex h-full min-h-[20rem] flex-col items-center justify-center gap-3 text-center">
            <Loader2 size={22} className="animate-spin text-signal-glow" />
            <p className="text-sm text-slate">
              Pulling project ownership, dependencies, and existing docs for {employee.name}…
            </p>
          </div>
        )}

        {doc && !generating && (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-medium text-bone">{doc.title}</h2>
                <p className="text-xs text-slate">{doc.generatedAt}</p>
              </div>
              <Button variant="outline" size="sm" onClick={download}>
                <Download size={14} /> Download .txt
              </Button>
            </div>

            <div className="mt-6 space-y-5">
              {doc.sections.map((s) => (
                <div key={s.heading}>
                  <h3 className="font-mono text-xs uppercase tracking-wide text-pulse-glow">{s.heading}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-bone">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
