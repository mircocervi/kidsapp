// Configurazione di prodotto modificabile dall'admin (via variabili d'ambiente su Vercel).

export const locales = ["en", "it"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const envDefault = process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en";
export const defaultLocale: Locale = isLocale(envDefault) ? envDefault : "en";

export const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Wondimo";

// Versione dell'informativa privacy: cambiarla obbliga il genitore a riaccettarla.
export const consentVersion = "2026-10-04";

export const chatRetentionDays = 90;
