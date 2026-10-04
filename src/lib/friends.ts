import "server-only";
import { randomInt } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/server";

// Logica delle amicizie. Tutte le scritture passano da qui con il client di servizio,
// SEMPRE dopo aver verificato che il bambino appartenga al genitore della sessione.

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // niente 0/O/1/I: si leggono male

export function newInviteCode() {
  return Array.from({ length: 8 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
}

/** Il bambino appartiene al genitore? */
export async function ownsChild(parentId: string, childId: string) {
  const { data } = await supabaseAdmin().from("children").select("id").eq("id", childId).eq("parent_id", parentId).maybeSingle();
  return !!data;
}

export type Friend = {
  friendshipId: string;
  status: "active" | "blocked";
  friend: { id: string; nickname: string; avatar: string; grade: string };
};

/** Amici di un bambino (solo soprannome, avatar e classe dell'amico: nient'altro dell'altra famiglia). */
export async function friendsOf(childId: string): Promise<Friend[]> {
  const admin = supabaseAdmin();
  const { data: rows } = await admin
    .from("friendships")
    .select("id, status, child_a, child_b")
    .or(`child_a.eq.${childId},child_b.eq.${childId}`)
    .order("created_at");
  if (!rows?.length) return [];
  const otherIds = rows.map((r) => (r.child_a === childId ? r.child_b : r.child_a));
  const { data: kids } = await admin.from("children").select("id, nickname, avatar, grade").in("id", otherIds);
  return rows.flatMap((r) => {
    const other = kids?.find((k) => k.id === (r.child_a === childId ? r.child_b : r.child_a));
    return other ? [{ friendshipId: r.id, status: r.status, friend: other }] : [];
  });
}

/** Amicizia attiva che coinvolge il bambino, oppure null. */
export async function activeFriendship(childId: string, friendshipId: string) {
  const { data } = await supabaseAdmin()
    .from("friendships")
    .select("id, status, child_a, child_b, parent_a, parent_b")
    .eq("id", friendshipId)
    .maybeSingle();
  if (!data || data.status !== "active" || (data.child_a !== childId && data.child_b !== childId)) return null;
  const friendId = data.child_a === childId ? data.child_b : data.child_a;
  const friendParent = data.child_a === childId ? data.parent_b : data.parent_a;
  const myParent = data.child_a === childId ? data.parent_a : data.parent_b;
  return { ...data, friendId, friendParent, myParent };
}

export type ChallengeRow = {
  id: string;
  friendship_id: string;
  from_child: string;
  to_child: string;
  game_id: string;
  from_correct: number | null;
  to_correct: number | null;
  created_at: string;
  expires_at: string;
};

/** Sfide recenti di un bambino (ultimi 30 giorni) e messaggi non letti per amicizia. */
export async function friendsActivity(childId: string) {
  const admin = supabaseAdmin();
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const [{ data: challenges }, { data: unread }] = await Promise.all([
    admin
      .from("challenges")
      .select("id, friendship_id, from_child, to_child, game_id, from_correct, to_correct, created_at, expires_at")
      .or(`from_child.eq.${childId},to_child.eq.${childId}`)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(30),
    admin.from("friend_messages").select("friendship_id").eq("to_child", childId).eq("delivered", true).is("read_at", null),
  ]);
  const unreadBy = new Map<string, number>();
  for (const m of unread ?? []) unreadBy.set(m.friendship_id, (unreadBy.get(m.friendship_id) ?? 0) + 1);
  return { challenges: (challenges ?? []) as ChallengeRow[], unreadBy };
}

/** Divide le sfide in: da giocare, in attesa dell'amico, concluse. */
export function splitChallenges(challenges: ChallengeRow[], childId: string) {
  const now = Date.now();
  const open = (c: ChallengeRow) => new Date(c.expires_at).getTime() > now;
  return {
    toPlay: challenges.filter((c) => c.to_child === childId && c.to_correct === null && open(c)),
    waiting: challenges.filter((c) => c.from_child === childId && c.from_correct !== null && c.to_correct === null && open(c)),
    results: challenges.filter((c) => c.from_correct !== null && c.to_correct !== null).slice(0, 8),
  };
}
