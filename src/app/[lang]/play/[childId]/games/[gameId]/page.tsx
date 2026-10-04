import { notFound } from "next/navigation";
import { isLocale } from "@/config/app";
import { isVoiceFirst, levelOf } from "@/config/grades";
import { clampLevel, gameById } from "@/games/registry";
import { getDictionary } from "@/i18n";
import { requireChild } from "@/lib/kid";
import { KidGate } from "@/components/kid-gate";
import { GameLoader } from "./game-loader";

export default async function GamePage({ params }: PageProps<"/[lang]/play/[childId]/games/[gameId]">) {
  const { lang, childId, gameId } = await params;
  if (!isLocale(lang)) notFound();
  const game = gameById(gameId);
  if (!game) notFound();
  const t = await getDictionary(lang);
  const { child, parent } = await requireChild(lang, childId);

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
        level={clampLevel(game, levelOf(child.grade))}
        readAloud={isVoiceFirst(child.grade)}
        t={t.games}
      />
    </KidGate>
  );
}
