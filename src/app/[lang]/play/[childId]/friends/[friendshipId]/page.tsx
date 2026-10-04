import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/app";
import { avatarById } from "@/config/characters";
import { canWriteFreeText } from "@/config/friends";
import { ageOf, levelOf } from "@/config/grades";
import { gamesForLevel } from "@/games/registry";
import { getDictionary } from "@/i18n";
import { fmt } from "@/i18n/format";
import { requireChild } from "@/lib/kid";
import { friendsOf } from "@/lib/friends";
import { supabaseAdmin } from "@/lib/supabase/server";
import { KidGate } from "@/components/kid-gate";
import { FriendThread } from "./friend-thread";

export default async function FriendPage({ params }: PageProps<"/[lang]/play/[childId]/friends/[friendshipId]">) {
  const { lang, childId, friendshipId } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const f = t.kid.friends;
  const { child, parent } = await requireChild(lang, childId);
  const friendship = (await friendsOf(childId)).find((x) => x.friendshipId === friendshipId);
  if (!friendship) notFound();
  const friend = friendship.friend;
  const a = avatarById(friend.avatar);

  const admin = supabaseAdmin();
  const { data: messages } = await admin
    .from("friend_messages")
    .select("id, from_child, kind, content, delivered, created_at")
    .eq("friendship_id", friendshipId)
    .order("created_at", { ascending: false })
    .limit(60);
  // Messaggi dell'amico visibili al bambino (quelli non consegnati non arrivano mai al destinatario).
  const visible = (messages ?? []).filter((m) => m.from_child === childId || m.delivered).reverse();
  await admin
    .from("friend_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("friendship_id", friendshipId)
    .eq("to_child", childId)
    .is("read_at", null);

  const shared = Math.min(levelOf(child.grade), levelOf(friend.grade as Parameters<typeof levelOf>[0]));
  const games = gamesForLevel(shared).map((g) => ({ id: g.id, icon: g.icon, color: g.color, title: g.title[lang] }));

  return (
    <KidGate
      childId={childId}
      lang={lang}
      dailyLimitMinutes={parent.daily_limit_minutes}
      quietStart={parent.quiet_hours_start}
      quietEnd={parent.quiet_hours_end}
      texts={{ timeUp: t.kid.timeUp, quietHours: t.kid.quietHours, parentArea: t.kid.parentArea }}
    >
      <main className="flex h-dvh flex-col" style={{ background: `linear-gradient(${a.color}88, var(--color-cream) 30%)` }}>
        <header className="safe-area flex items-center gap-3 !pb-3">
          <Link href={`/${lang}/play/${childId}/friends`} className="btn btn-ghost !min-h-12 !w-12 !px-0 text-2xl" aria-label={t.common.back}>←</Link>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-4xl" style={{ background: a.color }}>{a.emoji}</span>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-extrabold">{friend.nickname}</span>
            <span className="text-xs text-ink-soft">👀 {fmt(f.parentsSee, { name: friend.nickname })}</span>
          </div>
        </header>
        {friendship.status === "blocked" ? (
          <p className="m-6 card p-6 text-center font-display text-xl">{f.blockedInfo}</p>
        ) : (
          <FriendThread
            lang={lang}
            childId={childId}
            friendshipId={friendshipId}
            friendName={friend.nickname}
            friendEmoji={a.emoji}
            canWrite={canWriteFreeText(ageOf(child.grade))}
            initial={visible.map((m) => ({ id: m.id, mine: m.from_child === childId, kind: m.kind, content: m.content, delivered: m.delivered }))}
            games={games}
            t={{
              placeholder: fmt(f.placeholder, { name: friend.nickname }),
              send: f.send,
              notSent: f.notSent,
              challenge: f.challenge,
              pickGame: fmt(f.pickGame, { name: friend.nickname }),
              block: f.block,
              blockConfirm: fmt(f.blockConfirm, { name: friend.nickname }),
              error: t.common.error,
              cancel: t.common.cancel,
            }}
          />
        )}
      </main>
    </KidGate>
  );
}
