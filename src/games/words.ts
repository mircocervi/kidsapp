import type { Locale } from "@/config/app";
import type { GameDef, Question } from "./types";
import { pick, ROUND, shuffle, withOptions, random } from "./util";

// Parole illustrate da emoji. Ogni voce ha la parola nelle lingue supportate (+ es per chi studia lo spagnolo).
const picture = [
  { e: "🍎", en: "apple", it: "mela", es: "manzana" },
  { e: "🐱", en: "cat", it: "gatto", es: "gato" },
  { e: "🐶", en: "dog", it: "cane", es: "perro" },
  { e: "🏠", en: "house", it: "casa", es: "casa" },
  { e: "☀️", en: "sun", it: "sole", es: "sol" },
  { e: "🌙", en: "moon", it: "luna", es: "luna" },
  { e: "🐟", en: "fish", it: "pesce", es: "pez" },
  { e: "🌳", en: "tree", it: "albero", es: "árbol" },
  { e: "🚗", en: "car", it: "macchina", es: "coche" },
  { e: "📚", en: "book", it: "libro", es: "libro" },
  { e: "🐮", en: "cow", it: "mucca", es: "vaca" },
  { e: "🍌", en: "banana", it: "banana", es: "plátano" },
  { e: "🦁", en: "lion", it: "leone", es: "león" },
  { e: "🐸", en: "frog", it: "rana", es: "rana" },
  { e: "🌹", en: "rose", it: "rosa", es: "rosa" },
  { e: "🐝", en: "bee", it: "ape", es: "abeja" },
  { e: "🍕", en: "pizza", it: "pizza", es: "pizza" },
  { e: "⭐", en: "star", it: "stella", es: "estrella" },
  { e: "🐭", en: "mouse", it: "topo", es: "ratón" },
  { e: "🦆", en: "duck", it: "anatra", es: "pato" },
  { e: "🍇", en: "grapes", it: "uva", es: "uvas" },
  { e: "🐘", en: "elephant", it: "elefante", es: "elefante" },
  { e: "🎈", en: "balloon", it: "palloncino", es: "globo" },
  { e: "👟", en: "shoe", it: "scarpa", es: "zapato" },
  { e: "🥛", en: "milk", it: "latte", es: "leche" },
  { e: "🐻", en: "bear", it: "orso", es: "oso" },
  { e: "🍰", en: "cake", it: "torta", es: "pastel" },
  { e: "🐰", en: "rabbit", it: "coniglio", es: "conejo" },
  { e: "🐢", en: "turtle", it: "tartaruga", es: "tortuga" },
  { e: "🍊", en: "orange", it: "arancia", es: "naranja" },
] as const;

const alphabet = "ABCDEFGILMNOPRSTUVZ".split("");

export const letters: GameDef = {
  id: "letters",
  subject: "reading",
  icon: "🔤",
  color: "#A8E6A1",
  minLevel: 0,
  maxLevel: 3,
  title: { en: "First letters", it: "Prima lettera" },
  generate: (level, locale) =>
    shuffle(picture).slice(0, ROUND).map((p): Question => {
      const word = p[locale];
      const first = word[0].toUpperCase();
      const opts = withOptions(first, alphabet, level === 0 ? 3 : 4);
      return {
        prompt: locale === "it" ? `Con che lettera inizia ${word.toUpperCase()}?` : `What letter does ${word.toUpperCase()} start with?`,
        visual: p.e,
        ...opts,
        bigOptions: true,
      };
    }),
};

/** Lingua straniera: inglese per chi usa l'app in altre lingue, spagnolo per chi la usa in inglese. */
const foreign = (locale: Locale) => (locale === "en" ? "es" : "en");

