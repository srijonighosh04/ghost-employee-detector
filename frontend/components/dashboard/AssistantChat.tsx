"use client";

import { useEffect, useRef, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Avatar } from "@/components/ui/Avatar";
import { fireHaptic } from "@/lib/haptics";
import { answerQuery } from "@/lib/assistant";
import { ChatMessage } from "@/types";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Who is responsible for the Subscription Billing Engine?",
  "What happens if Tobias Hahn leaves?",
  "What does Priya Nair own?",
  "Who depends on Marcus Webb?",
];

const SEED: ChatMessage[] = [
  {
    id: "seed-1",
    role: "assistant",
    content:
      "Ask me about ownership, dependencies, or what would happen if someone left. I answer using the live Organizational Knowledge Graph, not a guess.",
  },
];

export function AssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    fireHaptic("tap");

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const { content, citedDocs } = answerQuery(trimmed);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content, citedDocs },
      ]);
      setThinking(false);
      fireHaptic("success");
    }, 650);
  }

  return (
    <GlassPanel variant="raised" className="flex h-[calc(100vh-9.5rem)] flex-col p-0">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
            {m.role === "assistant" ? (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pulse/15 text-pulse-glow">
                <Sparkles size={14} />
              </span>
            ) : (
              <Avatar initials="MR" color="#F0A93B" size={32} />
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "assistant" ? "glass-inset text-bone" : "bg-signal/15 text-bone"
              )}
            >
              <p>{m.content}</p>
              {m.citedDocs && m.citedDocs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.citedDocs.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-slate"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pulse/15 text-pulse-glow">
              <Sparkles size={14} />
            </span>
            <div className="glass-inset flex items-center gap-1.5 rounded-2xl px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-slate animate-pulse-soft"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="press-feedback rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate hover:text-bone hover:bg-white/[0.06]"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the knowledge graph a question…"
            className="glass-inset flex-1 rounded-full px-4 py-3 text-sm text-bone placeholder:text-slate focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="press-feedback flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signal text-[#1A1206] shadow-glow-amber hover:bg-signal-glow"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </GlassPanel>
  );
}
