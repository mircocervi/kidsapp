import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/** Client con la sessione del genitore: tutte le query passano dalla RLS. */
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chiamato da un Server Component: il refresh della sessione lo fa il proxy.
        }
      },
    },
  });
}

/**
 * Client con privilegi di servizio: bypassa la RLS. Usarlo SOLO dopo aver verificato
 * lato server l'identità del genitore e l'appartenenza del bambino alla famiglia.
 */
export function supabaseAdmin() {
  return createClient<Database>(url, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Genitore autenticato (verificato col server di auth) oppure null. */
export async function currentParent() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user ? { supabase, user: data.user } : null;
}
