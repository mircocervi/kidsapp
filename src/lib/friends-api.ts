import "server-only";
import { NextResponse } from "next/server";
import { currentParent } from "@/lib/supabase/server";
import { activeFriendship, ownsChild } from "@/lib/friends";

/**
 * Contesto comune delle API "amici" lato bambino: sessione del genitore sul dispositivo,
 * bambino della famiglia, amicizia attiva che lo coinvolge. Altrimenti una risposta d'errore.
 */
export async function friendContext(childId: string, friendshipId: string) {
  const session = await currentParent();
  if (!session) return { error: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  if (!(await ownsChild(session.user.id, childId))) return { error: NextResponse.json({ error: "not_found" }, { status: 404 }) };
  const friendship = await activeFriendship(childId, friendshipId);
  if (!friendship) return { error: NextResponse.json({ error: "friendship_inactive" }, { status: 403 }) };
  return { session, friendship };
}
