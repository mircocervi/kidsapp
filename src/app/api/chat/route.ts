import { NextResponse } from "next/server";
import { z } from "zod";
import { currentParent, supabaseAdmin } from "@/lib/supabase/server";
import { complete, MODELS, type ChatMessage } from "@/lib/ai/openrouter";
import { classify, type SafetyCategory } from "@/lib/ai/safety";
import { redactPersonalData } from "@/lib/ai/pii";
import { systemPrompt } from "@/lib/ai/prompts";
import { privacyNote, safeReply } from "@/lib/ai/safe-replies";
import { bandOf } from "@/config/grades";
import { mascotById, mascots } from "@/config/characters";

const body = z.object({
  childId: z.uuid(),
  text: z.string().trim().min(1).max(500),
});

const MAX_MESSAGES_PER_HOUR = 60;
// Questi temi non arrivano mai al modello generativo: risposta fissa + avviso al genitore.
const ESCALATE: SafetyCategory[] = ["self_harm", "abuse", "bullying"];

export async function POST(request: Request) {
  const session = await currentParent();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { childId, text } = parsed.data;

  // Letture con la sessione del genitore: la RLS garantisce che il bambino sia suo.
  const { supabase, user } = session;
  const [{ data: child }, { data: parent }] = await Promise.all([
    supabase.from("children").select("id, grade, mascot, locale, chat_enabled").eq("id", childId).maybeSingle(),
    supabase.from("parents").select("locale, country, chat_mode, consent_at").eq("id", user.id).maybeSingle(),
  ]);
  if (!child || !parent) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!parent.consent_at) return NextResponse.json({ error: "consent_required" }, { status: 403 });
  if (!child.chat_enabled) return NextResponse.json({ error: "chat_disabled" }, { status: 403 });

  const admin = supabaseAdmin();
  const locale = child.locale ?? parent.locale;

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("child_id", childId)
    .eq("role", "child")
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_MESSAGES_PER_HOUR) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const { clean, found } = redactPersonalData(text);
  const verdict = await classify(clean, "question");

  if (!verdict.safe && "unavailable" in verdict) {
    return NextResponse.json({ reply: safeReply("unavailable", locale), flagged: false });
  }

  const category: SafetyCategory | null = !verdict.safe
    ? verdict.category
    : found.length > 0
      ? "personal_info"
      : null;

  const { data: childMsg } = await admin
    .from("chat_messages")
    .insert({ parent_id: user.id, child_id: childId, role: "child", content: clean, flagged: !!category, flag_category: category })
    .select("id")
    .single();

  if (category) {
    const urgent = category === "self_harm" || category === "abuse";
    const severity = urgent
      ? "urgent"
      : category !== "personal_info" && (ESCALATE.includes(category) || (!verdict.safe && verdict.severity === "high"))
        ? "warning"
        : "info";
    await admin.from("safety_alerts").insert({
      parent_id: user.id, child_id: childId, message_id: childMsg?.id ?? null, category, severity,
    });
  }

  let reply: string;
  let model: string | null = null;
  let flaggedReply = false;

  // I dati personali non bloccano la conversazione: sono già stati rimossi e il bot ricorda la privacy.
  const blocked =
    !verdict.safe && verdict.category !== "personal_info" && (ESCALATE.includes(verdict.category) || verdict.severity === "high");
  if (blocked) {
    reply = safeReply(verdict.category, locale, parent.country);
  } else {
    const { data: history } = await admin
      .from("chat_messages")
      .select("role, content")
      .eq("child_id", childId)
      .gte("created_at", new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(11);

    const mascot = mascotById(child.mascot) ?? mascots[0];
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: systemPrompt({
          mascotName: mascot.name,
          mascotTrait: mascot.trait,
          band: bandOf(child.grade),
          mode: parent.chat_mode,
          locale,
        }),
      },
      // la cronologia include già il messaggio appena salvato
      ...(history ?? []).reverse().map((m) => ({
        role: m.role === "child" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
    ];

    try {
      const result = await complete({ models: MODELS.chat, messages, maxTokens: 500 });
      model = result.model;
      const check = await classify(result.content, "answer");
      // Sulla risposta "personal_info" scatta solo perché il bot ricorda la privacy: non è un rischio.
      if (check.safe || ("category" in check && check.category === "personal_info")) {
        reply = result.content;
      } else {
        flaggedReply = true;
        reply = safeReply("unavailable" in check ? "unavailable" : "other", locale);
      }
    } catch {
      reply = safeReply("unavailable", locale);
    }
    if (category === "personal_info") reply = `${privacyNote(locale)}\n\n${reply}`;
  }

  await admin.from("chat_messages").insert({
    parent_id: user.id, child_id: childId, role: "assistant", content: reply, model, flagged: flaggedReply,
  });

  return NextResponse.json({ reply, flagged: !!category || flaggedReply });
}
