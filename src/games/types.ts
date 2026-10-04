import type { Locale } from "@/config/app";

export type Subject = "math" | "reading" | "science" | "english" | "logic";

export type Question = {
  /** Testo della domanda (letto ad alta voce per i più piccoli). */
  prompt: string;
  /** Grande elemento visivo: emoji, numeri, operazione. */
  visual?: string;
  options: string[];
  answer: number;
  /** Opzioni grandi (emoji) invece di testo. */
  bigOptions?: boolean;
};

export type GameDef = {
  id: string;
  subject: Subject;
  icon: string;
  color: string;
  /** Livelli di gioco (0 = 3–4 anni … 6 = quinta) in cui il gioco compare. */
  minLevel: number;
  maxLevel: number;
  title: Record<Locale, string>;
  generate: (level: number, locale: Locale) => Question[];
};
