"use client";

import type { VoiceId } from "@/config/voices";

// Lettura ad alta voce. Prima scelta: voci naturali di Google Cloud TTS (endpoint UE) tramite /api/tts,
// che riceve solo il testo da leggere. Se il servizio non risponde: voci installate sul dispositivo.

const langTags: Record<string, string> = { en: "en-GB", it: "it-IT", es: "es-ES", fr: "fr-FR", de: "de-DE" };

let audio: HTMLAudioElement | null = null;
let current = 0; // ultima richiesta: le risposte arrivate in ritardo vengono ignorate
const cache = new Map<string, string>(); // testo → URL dell'audio già scaricato (solo in memoria)

function player() {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
  }
  return audio;
}

// iOS permette di far partire l'audio solo dopo un tocco dell'utente: al primo tocco
// "sblocchiamo" il player con un suono vuoto, poi può leggere anche le risposte che arrivano dopo.
const SILENCE = "/silence.mp3";

if (typeof window !== "undefined") {
  const unlock = () => {
    const a = player();
    a.src = SILENCE;
    a.play().then(() => a.pause()).catch(() => {});
    window.removeEventListener("pointerdown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
}

function clean(text: string) {
  return text
    .replace(/[\p{Extended_Pictographic}️]/gu, "")
    .replace(/[*_#`>]/g, "")
    .trim();
}

// --- voci del dispositivo (riserva) ---------------------------------------------------------

function quality(v: SpeechSynthesisVoice) {
  const n = v.name.toLowerCase();
  if (n.includes("premium")) return 3;
  if (n.includes("enhanced") || n.includes("migliorata") || n.includes("siri")) return 2;
  if (n.includes("compact") || n.includes("eloquence")) return 0;
  return 1;
}

function deviceVoice(locale: string) {
  const tag = langTags[locale] ?? locale;
  const prefix = tag.slice(0, 2);
  // Solo voci locali (localService): quelle di rete inviano il testo a server esterni.
  const local = window.speechSynthesis
    .getVoices()
    .filter((v) => v.localService && v.lang.replace("_", "-").startsWith(prefix));
  local.sort((a, b) => quality(b) - quality(a) || Number(b.lang === tag) - Number(a.lang === tag));
  return local[0] ?? null;
}

function speakOnDevice(text: string, locale: string) {
  if (!("speechSynthesis" in window)) return;
  const voice = deviceVoice(locale);
  if (!voice) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  window.speechSynthesis.speak(u);
}

// --- API pubblica ------------------------------------------------------------------------------

export function canSpeak() {
  return typeof window !== "undefined";
}

export async function speak(text: string, locale: string, voice: VoiceId = "narrator") {
  if (typeof window === "undefined") return;
  const input = clean(text);
  if (!input) return;
  const id = ++current;
  stopSpeaking();
  current = id;

  const key = `${voice}|${locale}|${input}`;
  let url = cache.get(key);
  if (!url) {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, locale, voice }),
      });
      if (!res.ok) throw new Error(String(res.status));
      url = URL.createObjectURL(await res.blob());
      cache.set(key, url);
    } catch {
      if (id === current) speakOnDevice(input, locale);
      return;
    }
  }
  if (id !== current) return;
  const a = player();
  a.src = url;
  a.play().catch(() => speakOnDevice(input, locale));
}

export function stopSpeaking() {
  current++;
  audio?.pause();
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
