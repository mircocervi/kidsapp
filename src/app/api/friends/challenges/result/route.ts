import { NextResponse } from "next/server";
import { z } from "zod";
import { currentParent, supabaseAdmin } from "@/lib/supabase/server";
import { ownsChild } from "@/lib/friends";

// Risultato di una sfida: ognuno dei due bambini lo registra una sola volta.
const body = z.object({ childId: z.uuid(), challengeId: z.uuid(), correct: z.number().int().min(0).max(50) });

export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { childId, challengeId, correct } = parsed.data;
  const session = await currentParent();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!(await ownsChild(session.user.id, childId))) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const admin = supabaseAdmin();
  const { data: ch } = await admin
    .from("challenges")
    .select("id, from_child, to_child, from_correct, to_correct, total, expires_at")
    .eq("id", challengeId)
    .maybeSingle();
  if (!ch || (ch.from_child !== childId && ch.to_child !== childId)) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (new Date(ch.expires_at) < new Date()) return NextResponse.json({ error: "expired" }, { status: 410 });

  const mine = ch.from_child === childId ? "from_correct" : "to_correct";
  if (ch[mine] !== null) return NextResponse.json({ error: "already_played" }, { status: 409 });
  const score = Math.min(correct, ch.total);
  const other = mine === "from_correct" ? ch.to_correct : ch.from_correct;
  await admin
    .from("challenges")
    .update({ [mine]: score, ...(other !== null ? { completed_at: new Date().toISOString() } : {}) })
    .eq("id", challengeId);
  return NextResponse.json({ ok: true });
}
