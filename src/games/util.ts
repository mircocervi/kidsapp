export const ROUND = 8;

export const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

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
