import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { appName, type Locale } from "@/config/app";

// I testi pubblici (informativa, pagina fiducia, spiegazione per bambini) vivono in
// docs/compliance/public così il DPO li rivede come file versionati, e l'app li mostra tali e quali.

export const publicDocs = ["trust-center", "privacy-policy", "children-notice"] as const;
export type PublicDoc = (typeof publicDocs)[number];

export const isPublicDoc = (v: string): v is PublicDoc => (publicDocs as readonly string[]).includes(v);

export async function readPublicDoc(doc: PublicDoc, locale: Locale) {
  const file = path.join(process.cwd(), "docs", "compliance", "public", `${doc}.${locale}.md`);
  const raw = await readFile(file, "utf8").catch(() =>
    readFile(file.replace(`.${locale}.md`, ".en.md"), "utf8"),
  );
  const isDraft = /BOZZA|DRAFT/.test(raw.slice(0, 300));
  const body = raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replaceAll("[NOME APP]", appName)
    .replaceAll("[APP NAME]", appName)
    .trim();
  return { body, isDraft };
}
