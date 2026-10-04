import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/app";
import { avatarById, mascotById } from "@/config/characters";
import { levelOf } from "@/config/grades";
import { gamesForLevel } from "@/games/registry";
import { getDictionary } from "@/i18n";
import { fmt } from "@/i18n/format";
import { requireChild } from "@/lib/kid";
import { KidGate } from "@/components/kid-gate";
import { MascotPicker } from "./mascot-picker";

export default async function KidHome({ params }: PageProps<"/[lang]/play/[childId]">) {
  const { lang, childId } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const { child, parent, supabase } = await requireChild(lang, childId);

  const gate = {
    childId,
    lang,
    dailyLimitMinutes: parent.daily_limit_minutes,
    quietStart: parent.quiet_hours_start,
    quietEnd: parent.quiet_hours_end,
    texts: { timeUp: t.kid.timeUp, quietHours: t.kid.quietHours, parentArea: t.kid.parentArea },
  };

  const mascot = mascotById(child.mascot);
  if (!mascot) {
    return (
      <KidGate {...gate}>
        <main className="safe-area no-select flex min-h-dvh items-center justify-center">
          <MascotPicker lang={lang} childId={childId} title={t.kid.chooseMascot} intro={t.kid.mascotIntro} />
        </main>
      </KidGate>
    );
  }

  const { data: results } = await supabase.from("activity_results").select("correct").eq("child_id", childId);
  const stars = (results ?? []).reduce((sum, r) => sum + r.correct, 0);
  const avatar = avatarById(child.avatar);
  const games = gamesForLevel(levelOf(child.grade));

  return (
    <KidGate {...gate}>
      <main className="safe-area no-select mx-auto flex min-h-dvh max-w-5xl flex-col gap-6">
        <header className="flex items-center justify-between gap-3">
          <Link href={`/${lang}/play`} className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-4xl" style={{ background: avatar.color }}>
              {avatar.emoji}
            </span>
            <span className="font-display text-2xl font-extrabold">{fmt(t.kid.hello, { name: child.nickname })}</span>
          </Link>
          <span className="flex items-center gap-2 rounded-full bg-paper px-4 py-2 font-display text-xl font-bold shadow-[inset_0_0_0_2px_var(--color-line)]">
            ⭐ {stars}
          </span>
        </header>

        {child.chat_enabled && (
          <Link
            href={`/${lang}/play/${childId}/chat`}
            className="card flex items-center gap-5 p-5 transition active:scale-[0.98] sm:p-7"
            style={{ background: mascot.color }}
          >
            <span className="animate-bob text-8xl sm:text-9xl">{mascot.emoji}</span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-3xl font-extrabold sm:text-4xl">{fmt(t.kid.chat, { mascot: mascot.name })}</span>
              <span className="text-lg opacity-80">💬</span>
            </span>
          </Link>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-extrabold">🎮 {t.kid.games}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {games.map((g, i) => (
              <Link
                key={g.id}
                href={`/${lang}/play/${childId}/games/${g.id}`}
                className="animate-pop flex aspect-square flex-col items-center justify-center gap-2 rounded-[2rem] p-3 text-center shadow-[0_5px_0_rgba(0,0,0,0.12)] transition active:scale-95"
                style={{ background: g.color, animationDelay: `${i * 50}ms` }}
              >
                <span className="text-6xl sm:text-7xl">{g.icon}</span>
                <span className="font-display text-lg leading-tight font-bold sm:text-xl">{g.title[lang]}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </KidGate>
  );
}
