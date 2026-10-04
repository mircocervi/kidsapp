// Rimuove i dati personali più comuni PRIMA che il testo lasci il server o finisca nel database.
// È un filtro euristico: riduce il rischio, non lo azzera. Il prompt di sistema chiede
// comunque al bot di non sollecitare mai dati personali.

const patterns: { kind: string; re: RegExp; label: string }[] = [
  { kind: "email", re: /[\w.+-]+@[\w-]+\.[\w.-]+/g, label: "[email]" },
  { kind: "url", re: /\bhttps?:\/\/\S+|\bwww\.\S+/gi, label: "[link]" },
  // numeri di telefono: 7+ cifre con spazi, punti o trattini, prefisso + opzionale
  { kind: "phone", re: /\+?\d[\d\s.\-/]{6,}\d/g, label: "[phone]" },
  // indirizzi: via/piazza/street… seguiti da nome e numero civico
  {
    kind: "address",
    re: /\b(via|viale|piazza|corso|vicolo|strada|street|st\.|road|rd\.|avenue|ave\.|lane|calle|rue)\s+[\p{L}' .]{2,40}?\s*,?\s*\d{1,4}\w?\b/giu,
    label: "[address]",
  },
];

export function redactPersonalData(text: string) {
  let clean = text;
  const found = new Set<string>();
  for (const { kind, re, label } of patterns) {
    clean = clean.replace(re, (match) => {
      // "125 - 37" o "1000 / 25" sono conti, non telefoni: servono almeno 8 cifre e nessun operatore isolato.
      if (kind === "phone" && (match.replace(/\D/g, "").length < 8 || /\s[-/]\s/.test(match))) return match;
      found.add(kind);
      return label;
    });
  }
  return { clean, found: [...found] };
}
