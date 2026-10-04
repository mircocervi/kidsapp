import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/app";
import { avatarById } from "@/config/characters";
import { gameById } from "@/games/registry";
import { getDictionary } from "@/i18n";
import { fmt } from "@/i18n/format";
import { requireChild } from "@/lib/kid";
import { friendsActivity, friendsOf, splitChallenges } from "@/lib/friends";
import { KidGate } from "@/components/kid-gate";

export default async function KidFriends({ params }: PageProps<"/[lang]/play/[childId]/friends">) {
  const { lang, childId } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const f = t.kid.friends;
  const { parent } = await requireChild(lang, childId);
  const [friends, { challenges, unreadBy }] = await Promise.all([friendsOf(childId), friendsActivity(childId)]);
  const active = friends.filter((x) => x.status === "active");
  const nameOf = (friendshipId: string) => friends.find((x) => x.friendshipId === friendshipId)?.friend.nickname ?? "";
  const { toPlay, waiting, results } = splitChallenges(challenges, childId);

  return (
    <KidGate
      childId={childId}
      lang={lang}
      dailyLimitMinutes={parent.daily_limit_minutes}
      quietStart={parent.quiet_hours_start}
      quietEnd={parent.quiet_hours_end}
      texts={{ timeUp: t.kid.timeUp, quietHours: t.kid.quietHours, parentArea: t.kid.parentArea }}
    >
      <main className="safe-area no-select mx-auto flex min-h-dvh max-w-4xl flex-col gap-6">
        <header className="flex items-center gap-4">
          <Link href={`/${lang}/play/${childId}`} className="btn btn-ghost !min-h-12 !w-12 !px-0 text-2xl" aria-label={t.common.back}>←</Link>
          <h1 className="font-display text-3xl font-extrabold">🤝 {f.title}</h1>
        </header>

        {toPlay.map((c) => {
          const game = gameById(c.game_id);
          return (
            <Link
              key={c.id}
              href={`/${lang}/play/${childId}/games/${c.game_id}?challenge=${c.id}`}
              className="animate-pop card flex items-center justify-between gap-4 bg-sun! p-5"
            >
              <span className="flex items-center gap-3 font-display text-xl font-bold">
                <span className="text-4xl">🏁</span>
                {fmt(f.challengedYou, { name: nameOf(c.friendship_id), game: game?.title[lang] ?? "" })}
              </span>
              <span className="btn btn-coral !min-h-12">{f.play}</span>
            </Link>
          );
        })}

        {active.length === 0 ? (
          <p className="card p-6 text-center font-display text-xl">{f.none}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {active.map((fr) => {
              const a = avatarById(fr.friend.avatar);
              const unread = unreadBy.get(fr.friendshipId) ?? 0;
              return (
                <Link
                  key={fr.friendshipId}
                  href={`/${lang}/play/${childId}/friends/${fr.friendshipId}`}
                  className="relative flex flex-col items-center gap-2 rounded-[2rem] p-5 shadow-[0_5px_0_rgba(0,0,0,0.12)] transition active:scale-95"
                  style={{ background: a.color }}
                >
                  {unread > 0 && (
                    <span className="absolute top-2 right-3 flex h-8 min-w-8 items-center justify-center rounded-full bg-coral px-2 font-bold text-white">{unread}</span>
                  )}
                  <span className="text-6xl">{a.emoji}</span>
                  <span className="font-display text-xl font-bold">{fr.friend.nickname}</span>
                </Link>
              );
            })}
          </div>
        )}

        {(waiting.length > 0 || results.length > 0) && (
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-2xl font-bold">🏁 {t.parent.friends.challenges}</h2>
            {waiting.map((c) => (
              <p key={c.id} className="card p-4">⏳ {gameById(c.game_id)?.title[lang]} · {fmt(f.waiting, { name: nameOf(c.friendship_id) })}</p>
            ))}
            {results.map((c) => {
              const mine = c.from_child === childId ? c.from_correct! : c.to_correct!;
              const theirs = c.from_child === childId ? c.to_correct! : c.from_correct!;
              const name = nameOf(c.friendship_id);
              const verdict = mine > theirs ? f.won : mine < theirs ? fmt(f.lost, { name }) : f.tie;
              return (
                <p key={c.id} className="card flex flex-wrap items-center justify-between gap-2 p-4">
                  <span>{gameById(c.game_id)?.title[lang]}: <b>{f.you} ⭐{mine}</b> {f.vs} <b>{name} ⭐{theirs}</b></span>
                  <span className="font-bold">{verdict}</span>
                </p>
              );
            })}
          </section>
        )}
      </main>
    </KidGate>
  );
}
