"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { consentVersion, isLocale } from "@/config/app";
import { isLaunchCountry } from "@/config/countries";
import { avatars } from "@/config/characters";
import { grades } from "@/config/grades";
import { currentParent, supabaseAdmin } from "@/lib/supabase/server";
import { hashPin, isValidPin, setUnlocked } from "@/lib/parent-gate";

async function session(lang: string) {
  const s = await currentParent();
  if (!s) redirect(`/${lang}/login`);
  return s;
}

export async function acceptConsent(lang: string, form: FormData) {
  const { user } = await session(lang);
  const country = String(form.get("country") ?? "");
  // aiConsent: consenso del genitore all'uso di sistemi di IA da parte dei minori di 14 anni (L. 132/2025, art. 4 c. 4).
  const ok = form.get("adult") === "on" && form.get("privacy") === "on" && form.get("childConsent") === "on" && form.get("aiConsent") === "on";
  if (!ok || !isLaunchCountry(country)) redirect(`/${lang}/onboarding?error=consent`);
  const now = new Date().toISOString();
  // Scrittura con service role: consenso e PIN non sono modificabili dal client.
  await supabaseAdmin()
    .from("parents")
    .update({
      consent_at: now,
      consent_version: consentVersion,
      adult_confirmed_at: now,
      country,
      locale: isLocale(lang) ? lang : "en",
    })
    .eq("id", user.id);
  redirect(`/${lang}/onboarding`);
}

export async function createPin(lang: string, form: FormData) {
  const { user } = await session(lang);
  const pin = String(form.get("pin") ?? "");
  if (!isValidPin(pin) || pin !== String(form.get("confirm") ?? "")) redirect(`/${lang}/onboarding?error=pin`);
  const admin = supabaseAdmin();
  const { data } = await admin.from("parents").select("pin_hash").eq("id", user.id).single();
  // Un PIN esistente non si sovrascrive da qui (sul dispositivo del bambino la sessione è aperta).
  if (data?.pin_hash) redirect(`/${lang}/onboarding`);
  await admin.from("parents").update({ pin_hash: await hashPin(pin) }).eq("id", user.id);
  await setUnlocked(user.id);
  redirect(`/${lang}/onboarding`);
}

const childSchema = z.object({
  nickname: z.string().trim().min(1).max(24),
  grade: z.enum(grades),
  avatar: z.enum(avatars.map((a) => a.id) as [string, ...string[]]),
});

export async function addChild(lang: string, returnTo: string, form: FormData) {
  const { supabase, user } = await session(lang);
  const parsed = childSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}error=child`);
  await supabase.from("children").insert({ ...parsed.data, parent_id: user.id });
  redirect(returnTo.replace(/[?&]error=child/, ""));
}
