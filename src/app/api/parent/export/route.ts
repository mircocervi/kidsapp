import { NextResponse } from "next/server";
import { currentParent } from "@/lib/supabase/server";
import { isUnlocked } from "@/lib/parent-gate";

// Portabilità (art. 20 GDPR) e accesso (art. 15): tutti i dati della famiglia in un file JSON.
export async function GET() {
  const session = await currentParent();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!(await isUnlocked(session.user.id))) return NextResponse.json({ error: "locked" }, { status: 403 });
  const { supabase, user } = session;

  const [parent, children, messages, alerts, results, friendships, friendMessages, challenges] = await Promise.all([
    supabase.from("parents").select("*").eq("id", user.id).single(),
    supabase.from("children").select("*"),
    supabase.from("chat_messages").select("*").order("created_at"),
    supabase.from("safety_alerts").select("*").order("created_at"),
    supabase.from("activity_results").select("*").order("created_at"),
    supabase.from("friendships").select("id, child_a, child_b, status, created_at"),
    supabase.from("friend_messages").select("id, friendship_id, from_child, to_child, kind, content, delivered, created_at").order("created_at"),
    supabase.from("challenges").select("id, friendship_id, from_child, to_child, game_id, from_correct, to_correct, created_at").order("created_at"),
  ]);

  const payload = {
    exported_at: new Date().toISOString(),
    account: { email: user.email, created_at: user.created_at, ...parent.data },
    children: children.data,
    chat_messages: messages.data,
    safety_alerts: alerts.data,
    activity_results: results.data,
    friendships: friendships.data,
    friend_messages: friendMessages.data,
    challenges: challenges.data,
  };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="family-data-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
