// Numeri di aiuto per bambini, mostrati quando il bambino parla di autolesionismo o abusi.
// ⚠️ Da verificare periodicamente (vedi docs/compliance/safety-policy.md).

type Helpline = { name: string; phone: string; emergency: string };

const helplines: Record<string, Helpline> = {
  IT: { name: "Telefono Azzurro", phone: "19696", emergency: "112" },
  GB: { name: "Childline", phone: "0800 1111", emergency: "999" },
  IE: { name: "Childline", phone: "1800 66 66 66", emergency: "112" },
  US: { name: "988 Suicide & Crisis Lifeline", phone: "988", emergency: "911" },
  CH: { name: "Pro Juventute", phone: "147", emergency: "112" },
  DE: { name: "Nummer gegen Kummer", phone: "116 111", emergency: "112" },
  FR: { name: "Allô Enfance en Danger", phone: "119", emergency: "112" },
  ES: { name: "Fundación ANAR", phone: "900 20 20 10", emergency: "112" },
};

/** 116 111 è il numero armonizzato UE per l'infanzia; 112 il numero unico di emergenza. */
const fallback: Helpline = { name: "116 111", phone: "116 111", emergency: "112" };

export const helplineFor = (country: string | null | undefined) =>
  (country && helplines[country.toUpperCase()]) || fallback;
