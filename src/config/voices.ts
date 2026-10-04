// Voci di Google Cloud Text-to-Speech (Chirp 3 HD, endpoint UE). Una per mascotte + narratore dei giochi.
// Il nome completo è `${lingua}-Chirp3-HD-${voce}`: le stesse voci esistono in tutte le lingue supportate.

export const voiceLangs: Record<string, string> = { it: "it-IT", en: "en-GB" };

export const voiceIds = {
  narrator: "Sulafat", // calda, per i giochi
  pip: "Sadaltager", // il gufo saggio
  zuri: "Puck", // il draghetto allegro
  bo: "Achird", // il robottino amichevole
  luna: "Leda", // la gattina esploratrice
} as const;

export type VoiceId = keyof typeof voiceIds;

export const isVoiceId = (v: string): v is VoiceId => v in voiceIds;

export function googleVoiceName(locale: string, voice: VoiceId) {
  const lang = voiceLangs[locale] ?? voiceLangs.en;
  return { languageCode: lang, name: `${lang}-Chirp3-HD-${voiceIds[voice]}` };
}
