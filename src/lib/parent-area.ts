import "server-only";
import { requireFamily } from "@/lib/family";
import { isUnlocked } from "@/lib/parent-gate";

/** Contesto dell'area genitore; `unlocked` è false finché non si inserisce il PIN. */
export async function parentArea(lang: string) {
  const ctx = await requireFamily(lang);
  return { ...ctx, unlocked: await isUnlocked(ctx.user.id) };
}

export const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
