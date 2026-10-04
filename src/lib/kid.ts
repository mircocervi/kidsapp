import "server-only";
import { notFound } from "next/navigation";
import { requireFamily } from "@/lib/family";

/** Bambino della famiglia loggata (404 se l'id non è suo) + impostazioni del genitore. */
export async function requireChild(lang: string, childId: string) {
  const ctx = await requireFamily(lang);
  const child = ctx.children.find((c) => c.id === childId);
  if (!child) notFound();
  return { ...ctx, child, locale: (child.locale ?? lang) as typeof lang };
}
