import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
import { friendContext } from "@/lib/friends-api";

// "Non mi piace / Blocca": il bambino mette subito in pausa l'amicizia; entrambi i genitori vengono avvisati.
const body = z.object({ childId: z.uuid(), friendshipId: z.uuid() });

export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { childId, friendshipId } = parsed.data;
  const ctx = await friendContext(childId, friendshipId);
  if ("error" in ctx) return ctx.error;
  const { friendship } = ctx;

  const admin = supabaseAdmin();
  await admin.from("friendships").update({ status: "blocked", blocked_by: childId }).eq("id", friendshipId);
  await admin.from("safety_alerts").insert([
    { parent_id: friendship.myParent, child_id: childId, category: "friend_report", severity: "warning" },
    { parent_id: friendship.friendParent, child_id: friendship.friendId, category: "friend_report", severity: "warning" },
  ]);
  return NextResponse.json({ ok: true });
}
