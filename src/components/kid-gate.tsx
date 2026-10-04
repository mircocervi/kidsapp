"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Limiti decisi dal genitore: tempo giornaliero e ora di riposo, misurati sul dispositivo.
// Il conteggio sta nel localStorage del dispositivo (dato tecnico, non esce dal tablet).

type Props = {
  childId: string;
  lang: string;
  dailyLimitMinutes: number | null;
  quietStart: string | null;
  quietEnd: string | null;
  texts: { timeUp: string; quietHours: string; parentArea: string };
  children: React.ReactNode;
};

const today = () => new Date().toISOString().slice(0, 10);
const keyFor = (childId: string) => `usage:${childId}:${today()}`;
const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

function inQuietHours(start: string | null, end: string | null) {
  if (!start || !end) return false;
  const now = new Date();
  const n = now.getHours() * 60 + now.getMinutes();
  const s = toMinutes(start), e = toMinutes(end);
  return s <= e ? n >= s && n < e : n >= s || n < e; // es. 20:30 → 07:00 attraversa la mezzanotte
}

function readSeconds(childId: string) {
  try {
    return Number(localStorage.getItem(keyFor(childId)) ?? 0);
  } catch {
    return 0;
  }
}

export function KidGate({ childId, lang, dailyLimitMinutes, quietStart, quietEnd, texts, children }: Props) {
  const [blocked, setBlocked] = useState<null | "time" | "quiet">(null);

  useEffect(() => {
    const check = () => {
      if (inQuietHours(quietStart, quietEnd)) return setBlocked("quiet");
      if (dailyLimitMinutes && readSeconds(childId) >= dailyLimitMinutes * 60) return setBlocked("time");
      setBlocked(null);
    };
    check();
    const tick = setInterval(() => {
      if (document.visibilityState === "visible") {
        try {
          localStorage.setItem(keyFor(childId), String(readSeconds(childId) + 15));
        } catch {}
      }
      check();
    }, 15_000);
    return () => clearInterval(tick);
  }, [childId, dailyLimitMinutes, quietStart, quietEnd]);

  if (!blocked) return <>{children}</>;
  return (
    <main className="safe-area flex min-h-dvh flex-col items-center justify-center gap-8 bg-ink text-center text-white">
      <span className="animate-bob text-9xl">🌙</span>
      <p className="font-display text-4xl font-extrabold">{blocked === "time" ? texts.timeUp : texts.quietHours}</p>
      <Link href={`/${lang}/parent`} className="btn btn-ghost">🔒 {texts.parentArea}</Link>
    </main>
  );
}
