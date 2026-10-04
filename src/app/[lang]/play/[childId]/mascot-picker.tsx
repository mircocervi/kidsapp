"use client";

import { useState, useTransition } from "react";
import { mascots } from "@/config/characters";
import { fmt } from "@/i18n/format";
import { speak } from "@/lib/speech";
import { chooseMascot } from "../actions";

type Props = { lang: string; childId: string; title: string; intro: string; current?: string | null; onDone?: () => void };

export function MascotPicker({ lang, childId, title, intro, current, onDone }: Props) {
  const [selected, setSelected] = useState<string | null>(current ?? null);
  const [pending, start] = useTransition();
  const mascot = mascots.find((m) => m.id === selected);

  function choose(id: string) {
    setSelected(id);
    const m = mascots.find((x) => x.id === id)!;
    speak(fmt(intro, { mascot: m.name }), lang);
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="font-display text-4xl font-extrabold">{title}</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {mascots.map((m) => (
          <button
            key={m.id}
            onClick={() => choose(m.id)}
            className={`flex h-36 w-36 flex-col items-center justify-center gap-1 rounded-[2rem] transition active:scale-95 sm:h-40 sm:w-40 ${selected === m.id ? "scale-105 ring-6 ring-brand" : ""}`}
            style={{ background: m.color }}
          >
            <span className="text-7xl">{m.emoji}</span>
            <span className="font-display text-xl font-bold">{m.name}</span>
          </button>
        ))}
      </div>
      {mascot && (
        <div className="animate-pop flex max-w-lg flex-col items-center gap-5 text-center">
          <p className="card p-5 text-xl">{fmt(intro, { mascot: mascot.name })}</p>
          <button
            className="btn btn-coral !min-h-16 !px-10 !text-2xl"
            disabled={pending}
            onClick={() => start(async () => { await chooseMascot(lang, childId, mascot.id); onDone?.(); })}
          >
            {mascot.emoji} OK!
          </button>
        </div>
      )}
    </div>
  );
}
