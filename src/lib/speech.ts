"use client";

// Lettura ad alta voce con le voci del dispositivo (Web Speech API, speechSynthesis):
// il testo viene sintetizzato localmente, nessun audio lascia il tablet o il telefono.

const langTags: Record<string, string> = { en: "en-GB", it: "it-IT", es: "es-ES", fr: "fr-FR", de: "de-DE" };

function voiceFor(locale: string) {
  const voices = window.speechSynthesis.getVoices();
  const tag = langTags[locale] ?? locale;
  const prefix = tag.slice(0, 2);
  // preferiamo voci locali (localService) a quelle di rete
  return (
    voices.find((v) => v.lang === tag && v.localService) ??
    voices.find((v) => v.lang.startsWith(prefix) && v.localService) ??
    null
  );
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
  u.rate = 0.95;
  u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
