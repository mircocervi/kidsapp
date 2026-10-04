"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { avatars } from "@/config/characters";
import { grades } from "@/config/grades";
import { currentParent, supabaseAdmin } from "@/lib/supabase/server";
import { isUnlocked, isValidPin, lock, setUnlocked, verifyPin } from "@/lib/parent-gate";
import { newInviteCode, ownsChild } from "@/lib/friends";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 5;

/** Sessione del genitore con area sbloccata dal PIN: obbligatoria per ogni azione qui sotto. */
async function unlocked(lang: string) {
  const s = await currentParent();
  if (!s) redirect(`/${lang}/login`);
  if (!(await isUnlocked(s.user.id))) redirect(`/${lang}/parent`);
  return s;
}

export async function unlockParent(lang: string, pin: string): Promise<"ok" | "wrong" | "locked"> {
  const s = await currentParent();
  if (!s) redirect(`/${lang}/login`);
  const admin = supabaseAdmin();
  const { data } = await admin
    .from("parents")
    .select("pin_hash, pin_failed_attempts, pin_locked_until")
    .eq("id", s.user.id)
    .single();
  if (!data) return "wrong";
  if (data.pin_locked_until && new Date(data.pin_locked_until) > new Date()) return "locked";

  if (isValidPin(pin) && (await verifyPin(pin, data.pin_hash))) {
    await admin.from("parents").update({ pin_failed_attempts: 0, pin_locked_until: null }).eq("id", s.user.id);
    await setUnlocked(s.user.id);
    return "ok";
  }
  const attempts = data.pin_failed_attempts + 1;
  const lockNow = attempts >= MAX_ATTEMPTS;
  await admin
    .from("parents")
    .update({
      pin_failed_attempts: lockNow ? 0 : attempts,
      pin_locked_until: lockNow ? new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString() : null,
    })
    .eq("id", s.user.id);
  return lockNow ? "locked" : "wrong";
}

export async function lockParent(lang: string) {
  await lock();
  redirect(`/${lang}/play`);
}

export async function signOut(lang: string) {
  const s = await currentParent();
  await lock();
  await s?.supabase.auth.signOut();
  redirect(`/${lang}`);
}

const settingsSchema = z.object({
  chat_mode: z.enum(["socratic", "direct"]),
  daily_limit_minutes: z.union([z.literal(""), z.coerce.number().int().min(5).max(240)]),
  quiet_hours_start: z.union([z.literal(""), z.string().regex(/^\d{2}:\d{2}$/)]),
  quiet_hours_end: z.union([z.literal(""), z.string().regex(/^\d{2}:\d{2}$/)]),
});

export async function updateSettings(lang: string, form: FormData) {
  const { supabase, user } = await unlocked(lang);
  const parsed = settingsSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) redirect(`/${lang}/parent?error=settings`);
  const v = parsed.data;
  await supabase
    .from("parents")
    .update({
      chat_mode: v.chat_mode,
      daily_limit_minutes: v.daily_limit_minutes === "" ? null : v.daily_limit_minutes,
      quiet_hours_start: v.quiet_hours_start || null,
      quiet_hours_end: v.quiet_hours_end || null,
    })
    .eq("id", user.id);
  revalidatePath(`/${lang}/parent`);
  redirect(`/${lang}/parent?saved=1`);
}

export async function markAlertSeen(lang: string, alertId: string) {
  const { supabase } = await unlocked(lang);
  await supabase.from("safety_alerts").update({ seen_at: new Date().toISOString() }).eq("id", alertId);
  revalidatePath(`/${lang}/parent`);
}

const childSchema = z.object({
  nickname: z.string().trim().min(1).max(24),
  grade: z.enum(grades),
  avatar: z.enum(avatars.map((a) => a.id) as [string, ...string[]]),
});

export async function updateChild(lang: string, childId: string, form: FormData) {
  const { supabase } = await unlocked(lang);
  const parsed = childSchema.safeParse(Object.fromEntries(form));
  if (parsed.success) await supabase.from("children").update(parsed.data).eq("id", childId);
  revalidatePath(`/${lang}/parent/${childId}`);
  redirect(`/${lang}/parent/${childId}?saved=1`);
}

export async function setChatEnabled(lang: string, childId: string, form: FormData) {
  const { supabase } = await unlocked(lang);
  await supabase.from("children").update({ chat_enabled: form.get("chat_enabled") === "on" }).eq("id", childId);
  revalidatePath(`/${lang}/parent/${childId}`);
  redirect(`/${lang}/parent/${childId}?saved=1`);
}

