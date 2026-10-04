import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { defaultLocale } from "@/config/app";

// Accesso tramite link nell'email (alternativa al codice a 6 cifre).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "";
  // Solo percorsi interni: niente open redirect.
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : `/${defaultLocale}/onboarding`;

  if (code) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/${defaultLocale}/login`);
}
