"use client";

import dynamic from "next/dynamic";

// Le domande sono casuali: il gioco si monta solo nel browser, così non c'è differenza con l'HTML del server.
export const GameLoader = dynamic(() => import("./game-player").then((m) => m.GamePlayer), {
  ssr: false,
  loading: () => <div className="flex min-h-dvh items-center justify-center text-6xl">⏳</div>,
});