const confirmed = (form: FormData) => ["DELETE", "ELIMINA"].includes(String(form.get("confirm") ?? "").trim().toUpperCase());

export async function deleteChats(lang: string, childId: string, form: FormData) {
  const { supabase, user } = await unlocked(lang);
  if (confirmed(form)) {
    await supabase.from("chat_messages").delete().eq("child_id", childId);
    await supabase.from("safety_alerts").delete().eq("child_id", childId);
    // Anche i messaggi che il proprio figlio ha scritto agli amici (verificato: il figlio è del genitore).
    if (await ownsChild(user.id, childId)) {
      await supabaseAdmin().from("friend_messages").delete().eq("from_child", childId);
    }
  }
  redirect(`/${lang}/parent/${childId}`);
}

export async function deleteChild(lang: string, childId: string, form: FormData) {
  const { supabase } = await unlocked(lang);
  if (!confirmed(form)) redirect(`/${lang}/parent/${childId}`);
  // le chat, gli avvisi e i risultati vengono cancellati a cascata
  await supabase.from("children").delete().eq("id", childId);
  redirect(`/${lang}/parent`);
}

export async function deleteAccount(lang: string, form: FormData) {
  const { user } = await unlocked(lang);
  if (!confirmed(form)) redirect(`/${lang}/parent`);
  // Cancellando l'utente di auth si cancella a cascata tutta la famiglia (parents → children → …).
  await supabaseAdmin().auth.admin.deleteUser(user.id);
  await lock();
  redirect(`/${lang}`);
}

// --- Amici: la regola d'oro (approvazione di entrambi i genitori) ---------------------------

export async function createInvite(lang: string, form: FormData) {
  const { user } = await unlocked(lang);
  const childId = String(form.get("childId") ?? "");
  if (!(await ownsChild(user.id, childId))) redirect(`/${lang}/parent?friends=invalid#friends`);
  const admin = supabaseAdmin();
  // Un solo codice valido per figlio alla volta.
  await admin.from("friend_invites").delete().eq("child_id", childId).is("used_at", null);
  await admin.from("friend_invites").insert({ code: newInviteCode(), parent_id: user.id, child_id: childId });
  revalidatePath(`/${lang}/parent`);
  redirect(`/${lang}/parent#friends`);
}

export async function redeemInvite(lang: string, form: FormData) {
  const { user } = await unlocked(lang);
  const code = String(form.get("code") ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const childId = String(form.get("childId") ?? "");
  const back = (result: string): never => redirect(`/${lang}/parent?friends=${result}#friends`);
  if (!(await ownsChild(user.id, childId))) back("invalid");

  const admin = supabaseAdmin();
  const { data: invite } = await admin
    .from("friend_invites")
    .select("id, parent_id, child_id, expires_at, used_at")
    .eq("code", code)
    .maybeSingle();
  if (!invite || invite.used_at || new Date(invite.expires_at) < new Date()) back("invalid");
  if (invite!.parent_id === user.id) back("same");

  const pair = [invite!.child_id, childId];
  const { data: existing } = await admin
    .from("friendships")
    .select("id, status")
    .or(`and(child_a.eq.${pair[0]},child_b.eq.${pair[1]}),and(child_a.eq.${pair[1]},child_b.eq.${pair[0]})`)
    .maybeSingle();

  if (existing?.status === "active") back("already");
  if (existing) {
    // Amicizia chiusa in passato: con un nuovo codice entrambi i genitori la riattivano.
    await admin.from("friendships").update({ status: "active", blocked_by: null }).eq("id", existing.id);
  } else {
    await admin.from("friendships").insert({
      child_a: invite!.child_id,
      parent_a: invite!.parent_id,
      child_b: childId,
      parent_b: user.id,
    });
  }
  await admin.from("friend_invites").update({ used_at: new Date().toISOString() }).eq("id", invite!.id);
  revalidatePath(`/${lang}/parent`);
  back("connected");
}

export async function endFriendship(lang: string, friendshipId: string) {
  const { user } = await unlocked(lang);
  // Chiusa, non cancellata: entrambi i genitori possono ancora leggere i messaggi fino alla scadenza (90 giorni).
  await supabaseAdmin()
    .from("friendships")
    .update({ status: "blocked", blocked_by: null })
    .eq("id", friendshipId)
    .or(`parent_a.eq.${user.id},parent_b.eq.${user.id}`);
  revalidatePath(`/${lang}/parent`);
  redirect(`/${lang}/parent#friends`);
}
