import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/app";
import { countryOptions } from "@/config/countries";
import { avatarById } from "@/config/characters";
import { getDictionary } from "@/i18n";
import { requireParent } from "@/lib/family";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ChildForm } from "@/components/child-form";
import { InstallHint } from "@/components/install-hint";
import { acceptConsent, addChild, createPin } from "./actions";

export default async function Onboarding({ params, searchParams }: PageProps<"/[lang]/onboarding">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { error, step } = (await searchParams) as { error?: string; step?: string };
  const t = await getDictionary(lang);
  const { supabase, parent, user } = await requireParent(lang);

  const { data: pinRow } = await supabaseAdmin().from("parents").select("pin_hash").eq("id", user.id).single();
  const { data: children } = await supabase.from("children").select("id, nickname, avatar").order("created_at");

  const current = !parent.consent_at
    ? "consent"
    : !pinRow?.pin_hash
      ? "pin"
      : !children?.length || step === "children"
        ? "children"
        : "done";

  const steps = ["consent", "pin", "children", "done"];
  const progress = steps.indexOf(current) + 1;

  return (
    <main className="safe-area mx-auto flex min-h-dvh max-w-xl flex-col gap-6">
      <div className="flex gap-2 pt-2" aria-hidden>
        {steps.map((s, i) => (
          <span key={s} className={`h-2 flex-1 rounded-full ${i < progress ? "bg-brand" : "bg-line"}`} />
        ))}
      </div>

      {current === "consent" && (
        <section className="card flex flex-col gap-5 p-7">
          <h1 className="font-display text-3xl font-extrabold">{t.onboarding.consentTitle}</h1>
          <p className="text-ink-soft">{t.onboarding.consentText}</p>
          <form action={acceptConsent.bind(null, lang)} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 font-bold">
              {t.onboarding.country}
              <select name="country" className="field" required defaultValue={lang === "it" ? "IT" : ""}>
                <option value="" disabled>—</option>
                {countryOptions(lang).map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </label>
            {(["adult", "privacy", "childConsent", "aiConsent"] as const).map((k) => (
              <label key={k} className="flex items-start gap-3 rounded-2xl bg-cream p-4">
                <input type="checkbox" name={k} required className="mt-1 h-6 w-6 shrink-0 accent-brand" />
                <span>{t.onboarding[k]}</span>
              </label>
            ))}
            <Link href={`/${lang}/trust/privacy-policy`} target="_blank" className="text-brand underline">
              {t.onboarding.readPrivacy} ↗
            </Link>
            {error === "consent" && <p className="text-danger">{t.common.error}</p>}
            <button className="btn btn-primary">{t.common.continue}</button>
          </form>
        </section>
      )}

      {current === "pin" && (
        <section className="card flex flex-col gap-5 p-7">
          <h1 className="font-display text-3xl font-extrabold">🔐 {t.onboarding.pinTitle}</h1>
          <p className="text-ink-soft">{t.onboarding.pinText}</p>
          <form action={createPin.bind(null, lang)} className="flex flex-col gap-4">
            {(["pin", "confirm"] as const).map((name) => (
              <label key={name} className="flex flex-col gap-2 font-bold">
                {name === "pin" ? "PIN" : t.onboarding.pinConfirm}
                <input
                  name={name}
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  required
                  autoComplete="off"
                  className="field text-center font-display text-3xl tracking-[0.6em]"
                />
              </label>
            ))}
            {error === "pin" && <p className="text-danger">{t.onboarding.pinMismatch}</p>}
            <button className="btn btn-primary">{t.common.continue}</button>
          </form>
        </section>
      )}

      {current === "children" && (
        <section className="card flex flex-col gap-5 p-7">
          <h1 className="font-display text-3xl font-extrabold">{t.onboarding.childrenTitle}</h1>
          <p className="text-ink-soft">{t.onboarding.childrenText}</p>
          {!!children?.length && <ChildrenRow kids={children} />}
          <ChildForm
            action={addChild.bind(null, lang, `/${lang}/onboarding`)}
            t={t}
            submitLabel={t.onboarding.addChild}
          />
          {error === "child" && <p className="text-danger">{t.common.error}</p>}
        </section>
      )}

      {current === "done" && (
        <section className="card flex flex-col gap-5 p-7">
          <h1 className="font-display text-3xl font-extrabold">{t.onboarding.doneTitle}</h1>
          <ChildrenRow kids={children!} />
          <p className="text-ink-soft">{t.onboarding.doneText}</p>
          <InstallHint t={t.install} />
          <Link href={`/${lang}/play`} className="btn btn-coral">{t.onboarding.startPlaying} →</Link>
          <Link href={`/${lang}/onboarding?step=children`} className="btn btn-ghost">+ {t.onboarding.addAnother}</Link>
        </section>
      )}
    </main>
  );
}

function ChildrenRow({ kids }: { kids: { id: string; nickname: string; avatar: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {kids.map((c) => {
        const a = avatarById(c.avatar);
        return (
          <span key={c.id} className="flex items-center gap-2 rounded-full py-1 pr-4 pl-1 font-bold" style={{ background: a.color }}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-xl">{a.emoji}</span>
            {c.nickname}
          </span>
        );
      })}
    </div>
  );
}
