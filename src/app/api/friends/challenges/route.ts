import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
import { friendContext } from "@/lib/friends-api";
import { clampLevel, gameById } from "@/games/registry";
import { levelOf } from "@/config/grades";

// Nuova sfida: stesse domande per entrambi (stesso seme), al livello del più piccolo dei due.
const body = z.object({ childId: z.uuid(), friendshipId: z.uuid(), gameId: z.string().max(40) });

export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { childId, friendshipId, gameId } = parsed.data;
  const game = gameById(gameId);
  if (!game) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const ctx = await friendContext(childId, friendshipId);
  if ("error" in ctx) return ctx.error;
  const admin = supabaseAdmin();
  const { data: kids } = await admin.from("children").select("id, grade").in("id", [childId, ctx.friendship.friendId]);
  if (kids?.length !== 2) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const shared = Math.min(...kids.map((k) => levelOf(k.grade)));
  // Il gioco deve essere adatto anche al più piccolo dei due.
  if (shared < game.minLevel) return NextResponse.json({ error: "too_hard" }, { status: 400 });
  const level = clampLevel(game, shared);

  const { data } = await admin
    .from("challenges")
    .insert({
      friendship_id: friendshipId,
      from_child: childId,
      to_child: ctx.friendship.friendId,
      game_id: game.id,
      level,
      seed: randomInt(1, 2 ** 31 - 1),
    })
    .select("id")
    .single();
  return NextResponse.json({ id: data?.id });
}
