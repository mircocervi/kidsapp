"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Dictionary } from "@/i18n";

type BeforeInstallPrompt = Event & { prompt: () => Promise<void> };
type Platform = "ios" | "android" | "other";

const noSubscribe = () => () => {};

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  // iPadOS si presenta come Mac: lo riconosciamo dal touch.
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return /Android/.test(ua) ? "android" : "other";
}

/** Istruzioni per aggiungere l'app alla Home; su Android/Chrome usa il prompt nativo. */
export function InstallHint({ t }: { t: Dictionary["install"] }) {
  const platform = useSyncExternalStore<Platform>(noSubscribe, detectPlatform, () => "other");
  const installed = useSyncExternalStore(
    noSubscribe,
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false,
  );
  const [prompt, setPrompt] = useState<BeforeInstallPrompt | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (installed) return null;

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-brand-soft p-5">
      <h3 className="font-display text-xl font-bold text-brand">📲 {t.title}</h3>
      {platform !== "android" && <p>{t.ios}</p>}
      {platform !== "ios" && <p>{t.android}</p>}
      {prompt && (
        <button className="btn btn-primary w-fit" onClick={() => prompt.prompt()}>
          {t.button}
        </button>
      )}
    </div>
  );
}
