import "server-only";
import { redirect } from "next/navigation";
import { currentParent } from "@/lib/supabase/server";

/** Genitore loggato con la sua riga `parents`; altrimenti rimanda al login. */
export async function requireParent(lang: string) {
  const session = await currentParent();
  if (!session) redirect(`/${lang}/login`);
  const { data: parent } = await session.supabase
    .from("parents")
    .select("id, locale, country, consent_at, consent_version, chat_mode, daily_limit_minutes, quiet_hours_start, quiet_hours_end")
    .eq("id", session.user.id)
    .single();
  if (!parent) redirect(`/${lang}/login`);
  return { ...session, parent };
}

/** Come requireParent, ma pretende onboarding completato (consenso + PIN + almeno un figlio). */
export async function requireFamily(lang: string) {
  const ctx = await requireParent(lang);
  if (!ctx.parent.consent_at) redirect(`/${lang}/onboarding`);
  const { data: children } = await ctx.supabase
    .from("children")
    .select("id, nickname, avatar, grade, mascot, locale, chat_enabled")
    .order("created_at");
  if (!children?.length) redirect(`/${lang}/onboarding`);
  return { ...ctx, children };
}
