import type { GameDef, Question } from "./types";
import { nearNumbers, pick, rand, ROUND, withOptions, random } from "./util";

const things = ["🍎", "⭐", "🐟", "🎈", "🍓", "🚗", "🐞", "🌼", "🧁", "⚽"];

export const count: GameDef = {
  id: "count",
  subject: "math",
  icon: "🔢",
  color: "#FFD66B",
  minLevel: 0,
  maxLevel: 2,
  title: { en: "Let's count!", it: "Contiamo!" },
  generate: (level, locale) =>
    Array.from({ length: ROUND }, (): Question => {
      const n = rand(1, level === 0 ? 5 : 10);
      const thing = pick(things);
      return {
        prompt: locale === "it" ? "Quanti sono?" : "How many?",
        visual: Array(n).fill(thing).join(" "),
        ...withOptions(String(n), nearNumbers(n, 2, 1)),
        bigOptions: true,
      };
    }),
};

function sumQuestion(level: number): { text: string; result: number } {
  if (level <= 1) {
    const a = rand(1, 4), b = rand(1, 5 - a);
    return { text: `${a} + ${b}`, result: a + b };
  }
  if (level === 2) {
    const a = rand(1, 9), b = rand(1, 10 - a);
    return random() < 0.7 ? { text: `${a} + ${b}`, result: a + b } : { text: `${a + b} − ${b}`, result: a };
  }
  if (level === 3) {
    const a = rand(2, 15), b = rand(1, 20 - a);
    return random() < 0.5 ? { text: `${a} + ${b}`, result: a + b } : { text: `${a + b} − ${a}`, result: b };
  }
  if (level === 4) {
    const a = rand(10, 80), b = rand(5, 99 - a);
    return random() < 0.5 ? { text: `${a} + ${b}`, result: a + b } : { text: `${a + b} − ${b}`, result: a };
  }
  const a = rand(100, 700), b = rand(50, 999 - a);
  return random() < 0.5 ? { text: `${a} + ${b}`, result: a + b } : { text: `${a + b} − ${a}`, result: b };
}

export const sums: GameDef = {
  id: "sums",
  subject: "math",
  icon: "➕",
  color: "#A9DDF5",
  minLevel: 1,
  maxLevel: 6,
  title: { en: "Plus and minus", it: "Più e meno" },
  generate: (level, locale) =>
    Array.from({ length: ROUND }, (): Question => {
      const q = sumQuestion(level);
      return {
        prompt: locale === "it" ? "Quanto fa?" : "What is it?",
        visual: `${q.text} = ?`,
        ...withOptions(String(q.result), nearNumbers(q.result, level >= 4 ? 10 : 3)),
        bigOptions: true,
      };
    }),
};

export const times: GameDef = {
  id: "times",
  subject: "math",
  icon: "✖️",
  color: "#F5B8E6",
  minLevel: 3,
  maxLevel: 6,
  title: { en: "Times tables", it: "Tabelline" },
  generate: (level, locale) =>
    Array.from({ length: ROUND }, (): Question => {
      const table = level === 3 ? pick([2, 5, 10]) : rand(2, 10);
      const b = rand(1, 10);
      const divide = level >= 5 && random() < 0.4;
      const text = divide ? `${table * b} ÷ ${table}` : `${table} × ${b}`;
      const result = divide ? b : table * b;
      return {
        prompt: locale === "it" ? "Quanto fa?" : "What is it?",
        visual: `${text} = ?`,
        ...withOptions(String(result), [...nearNumbers(result, 4), String(result + table), String(Math.max(0, result - table))]),
        bigOptions: true,
      };
    }),
};
