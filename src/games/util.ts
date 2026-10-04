export const ROUND = 8;

// Generatore casuale sostituibile: nelle sfide entrambi i bambini usano lo stesso seme
// e ricevono quindi le stesse domande.
let rng: () => number = Math.random;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function withSeed<T>(seed: number | null | undefined, fn: () => T): T {
  if (seed == null) return fn();
  const previous = rng;
  rng = mulberry32(seed);
  try {
    return fn();
  } finally {
    rng = previous;
  }
}

export const random = () => rng();

export const rand = (min: number, max: number) => Math.floor(random() * (max - min + 1)) + min;

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)];

/** Costruisce opzioni mescolate con la risposta giusta e restituisce l'indice corretto. */
export function withOptions(correct: string, distractors: string[], count = 3) {
  const unique = [...new Set(distractors.filter((d) => d !== correct))];
  const options = shuffle([correct, ...shuffle(unique).slice(0, count - 1)]);
  return { options, answer: options.indexOf(correct) };
}

/** Distrattori numerici vicini alla risposta, mai negativi. */
export function nearNumbers(n: number, spread = 3, min = 0) {
  const out: number[] = [];
  for (let k = 1; k <= spread; k++) {
    if (n + k >= min) out.push(n + k);
    if (n - k >= min) out.push(n - k);
  }
  return shuffle(out).map(String);
}
