"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MAX_TEXT, phrases, phraseText, stickers } from "@/config/friends";

type Msg = { id: string; mine: boolean; kind: "sticker" | "phrase" | "text"; content: string; delivered: boolean };
type Game = { id: string; icon: string; color: string; title: string };

type Props = {
  lang: string;
  childId: string;
  friendshipId: string;
  friendName: string;
  friendEmoji: string;
  canWrite: boolean;
  initial: Msg[];
  games: Game[];
  t: Record<"placeholder" | "send" | "notSent" | "challenge" | "pickGame" | "block" | "blockConfirm" | "error" | "cancel", string>;
};

export function FriendThread({ lang, childId, friendshipId, friendEmoji, canWrite, initial, games, t }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [panel, setPanel] = useState<null | "games" | "block">(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function send(kind: Msg["kind"], content: string) {
    if (busy) return;
    setBusy(true);
    const res = await fetch("/api/friends/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, friendshipId, kind, content }),
    }).catch(() => null);
    const data = res?.ok ? await res.json() : null;
    setBusy(false);
    if (!data) return alert(t.error);
    setMessages((m) => [...m, { id: data.id ?? crypto.randomUUID(), mine: true, kind, content, delivered: data.delivered }]);
    if (kind === "text") setText("");
  }

  async function challenge(gameId: string) {
    setBusy(true);
    const res = await fetch("/api/friends/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, friendshipId, gameId }),
    }).catch(() => null);
    const data = res?.ok ? await res.json() : null;
    setBusy(false);
    if (!data?.id) return alert(t.error);
    // Chi sfida gioca per primo; l'amico troverà la sfida nella sua pagina Amici.
    router.push(`/${lang}/play/${childId}/games/${gameId}?challenge=${data.id}`);
  }

  async function block() {
    await fetch("/api/friends/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, friendshipId }),
    }).catch(() => null);
    router.refresh();
  }

  const render = (m: Msg) => (m.kind === "phrase" ? phraseText(m.content, lang) : m.content);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {messages.map((m) =>
            m.mine ? (
              <div key={m.id} className="flex flex-col items-end gap-1 self-end">
                <span className={`animate-pop max-w-[85%] rounded-3xl rounded-br-lg px-5 py-3 whitespace-pre-wrap ${m.kind === "sticker" ? "text-6xl" : "bg-brand text-lg text-white"} ${m.delivered ? "" : "opacity-50"}`}>
                  {render(m)}
                </span>
                {!m.delivered && <span className="text-sm font-bold text-danger">{t.notSent}</span>}
              </div>
            ) : (
              <div key={m.id} className="flex items-end gap-2 self-start">
                <span className="text-3xl">{friendEmoji}</span>
                <span className={`animate-pop max-w-[85%] rounded-3xl rounded-bl-lg px-5 py-3 whitespace-pre-wrap ${m.kind === "sticker" ? "text-6xl" : "card text-lg"}`}>
                  {render(m)}
                </span>
              </div>
            ),
          )}
          <div ref={bottom} />
        </div>
      </div>

      <div className="safe-area !pt-3 border-t-2 border-line bg-paper">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {panel === "games" && (
            <div className="flex flex-col gap-2">
              <p className="font-display text-lg font-bold">{t.pickGame}</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {games.map((g) => (
                  <button key={g.id} disabled={busy} onClick={() => challenge(g.id)} className="flex flex-col items-center gap-1 rounded-2xl p-3 font-bold active:scale-95" style={{ background: g.color }}>
                    <span className="text-4xl">{g.icon}</span>
                    <span className="text-sm leading-tight">{g.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {panel === "block" && (
            <div className="flex flex-col gap-3 rounded-2xl bg-cream p-4">
              <p className="font-bold">{t.blockConfirm}</p>
              <div className="flex gap-2">
                <button onClick={block} className="btn bg-danger text-white">🚫 {t.block}</button>
                <button onClick={() => setPanel(null)} className="btn btn-ghost">{t.cancel}</button>
              </div>
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-1">
            {phrases.map((p) => (
              <button key={p.id} disabled={busy} onClick={() => send("phrase", p.id)} className="shrink-0 rounded-full bg-brand-soft px-4 py-2 font-bold text-brand active:scale-95">
                {phraseText(p.id, lang)}
              </button>
            ))}
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {stickers.map((s) => (
              <button key={s} disabled={busy} onClick={() => send("sticker", s)} className="shrink-0 rounded-2xl p-1 text-4xl active:scale-90">
                {s}
              </button>
            ))}
          </div>

          {canWrite && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (text.trim()) send("text", text.trim());
              }}
              className="flex items-end gap-2"
            >
              <input value={text} onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT))} placeholder={t.placeholder} className="field" enterKeyHint="send" />
              <button className="btn btn-coral shrink-0" disabled={busy || !text.trim()} aria-label={t.send}>➤</button>
            </form>
          )}

          <div className="flex justify-between gap-2">
            <button onClick={() => setPanel(panel === "games" ? null : "games")} className="btn btn-primary !min-h-12 !text-base">🏁 {t.challenge}</button>
            <button onClick={() => setPanel(panel === "block" ? null : "block")} className="text-sm text-ink-soft underline">{t.block}</button>
          </div>
        </div>
      </div>
    </>
  );
}
