import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
import { friendContext } from "@/lib/friends-api";
import { redactPersonalData } from "@/lib/ai/pii";
import { classify } from "@/lib/ai/safety";
import { canWriteFreeText, isPhrase, isSticker, MAX_TEXT } from "@/config/friends";
import { ageOf } from "@/config/grades";

const body = z.object({
  childId: z.uuid(),
  friendshipId: z.uuid(),
  kind: z.enum(["sticker", "phrase", "text"]),
  content: z.string().trim().min(1).max(MAX_TEXT),
});

const MAX_PER_HOUR = 60;

export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { childId, friendshipId, kind, content } = parsed.data;

  const ctx = await friendContext(childId, friendshipId);
  if ("error" in ctx) return ctx.error;
  const { friendship } = ctx;
  const admin = supabaseAdmin();

  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await admin
    .from("friend_messages")
    .select("id", { count: "exact", head: true })
    .eq("from_child", childId)
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_PER_HOUR) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const base = { friendship_id: friendshipId, from_child: childId, to_child: friendship.friendId, kind };

  if (kind === "sticker" || kind === "phrase") {
    if (kind === "sticker" ? !isSticker(content) : !isPhrase(content)) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    const { data } = await admin.from("friend_messages").insert({ ...base, content }).select("id").single();
    return NextResponse.json({ id: data?.id, delivered: true });
  }

  // Testo libero: solo dai più grandi, e solo dopo i controlli di sicurezza.
  const { data: child } = await admin.from("children").select("grade").eq("id", childId).single();
  if (!child || !canWriteFreeText(ageOf(child.grade))) return NextResponse.json({ error: "not_allowed" }, { status: 403 });

  const { clean, found } = redactPersonalData(content);
  const verdict = found.length
    ? ({ safe: false, category: "personal_info", severity: "low" } as const)
    : await classify(clean, "question");

  if (verdict.safe) {
    const { data } = await admin.from("friend_messages").insert({ ...base, content: clean }).select("id").single();
    return NextResponse.json({ id: data?.id, delivered: true });
  }

  // Non consegnato (fail closed anche se il controllo non è disponibile); il genitore del mittente lo vede.
  const category = "category" in verdict ? verdict.category : "other";
  const { data: msg } = await admin
    .from("friend_messages")
    .insert({ ...base, content: clean, delivered: false, flag_category: category })
    .select("id")
    .single();
  if ("category" in verdict) {
    const urgent = category === "self_harm" || category === "abuse";
    await admin.from("safety_alerts").insert({
      parent_id: friendship.myParent,
      child_id: childId,
      friend_message_id: msg?.id ?? null,
      category,
      severity: urgent ? "urgent" : verdict.severity === "high" ? "warning" : "info",
    });
  }
  return NextResponse.json({ id: msg?.id, delivered: false });
}