export const vocabulary: GameDef = {
  id: "vocabulary",
  subject: "english",
  icon: "🌍",
  color: "#B9C8FF",
  minLevel: 1,
  maxLevel: 6,
  title: { en: "Spanish words", it: "Parole in inglese" },
  generate: (level, locale) =>
    shuffle(picture).slice(0, ROUND).map((p): Question => {
      const lang = foreign(locale);
      const word = p[lang];
      // dai livelli alti: dalla parola al disegno (più difficile, si deve leggere)
      if (level >= 4 && random() < 0.5) {
        const opts = withOptions(p.e, picture.map((x) => x.e), 4);
        return {
          prompt: locale === "it" ? `Quale disegno è "${word}"?` : `Which picture is "${word}"?`,
          visual: word,
          ...opts,
          bigOptions: true,
        };
      }
      return {
        prompt: locale === "it" ? "Come si dice in inglese?" : "How do you say it in Spanish?",
        visual: p.e,
        ...withOptions(word, picture.map((x) => x[lang]), level <= 2 ? 3 : 4),
      };
    }),
};

const groups = {
  fruit: ["🍎", "🍌", "🍇", "🍓", "🍊", "🍐", "🍒", "🍉"],
  animals: ["🐶", "🐱", "🐰", "🐻", "🦁", "🐸", "🐮", "🐷"],
  vehicles: ["🚗", "🚌", "🚲", "✈️", "🚂", "🚀", "🚁", "⛵"],
  music: ["🎸", "🥁", "🎺", "🎻", "🎹", "🪇", "🎷", "🪈"],
  weather: ["☀️", "🌧️", "❄️", "🌈", "⛅", "🌪️", "⚡", "🌫️"],
  clothes: ["👕", "👖", "🧦", "🧢", "👗", "🧤", "🧣", "👟"],
} as const;

export const oddOne: GameDef = {
  id: "odd-one",
  subject: "logic",
  icon: "🧩",
  color: "#FFB27A",
  minLevel: 0,
  maxLevel: 4,
  title: { en: "Odd one out", it: "L'intruso" },
  generate: (_level, locale) =>
    Array.from({ length: ROUND }, (): Question => {
      const keys = shuffle(Object.keys(groups) as (keyof typeof groups)[]);
      const same = shuffle(groups[keys[0]]).slice(0, 3);
      const odd = pick(groups[keys[1]]);
      const options = shuffle([...same, odd]);
      return {
        prompt: locale === "it" ? "Chi è l'intruso?" : "Which one doesn't belong?",
        options,
        answer: options.indexOf(odd),
        bigOptions: true,
      };
    }),
};

const colors = [
  { e: "🔴", en: "red", it: "il rosso" },
  { e: "🟢", en: "green", it: "il verde" },
  { e: "🔵", en: "blue", it: "il blu" },
  { e: "🟡", en: "yellow", it: "il giallo" },
  { e: "🟠", en: "orange", it: "l'arancione" },
  { e: "🟣", en: "purple", it: "il viola" },
] as const;

const shapes = [
  { e: "⭐", en: "the star", it: "la stella" },
  { e: "❤️", en: "the heart", it: "il cuore" },
  { e: "🔺", en: "the triangle", it: "il triangolo" },
  { e: "🟦", en: "the square", it: "il quadrato" },
  { e: "⚪", en: "the circle", it: "il cerchio" },
] as const;

export const colorsShapes: GameDef = {
  id: "colors-shapes",
  subject: "logic",
  icon: "🎨",
  color: "#FF9EAA",
  minLevel: 0,
  maxLevel: 1,
  title: { en: "Colours and shapes", it: "Colori e forme" },
  generate: (_level, locale) =>
    Array.from({ length: ROUND }, (): Question => {
      const useColor = random() < 0.6;
      const pool: readonly { e: string; en: string; it: string }[] = useColor ? colors : shapes;
      const target = pick(pool);
      const opts = withOptions(target.e, pool.map((p) => p.e), 3);
      const name = target[locale];
      return {
        prompt: locale === "it" ? `Dov'è ${name}?` : `Where is ${name}?`,
        ...opts,
        bigOptions: true,
      };
    }),
};
