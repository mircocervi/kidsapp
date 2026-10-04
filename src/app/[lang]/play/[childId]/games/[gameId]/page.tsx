import { notFound } from "next/navigation";
import { isLocale } from "@/config/app";
import { isVoiceFirst, levelOf } from "@/config/grades";
import { clampLevel, gameById } from "@/games/registry";
import { getDictionary } from "@/i18n";
import { requireChild } from "@/lib/kid";
import { supabaseAdmin } from "@/lib/supabase/server";
import { KidGate } from "@/components/kid-gate";
import { GameLoader } from "./game-loader";

export default async function GamePage({ params, searchParams }: PageProps<"/[lang]/play/[childId]/games/[gameId]">) {
  const { lang, childId, gameId } = await params;
  const { challenge: challengeId } = (await searchParams) as { challenge?: string };
  if (!isLocale(lang)) notFound();
  const game = gameById(gameId);
  if (!game) notFound();
  const t = await getDictionary(lang);
  const { child, parent } = await requireChild(lang, childId);

  // Sfida tra amici: stesso seme e stesso livello per entrambi, giocabile una sola volta.
  let challenge: { id: string; seed: number; level: number } | null = null;
  if (challengeId && /^[0-9a-f-]{36}$/.test(challengeId)) {
    const { data: ch } = await supabaseAdmin()
      .from("challenges")
      .select("id, seed, level, game_id, from_child, to_child, from_correct, to_correct, expires_at")
      .eq("id", challengeId)
      .maybeSingle();
    const mine = ch && (ch.from_child === childId ? ch.from_correct : ch.to_child === childId ? ch.to_correct : -1);
    if (ch && ch.game_id === game.id && mine === null && new Date(ch.expires_at) > new Date()) {
      challenge = { id: ch.id, seed: ch.seed, level: ch.level };
    }
  }

  return (
    <KidGate
      childId={childId}
      lang={lang}
      dailyLimitMinutes={parent.daily_limit_minutes}
      quietStart={parent.quiet_hours_start}
      quietEnd={parent.quiet_hours_end}
      texts={{ timeUp: t.kid.timeUp, quietHours: t.kid.quietHours, parentArea: t.kid.parentArea }}
    >
      <GameLoader
        lang={lang}
        childId={childId}
        parentId={parent.id}
        gameId={game.id}
        level={challenge?.level ?? clampLevel(game, levelOf(child.grade))}
        challenge={challenge}
        readAloud={isVoiceFirst(child.grade)}
        t={t.games}
        backToFriends={t.kid.friends.title}
      />
    </KidGate>
  );
}
