// La classe scolastica è l'unico dato "anagrafico" del bambino: da qui derivano
// fascia d'età (guardrail del chatbot), modalità vocale e livello dei giochi.

export const grades = ["pre3", "pre4", "pre5", "g1", "g2", "g3", "g4", "g5", "m1", "m2", "m3"] as const;
export type Grade = (typeof grades)[number];

export type AgeBand = "little" | "early" | "middle" | "older";

const info: Record<Grade, { age: number; band: AgeBand; level: number }> = {
  pre3: { age: 3, band: "little", level: 0 },
  pre4: { age: 4, band: "little", level: 0 },
  pre5: { age: 5, band: "little", level: 1 },
  g1: { age: 6, band: "early", level: 2 },
  g2: { age: 7, band: "early", level: 3 },
  g3: { age: 8, band: "middle", level: 4 },
  g4: { age: 9, band: "middle", level: 5 },
  g5: { age: 10, band: "middle", level: 6 },
  m1: { age: 11, band: "older", level: 6 },
  m2: { age: 12, band: "older", level: 6 },
  m3: { age: 13, band: "older", level: 6 },
};

export function isGrade(value: string): value is Grade {
  return (grades as readonly string[]).includes(value);
}

export const ageOf = (g: Grade) => info[g].age;
export const bandOf = (g: Grade) => info[g].band;
/** Livello dei giochi: 0 = 3–4 anni … 6 = quinta elementare (tetto massimo). */
export const levelOf = (g: Grade) => info[g].level;
/** Fino a 7 anni la chat è soprattutto vocale. */
export const isVoiceFirst = (g: Grade) => info[g].age <= 7;
