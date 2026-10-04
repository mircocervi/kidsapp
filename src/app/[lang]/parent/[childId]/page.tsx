import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/config/app";
import { avatarById } from "@/config/characters";
import { getDictionary } from "@/i18n";
import { parentArea } from "@/lib/parent-area";
import { ChildForm } from "@/components/child-form";
import { deleteChats, deleteChild, setChatEnabled, updateChild } from "../actions";

export default async function ParentChild({ params, searchParams }: PageProps<"/[lang]/parent/[childId]">) {
  const { lang, childId } = await params;
  if (!isLocale(lang)) notFound();
  const { saved } = (await searchParams) as { saved?: string };
  const t = await getDictionary(lang);
  const { supabase, children, unlocked } = await parentArea(lang);
  if (!unlocked) redirect(`/${lang}/parent`);
  const child = children.find((c) => c.id === childId);
  if (!child) notFound();

  const [{ data: messages }, { data: results }] = await Promise.all([
    supabase
      .from("chat_messages")
      .select("id, role, content, flagged, flag_category, created_at")
      .eq("child_id", childId)
      .order("created_at", { ascending: false })
      .limit(300),
    supabase.from("activity_results").select("subject, correct, total").eq("child_id", childId),
  ]);

  const bySubject = Object.entries(
    (results ?? []).reduce<Record<string, { correct: number; total: number; rounds: number }>>((acc, r) => {
      const s = (acc[r.subject] ??= { correct: 0, total: 0, rounds: 0 });
      s.correct += r.correct;
      s.total += r.total;
      s.rounds += 1;
      return acc;
    }, {}),
  );

  // Chat raggruppate per giorno, dal più recente; messaggi in ordine cronologico nel giorno.
  const days = new Map<string, NonNullable<typeof messages>>();
  for (const m of [...(messages ?? [])].reverse()) {
    const day = new Date(m.created_at).toLocaleDateString(lang, { weekday: "long", day: "numeric", month: "long" });
    days.set(day, [...(days.get(day) ?? []), m]);
  }
  const a = avatarById(child.avatar);
  const subjects = t.games.subjects as Record<string, string>;

  return (
    <main className="safe-area mx-auto flex min-h-dvh max-w-4xl flex-col gap-8">
      <header className="flex items-center gap-4">
        <Link href={`/${lang}/parent`} className="btn btn-ghost !min-h-12 !w-12 !px-0 text-2xl">←</Link>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-4xl" style={{ background: a.color }}>{a.emoji}</span>
        <div>
          <h1 className="font-display text-3xl font-extrabold">{child.nickname}</h1>
          <p className="text-ink-soft">{t.grades[child.grade]}</p>
        </div>
      </header>
      {saved && <p className="rounded-2xl bg-mint/15 p-3 text-mint-dark">✔ {t.common.saved}</p>}

      <section className="card flex flex-col gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">📈 {t.parent.progress}</h2>
        {bySubject.length === 0 ? (
          <p className="text-ink-soft">—</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {bySubject.map(([subject, s]) => {
              const pct = Math.round((s.correct / s.total) * 100);
              return (
                <li key={subject} className="flex flex-col gap-1">
                  <span className="flex justify-between font-bold"><span>{subjects[subject] ?? subject}</span><span>{pct}% · {s.rounds}×</span></span>
                  <span className="h-3 overflow-hidden rounded-full bg-cream"><span className="block h-full rounded-full bg-mint" style={{ width: `${pct}%` }} /></span>
                </li>
              );
            })}
          </ul>
        )}
        <p className="text-sm text-ink-soft">ℹ️ {t.parent.suggestion}</p>
      </section>

      <section id="chat" className="card flex flex-col gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">💬 {t.parent.transcripts}</h2>
        <form action={setChatEnabled.bind(null, lang, childId)} className="flex flex-wrap items-center gap-3 rounded-2xl bg-cream p-4">
          <label className="flex items-center gap-3 font-bold">
            <input type="checkbox" name="chat_enabled" defaultChecked={child.chat_enabled} className="h-6 w-6 accent-brand" />
            {t.parent.chatEnabled}
          </label>
          <button className="btn btn-ghost !min-h-10 !text-sm">{t.common.save}</button>
        </form>
        {days.size === 0 ? (
          <p className="text-ink-soft">{t.parent.noChats}</p>
        ) : (
          [...days.entries()].reverse().map(([day, msgs]) => (
            <details key={day} className="rounded-2xl border-2 border-line p-4" open={msgs.some((m) => m.flagged)}>
              <summary className="cursor-pointer font-bold capitalize">
                {day} · {msgs.filter((m) => m.role === "child").length} ❓ {msgs.some((m) => m.flagged) ? "⚠️" : ""}
              </summary>
              <ul className="mt-3 flex flex-col gap-2">
                {msgs.map((m) => (
                  <li
                    key={m.id}
                    className={`rounded-2xl px-4 py-2 whitespace-pre-wrap ${m.role === "child" ? "self-end bg-brand-soft" : "bg-cream"} ${m.flagged ? "ring-2 ring-coral" : ""}`}
                  >
                    <span className="mr-2 text-xs text-ink-soft">
                      {m.role === "child" ? a.emoji : "🤖"} {new Date(m.created_at).toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" })}
                      {m.flag_category ? ` · ⚠️ ${t.parent.alertCategories[m.flag_category]}` : ""}
                    </span>
                    <br />
                    {m.content}
                  </li>
                ))}
              </ul>
            </details>
          ))
        )}
        <p className="text-sm text-ink-soft">{t.parent.retention}</p>
      </section>

      <section className="card flex flex-col gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">✏️ {t.parent.editChild}</h2>
        <ChildForm
          action={updateChild.bind(null, lang, childId)}
          t={t}
          submitLabel={t.common.save}
          defaults={{ nickname: child.nickname, grade: child.grade, avatar: child.avatar }}
        />
      </section>

      <section className="card flex flex-col gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">🗂️ {t.parent.yourData}</h2>
        {[
          { label: t.parent.deleteChats, action: deleteChats.bind(null, lang, childId) },
          { label: t.parent.deleteChild, action: deleteChild.bind(null, lang, childId) },
        ].map((d) => (
          <details key={d.label} className="rounded-2xl bg-cream p-4">
            <summary className="cursor-pointer font-bold text-danger">{d.label}</summary>
            <form action={d.action} className="mt-4 flex flex-col gap-3">
              <p>{t.parent.confirmDelete}</p>
              <input name="confirm" className="field" autoComplete="off" />
              <button className="btn w-fit bg-danger text-white">{t.common.delete}</button>
            </form>
          </details>
        ))}
      </section>
    </main>
  );
}
