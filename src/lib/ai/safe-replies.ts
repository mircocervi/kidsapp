import "server-only";
import type { SafetyCategory } from "./safety";
import { helplineFor } from "@/config/helplines";

// Risposte fisse per i casi delicati: deterministiche, rivedibili dal DPO, mai generate dal modello.

type Copy = Record<string, (h: ReturnType<typeof helplineFor>) => string>;

const urgent: Copy = {
  en: (h) =>
    `Thank you for telling me. What you feel is really important, and it is not your fault. Please go now to a grown-up you trust — a parent, a teacher — and tell them what you told me. You can also call ${h.name} at ${h.phone}: they help children for free. If you are in danger right now, call ${h.emergency}. 💛`,
  it: (h) =>
    `Grazie di avermelo detto. Quello che senti è davvero importante e non è colpa tua. Per favore vai subito da un adulto di cui ti fidi — mamma, papà, una maestra — e raccontagli quello che hai detto a me. Puoi anche chiamare ${h.name} al ${h.phone}: aiutano i bambini gratis. Se sei in pericolo adesso, chiama il ${h.emergency}. 💛`,
};

const bullying: Copy = {
  en: () =>
    "I'm sorry this is happening. Nobody should treat you like that, and it is not your fault. This is really important: tell a grown-up you trust today — a parent or a teacher — so they can help you. You are not alone. 💛",
  it: () =>
    "Mi dispiace che ti stia succedendo. Nessuno dovrebbe trattarti così e non è colpa tua. È davvero importante: raccontalo oggi a un adulto di cui ti fidi — mamma, papà o la maestra — così ti possono aiutare. Non sei solo. 💛",
};

const grownUp: Copy = {
  en: () => "That's a question to talk about with a grown-up you trust, like a parent or a teacher. Shall we explore something else together? 🌟",
  it: () => "Questa è una domanda di cui parlare con un adulto di cui ti fidi, come mamma, papà o la maestra. Vuoi che esploriamo qualcos'altro insieme? 🌟",
};

const unavailable: Copy = {
  en: () => "Oops, I need a little break. Try again in a moment! 🙂",
  it: () => "Ops, ho bisogno di una piccola pausa. Riprova tra un attimo! 🙂",
};

const privacyReminder: Record<string, string> = {
  en: "🔒 Remember: things like your address, phone number or school are secret treasures — keep them private, even with me!",
  it: "🔒 Ricorda: indirizzo, numero di telefono o nome della scuola sono tesori segreti — tienili per te, anche con me!",
};

const pickCopy = (copy: Copy, locale: string) => copy[locale] ?? copy.en;

export function safeReply(category: SafetyCategory | "unavailable", locale: string, country?: string | null) {
  const h = helplineFor(country);
  if (category === "self_harm" || category === "abuse") return pickCopy(urgent, locale)(h);
  if (category === "bullying") return pickCopy(bullying, locale)(h);
  if (category === "unavailable") return pickCopy(unavailable, locale)(h);
  return pickCopy(grownUp, locale)(h);
}

export const privacyNote = (locale: string) => privacyReminder[locale] ?? privacyReminder.en;
