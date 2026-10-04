"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/config/app";
import { gameById } from "@/games/registry";
import type { Question } from "@/games/types";
import type { Dictionary } from "@/i18n";
import { fmt } from "@/i18n/format";
import { speak } from "@/lib/speech";
import { supabaseBrowser } from "@/lib/supabase/client";

const secondsSince = (start: number) => Math.round((Date.now() - start) / 1000);

type Props = {
  lang: Locale;
  childId: string;
  parentId: string;
  gameId: string;
  level: number;
  readAloud: boolean;
  t: Dictionary["games"];
};

export function GamePlayer({ lang, childId, parentId, gameId, level, readAloud, t }: Props) {
  const game = gameById(gameId)!;
  // Componente caricato solo sul client (vedi game-loader): le domande casuali si generano subito.
  const [questions, setQuestions] = useState<Question[]>(() => game.generate(level, lang));
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const firstTry = useRef(true);
  const [startedAt, setStartedAt] = useState(() => Date.now());

  function start() {
    setQuestions(game.generate(level, lang));
    setIndex(0);
    setCorrect(0);
    setPicked(null);
    setWrong(null);
    setDone(false);
    firstTry.current = true;
    setStartedAt(Date.now());
  }

  const q = questions[index];

  useEffect(() => {
    if (q && readAloud) speak(q.prompt, lang);
  }, [q, readAloud, lang]);

  async function finish(finalCorrect: number, total: number) {
    setDone(true);
    speak(t.wellDone, lang);
    await supabaseBrowser().from("activity_results").insert({
      parent_id: parentId,
      child_id: childId,
      game_id: game.id,
      subject: game.subject,
      level,
      correct: finalCorrect,
      total,
      duration_seconds: secondsSince(startedAt),
    });
  }

  function choose(i: number) {
    if (!q || picked !== null) return;
    if (i === q.answer) {
      const nextCorrect = correct + (firstTry.current ? 1 : 0);
      setCorrect(nextCorrect);
      setPicked(i);
      speak(t.correct, lang);
      setTimeout(() => {
        if (index + 1 >= questions.length) {
          finish(nextCorrect, questions.length);
        } else {
          setIndex(index + 1);
          setPicked(null);
          setWrong(null);
          firstTry.current = true;
        }
      }, 900);
    } else {
      // Nessuna penalità visibile: si riprova finché non si trova la risposta (conta solo il primo tentativo).
      firstTry.current = false;
      setWrong(i);
      speak(t.tryAgain, lang);
      setTimeout(() => setWrong(null), 600);
    }
  }

  return (
    <div className="min-h-dvh" style={{ background: `linear-gradient(${game.color}66, var(--color-cream) 45%)` }}>
    <main className="safe-area no-select mx-auto flex min-h-dvh max-w-3xl flex-col gap-6">
      <header className="flex items-center gap-4">
        <Link href={`/${lang}/play/${childId}`} className="btn btn-ghost !min-h-12 !w-12 !px-0 text-2xl" aria-label={t.backHome}>←</Link>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-paper shadow-[inset_0_0_0_2px_var(--color-line)]">
          <div
            className="h-full rounded-full bg-mint transition-all duration-500"
            style={{ width: `${questions.length ? ((index + (picked !== null || done ? 1 : 0)) / questions.length) * 100 : 0}%` }}
          />
        </div>
        <span className="font-display text-xl font-bold">⭐ {correct}</span>
      </header>

      {done ? (
        <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <span className="animate-pop text-9xl">🏆</span>
          <h1 className="font-display text-5xl font-extrabold">{t.wellDone}</h1>
          <p className="font-display text-3xl">{"⭐".repeat(correct)}</p>
          <p className="text-xl text-ink-soft">{fmt(t.score, { correct, total: questions.length })}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="btn btn-coral" onClick={start}>🔁 {t.playAgain}</button>
            <Link href={`/${lang}/play/${childId}`} className="btn btn-ghost">🏠 {t.backHome}</Link>
          </div>
        </section>
      ) : q ? (
        <section key={index} className="animate-pop flex flex-1 flex-col items-center justify-center gap-8">
          <button onClick={() => speak(q.prompt, lang)} className="flex items-center gap-3 text-center font-display text-3xl font-bold sm:text-4xl">
            <span className="text-2xl">🔊</span> {q.prompt}
          </button>
          {q.visual && (
            <div className="card flex min-h-32 max-w-full items-center justify-center px-6 py-5 text-center font-display text-5xl leading-tight font-extrabold break-words sm:text-6xl">
              {q.visual}
            </div>
          )}
          <div className={`grid w-full gap-4 ${q.options.length === 4 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
            {q.options.map((opt, i) => {
              const state = picked === i ? "bg-mint text-white scale-105" : wrong === i ? "bg-coral text-white animate-shake" : "bg-paper";
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  className={`flex min-h-24 items-center justify-center rounded-[1.75rem] px-4 py-4 font-display font-bold shadow-[0_5px_0_var(--color-line),inset_0_0_0_3px_var(--color-line)] transition active:translate-y-1 ${q.bigOptions ? "text-5xl sm:text-6xl" : "text-2xl sm:text-3xl"} ${state}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
    </div>
  );
}
