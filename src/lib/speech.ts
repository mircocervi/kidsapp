"use client";

// Lettura ad alta voce con le voci del dispositivo (Web Speech API, speechSynthesis):
// il testo viene sintetizzato localmente, nessun audio lascia il tablet o il telefono.

const langTags: Record<string, string> = { en: "en-GB", it: "it-IT", es: "es-ES", fr: "fr-FR", de: "de-DE" };

// Le voci "compatte" di iOS/macOS sono robotiche: preferiamo quelle di qualità superiore
// (Premium/Enhanced/Siri), che l'utente può scaricare in Impostazioni → Accessibilità → Contenuto letto ad alta voce.
function quality(v: SpeechSynthesisVoice) {
  const n = v.name.toLowerCase();
  if (n.includes("premium")) return 3;
  if (n.includes("enhanced") || n.includes("migliorata") || n.includes("siri")) return 2;
  if (n.includes("compact") || n.includes("eloquence")) return 0;
  return 1;
}

function voiceFor(locale: string) {
  const tag = langTags[locale] ?? locale;
  const prefix = tag.slice(0, 2);
  // Solo voci locali (localService): quelle di rete inviano il testo a server esterni.
  const local = window.speechSynthesis
    .getVoices()
    .filter((v) => v.localService && v.lang.replace("_", "-").startsWith(prefix));
  local.sort((a, b) => quality(b) - quality(a) || Number(b.lang === tag) - Number(a.lang === tag));
  return local[0] ?? null;
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, locale: string) {
  if (!canSpeak()) return;
  const voice = voiceFor(locale);
  // Senza una voce locale non parliamo: alcune voci di rete inviano il testo a server esterni.
  if (!voice) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[\p{Extended_Pictographic}️]/gu, ""));
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = 1;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
