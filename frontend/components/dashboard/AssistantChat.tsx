"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Avatar } from "@/components/ui/Avatar";
import { fireHaptic } from "@/lib/haptics";
import { answerQuery } from "@/lib/assistant";
import { ChatMessage } from "@/types";
import { Send, Sparkles, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Who owns the Core Deployment Pipeline?",
  "What happens if Tobias Hahn leaves?",
  "What does Priya Nair own?",
  "Which projects are at risk right now?",
  "Who has the lowest documentation coverage?",
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
  const params = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>(SEED);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const didAutoSend = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    fireHaptic("tap");

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    try {
      const { content, citedDocs } = await answerQuery(trimmed);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content, citedDocs },
      ]);
      fireHaptic("success");
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }, [thinking]);

  // Auto-send the ?q= URL param query on mount (from Topbar search)
  useEffect(() => {
    const q = params.get("q");
    if (q && !didAutoSend.current) {
      didAutoSend.current = true;
      // Small delay so the component fully mounts
      setTimeout(() => send(q), 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [send]);

  function reset() {
    fireHaptic("select");
    setMessages(SEED);
    setInput("");
    inputRef.current?.focus();
  }

  const hasConversation = messages.length > 1;

  return (
    <GlassPanel variant="raised" className="flex h-[calc(100vh-9.5rem)] flex-col p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pulse/15 text-pulse-glow">
            <Sparkles size={14} />
          </span>
          <div>
            <p className="text-sm font-medium text-bone">Knowledge Assistant</p>
            <p className="text-[10px] font-mono text-slate uppercase tracking-wide">
              Graph-grounded answers
            </p>
          </div>
        </div>
        {hasConversation && (
          <button
            onClick={reset}
            className="press-feedback flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate hover:text-bone hover:bg-white/[0.06] transition-colors"
          >
            <RotateCcw size={11} />
            New chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex gap-3 animate-slide-up", m.role === "user" && "flex-row-reverse")}
          >
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
              <p className="whitespace-pre-wrap">{m.content}</p>
              {m.citedDocs && m.citedDocs.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="text-[10px] uppercase tracking-wide text-slate mr-1">Sources:</span>
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
          <div className="flex gap-3 animate-fade-in">
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

      {/* Input area */}
      <div className="border-t border-white/10 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={thinking}
              className="press-feedback rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate hover:text-bone hover:bg-white/[0.06] disabled:opacity-50 transition-colors"
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
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask the knowledge graph a question…"
            disabled={thinking}
            className="glass-inset flex-1 rounded-full px-4 py-3 text-sm text-bone placeholder:text-slate focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            aria-label="Send message"
            className="press-feedback flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signal text-[#1A1206] shadow-glow-amber hover:bg-signal-glow disabled:opacity-50 transition-all"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="mt-1.5 text-center text-[10px] font-mono text-slate/50">
          Press ⌘ Enter to send
        </p>
      </div>
    </GlassPanel>
  );
}
