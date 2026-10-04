"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { unlockParent } from "./actions";

type Props = { lang: string; t: { title: string; enterPin: string; wrongPin: string; locked: string; back: string } };

export function PinPad({ lang, t }: Props) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function press(d: string) {
    if (pending) return;
    const next = (pin + d).slice(0, 4);
    setPin(next);
    setMessage(null);
    if (next.length === 4) {
      start(async () => {
        const result = await unlockParent(lang, next);
        if (result === "ok") router.refresh();
        else {
          setPin("");
          setMessage(result === "locked" ? t.locked : t.wrongPin);
        }
      });
    }
  }

  return (
    <main className="safe-area no-select flex min-h-dvh flex-col items-center justify-center gap-8">
      <h1 className="font-display text-3xl font-extrabold">🔒 {t.title}</h1>
      <p className="text-ink-soft">{t.enterPin}</p>
      <div className="flex gap-4" aria-live="polite">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-5 w-5 rounded-full ${i < pin.length ? "bg-brand" : "bg-line"}`} />
        ))}
      </div>
      <p className="h-6 text-danger">{message}</p>
      <div className="grid grid-cols-3 gap-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k, i) =>
          k === "" ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              onClick={() => (k === "⌫" ? setPin(pin.slice(0, -1)) : press(k))}
              className="btn btn-ghost !h-20 !w-20 !rounded-full !p-0 !text-3xl"
              disabled={pending}
            >
              {k}
            </button>
          ),
        )}
      </div>
      <Link href={`/${lang}/play`} className="text-ink-soft underline">{t.back}</Link>
    </main>
  );
}
