// Paesi in cui il servizio è disponibile al lancio (UE/SEE + Svizzera + Regno Unito).
// Gli USA restano esclusi finché non è pronta la conformità COPPA (docs/compliance/coppa.md).
export const launchCountries = [
  "IT", "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU", "IE",
  "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK", "IS", "LI", "NO", "CH", "GB",
] as const;

export const isLaunchCountry = (c: string) => (launchCountries as readonly string[]).includes(c);

export function countryOptions(locale: string) {
  const names = new Intl.DisplayNames([locale], { type: "region" });
  return launchCountries
    .map((code) => ({ code, name: names.of(code) ?? code }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}
