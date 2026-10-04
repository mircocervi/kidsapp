"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { speak, stopSpeaking } from "@/lib/speech";

type Msg = { id: string; role: "child" | "assistant"; content: string };

type Props = {
  lang: string;
  childId: string;
  mascot: { name: string; emoji: string; color: string };
  readAloud: boolean;
  enabled: boolean;
  initial: Msg[];
  t: Record<"intro" | "disclosure" | "placeholder" | "send" | "thinking" | "listen" | "chatDisabled" | "rateLimited" | "error" | "back", string>;
};

export function ChatView({ lang, childId, mascot, readAloud, enabled, initial, t }: Props) {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  useEffect(() => stopSpeaking, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const question = text.trim();
    if (!question || busy) return;
    setText("");
    setBusy(true);
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "child", content: question }]);
    let reply: string;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, text: question }),
      });
      const data = await res.json();
      reply = res.ok ? data.reply : res.status === 429 ? t.rateLimited : res.status === 403 ? t.chatDisabled : t.error;
    } catch {
      reply = t.error;
    }
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    setBusy(false);
    if (readAloud) speak(reply, lang);
  }

  return (
    <main className="flex h-dvh flex-col" style={{ background: `linear-gradient(${mascot.color}66, var(--color-cream) 30%)` }}>
      <header className="safe-area flex items-center gap-3 !pb-3">
        <Link href={`/${lang}/play/${childId}`} className="btn btn-ghost !min-h-12 !w-12 !px-0 text-2xl" aria-label={t.back}>←</Link>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-4xl" style={{ background: mascot.color }}>{mascot.emoji}</span>
        <div className="flex flex-col">
          <span className="font-display text-2xl font-extrabold">{mascot.name}</span>
          {/* Trasparenza AI Act art. 50: il bambino sa sempre che parla con un'AI */}
          <span className="text-xs text-ink-soft">🤖 {t.disclosure}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <Bubble mascot={mascot} role="assistant" content={t.intro} lang={lang} listen={t.listen} />
          {messages.map((m) => (
            <Bubble key={m.id} mascot={mascot} role={m.role} content={m.content} lang={lang} listen={t.listen} />
          ))}
          {busy && (
            <div className="flex items-center gap-3 text-ink-soft">
              <span className="animate-bob text-3xl">{mascot.emoji}</span> {t.thinking}
            </div>
          )}
          <div ref={bottom} />
        </div>
      </div>

      <form onSubmit={send} className="safe-area !pt-3 border-t-2 border-line bg-paper">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          {enabled ? (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 500))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) send(e);
                }}
                rows={1}
                placeholder={t.placeholder}
                className="field max-h-40 min-h-14 resize-none py-3.5 text-lg"
                enterKeyHint="send"
              />
              <button className="btn btn-coral !min-h-14 shrink-0" disabled={busy || !text.trim()} aria-label={t.send}>
                ➤
              </button>
            </>
          ) : (
            <p className="w-full text-center font-display text-xl">{t.chatDisabled}</p>
          )}
        </div>
      </form>
    </main>
  );
}

function Bubble({ mascot, role, content, lang, listen }: { mascot: Props["mascot"]; role: Msg["role"]; content: string; lang: string; listen: string }) {
  if (role === "child") {
    return (
      <div className="animate-pop max-w-[85%] self-end rounded-3xl rounded-br-lg bg-brand px-5 py-3 text-lg whitespace-pre-wrap text-white">
        {content}
      </div>
    );
  }
  return (
    <div className="animate-pop flex max-w-[92%] items-end gap-2 self-start">
      <span className="text-3xl">{mascot.emoji}</span>
      <div className="card flex flex-col gap-2 rounded-bl-lg px-5 py-3">
        <p className="text-lg whitespace-pre-wrap">{content}</p>
        <button onClick={() => speak(content, lang)} className="w-fit text-sm font-bold text-brand">🔊 {listen}</button>
      </div>
    </div>
  );
}
