// Frasi pronte e sticker per i messaggi tra amici. Le frasi si salvano come id e vengono
// mostrate nella lingua di chi le legge: due amici possono usare l'app in lingue diverse.

export const phrases = [
  { id: "hi", it: "Ciao! 👋", en: "Hi! 👋" },
  { id: "play", it: "Giochiamo? 🎮", en: "Shall we play? 🎮" },
  { id: "challenge", it: "Ti sfido! 🏁", en: "I challenge you! 🏁" },
  { id: "great", it: "Grande! ⭐", en: "Great! ⭐" },
  { id: "thanks", it: "Grazie! 💛", en: "Thank you! 💛" },
  { id: "school", it: "Ci vediamo a scuola! 🎒", en: "See you at school! 🎒" },
  { id: "yes", it: "Sì! 👍", en: "Yes! 👍" },
  { id: "no", it: "No 🙅", en: "No 🙅" },
  { id: "bye", it: "Ciao ciao! 🌙", en: "Bye bye! 🌙" },
] as const;

export const stickers = ["😀", "😂", "🥳", "😍", "🤩", "😮", "😢", "😴", "👍", "👏", "🎉", "⭐", "🦄", "🐶", "🍕", "⚽"] as const;

export const phraseText = (id: string, locale: string) => {
  const p = phrases.find((x) => x.id === id);
  return p ? (locale === "it" ? p.it : p.en) : "";
};

export const isPhrase = (id: string) => phrases.some((p) => p.id === id);
export const isSticker = (s: string) => (stickers as readonly string[]).includes(s);

export const MAX_TEXT = 300;
/** Testo libero solo da 8 anni (classe terza in su): i più piccoli usano sticker e frasi pronte. */
export const canWriteFreeText = (age: number) => age >= 8;
