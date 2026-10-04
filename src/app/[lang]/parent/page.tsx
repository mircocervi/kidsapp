import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/app";
import { avatarById } from "@/config/characters";
import { getDictionary } from "@/i18n";
import { daysAgo, parentArea } from "@/lib/parent-area";
import { PinPad } from "./pin-pad";
import { deleteAccount, lockParent, markAlertSeen, signOut, updateSettings } from "./actions";

export default async function ParentHome({ params, searchParams }: PageProps<"/[lang]/parent">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { saved } = (await searchParams) as { saved?: string };
  const t = await getDictionary(lang);
  const { supabase, parent, children, unlocked } = await parentArea(lang);

  if (!unlocked) {
    return <PinPad lang={lang} t={{ title: t.parent.title, enterPin: t.parent.enterPin, wrongPin: t.parent.wrongPin, locked: t.parent.locked, back: t.common.back }} />;
  }

  const since = daysAgo(7);
  const [{ data: alerts }, { data: results }, { data: questions }] = await Promise.all([
    supabase.from("safety_alerts").select("id, child_id, category, severity, seen_at, created_at").order("created_at", { ascending: false }).limit(20),
    supabase.from("activity_results").select("child_id, correct, total, duration_seconds").gte("created_at", since),
    supabase.from("chat_messages").select("child_id").eq("role", "child").gte("created_at", since),
  ]);

  const stats = (childId: string) => {
    const r = (results ?? []).filter((x) => x.child_id === childId);
    const total = r.reduce((s, x) => s + x.total, 0);
    return {
      minutes: Math.round(r.reduce((s, x) => s + x.duration_seconds, 0) / 60),
      accuracy: total ? Math.round((r.reduce((s, x) => s + x.correct, 0) / total) * 100) : null,
      questions: (questions ?? []).filter((q) => q.child_id === childId).length,
    };
  };
  // Prima gli avvisi non visti, e tra questi gli urgenti.
  const rank = { urgent: 0, warning: 1, info: 2 } as const;
  const sortedAlerts = [...(alerts ?? [])].sort(
    (a, b) => Number(!!a.seen_at) - Number(!!b.seen_at) || rank[a.severity] - rank[b.severity],
  );
  const nameOf = (id: string) => children.find((c) => c.id === id)?.nickname ?? "";

  return (
    <main className="safe-area mx-auto flex min-h-dvh max-w-5xl flex-col gap-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold">👨‍👩‍👧 {t.parent.title}</h1>
        <div className="flex gap-2">
          <form action={lockParent.bind(null, lang)}><button className="btn btn-ghost !min-h-11 !text-base">🔒 {t.parent.lock}</button></form>
          <form action={signOut.bind(null, lang)}><button className="btn btn-ghost !min-h-11 !text-base">{t.parent.logout}</button></form>
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-bold">🔔 {t.parent.alerts}</h2>
        {!sortedAlerts.length ? (
          <p className="card p-5 text-ink-soft">{t.parent.noAlerts}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {sortedAlerts.map((a) => (
              <li
                key={a.id}
                className={`card flex flex-wrap items-center justify-between gap-3 p-5 ${a.seen_at ? "opacity-60" : ""} ${a.severity === "urgent" && !a.seen_at ? "ring-4 ring-danger" : ""}`}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-bold">
                    {a.severity === "urgent" ? "🚨" : a.severity === "warning" ? "⚠️" : "ℹ️"} {nameOf(a.child_id)} · {t.parent.alertCategories[a.category]}
                  </span>
                  <span className="text-sm text-ink-soft">{new Date(a.created_at).toLocaleString(lang)}</span>
                  {a.severity === "urgent" && <span className="text-sm">{t.parent.urgentHint}</span>}
                </div>
                <div className="flex gap-2">
                  <Link href={`/${lang}/parent/${a.child_id}#chat`} className="btn btn-ghost !min-h-11 !text-base">{t.parent.transcripts}</Link>
                  {!a.seen_at && (
                    <form action={markAlertSeen.bind(null, lang, a.id)}><button className="btn btn-primary !min-h-11 !text-base">{t.parent.markSeen}</button></form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">{t.parent.children} · <span className="text-ink-soft">{t.parent.overview}</span></h2>
          <Link href={`/${lang}/onboarding?step=children`} className="btn btn-ghost !min-h-11 !text-base">+ {t.parent.addChild}</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {children.map((c) => {
            const a = avatarById(c.avatar);
            const s = stats(c.id);
            return (
              <Link key={c.id} href={`/${lang}/parent/${c.id}`} className="card flex flex-col gap-4 p-5 transition active:scale-[0.99]">
                <span className="flex items-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-4xl" style={{ background: a.color }}>{a.emoji}</span>
                  <span className="flex flex-col">
                    <span className="font-display text-2xl font-bold">{c.nickname}</span>
                    <span className="text-sm text-ink-soft">{t.grades[c.grade]}{c.chat_enabled ? "" : " · 💬 off"}</span>
                  </span>
                </span>
                <span className="grid grid-cols-3 gap-2 text-center">
                  <Stat value={s.minutes} label={t.parent.minutesPlayed} />
                  <Stat value={s.questions} label={t.parent.questions} />
                  <Stat value={s.accuracy === null ? "—" : `${s.accuracy}%`} label={t.parent.accuracy} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="card flex flex-col gap-5 p-6">
        <h2 className="font-display text-2xl font-bold">⚙️ {t.parent.settings}</h2>
        {saved && <p className="rounded-2xl bg-mint/15 p-3 text-mint-dark">✔ {t.common.saved}</p>}
        <form action={updateSettings.bind(null, lang)} className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-bold">{t.parent.chatMode}</legend>
            {(["socratic", "direct"] as const).map((m) => (
              <label key={m} className="flex items-center gap-3 rounded-2xl bg-cream p-4">
                <input type="radio" name="chat_mode" value={m} defaultChecked={parent.chat_mode === m} className="h-5 w-5 accent-brand" />
                {m === "socratic" ? t.parent.chatModeSocratic : t.parent.chatModeDirect}
              </label>
            ))}
          </fieldset>
          <label className="flex flex-col gap-2 font-bold">
            {t.parent.dailyLimit}
            <input name="daily_limit_minutes" type="number" min={5} max={240} step={5} placeholder={t.parent.noLimit} defaultValue={parent.daily_limit_minutes ?? ""} className="field" />
          </label>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-bold">🌙 {t.parent.quietHours}</legend>
            <div className="flex flex-wrap items-center gap-3">
              {t.parent.from}
              <input name="quiet_hours_start" type="time" defaultValue={parent.quiet_hours_start?.slice(0, 5) ?? ""} className="field !w-36" />
              {t.parent.to}
              <input name="quiet_hours_end" type="time" defaultValue={parent.quiet_hours_end?.slice(0, 5) ?? ""} className="field !w-36" />
            </div>
          </fieldset>
          <button className="btn btn-primary w-fit">{t.common.save}</button>
        </form>
      </section>

      <section className="card flex flex-col gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">🗂️ {t.parent.yourData}</h2>
        <p className="text-ink-soft">{t.parent.retention}</p>
        {/* download da route API: un normale link, non una navigazione */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/parent/export" className="btn btn-ghost w-fit">⬇️ {t.parent.export}</a>
        <Link href={`/${lang}/trust`} className="text-brand underline">🛡️ {t.common.trust}</Link>
        <details className="rounded-2xl bg-cream p-4">
          <summary className="cursor-pointer font-bold text-danger">{t.parent.deleteAccount}</summary>
          <form action={deleteAccount.bind(null, lang)} className="mt-4 flex flex-col gap-3">
            <p>{t.parent.confirmDelete}</p>
            <input name="confirm" className="field" autoComplete="off" />
            <button className="btn w-fit bg-danger text-white">{t.common.delete}</button>
          </form>
        </details>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <span className="flex flex-col rounded-2xl bg-cream p-3">
      <span className="font-display text-2xl font-extrabold">{value}</span>
      <span className="text-xs text-ink-soft">{label}</span>
    </span>
  );
}
