"use server";

import { revalidatePath } from "next/cache";
import { mascotById } from "@/config/characters";
import { currentParent } from "@/lib/supabase/server";

export async function chooseMascot(lang: string, childId: string, mascotId: string) {
  const session = await currentParent();
  if (!session || !mascotById(mascotId)) return;
  // RLS: aggiorna solo se il bambino appartiene al genitore della sessione.
  await session.supabase.from("children").update({ mascot: mascotId }).eq("id", childId);
  revalidatePath(`/${lang}/play/${childId}`);
}
