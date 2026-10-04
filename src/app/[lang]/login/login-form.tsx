"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { fmt } from "@/i18n/format";
import type { Dictionary } from "@/i18n";

export function LoginForm({ lang, t, errorText }: { lang: string; t: Dictionary["login"]; errorText: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabaseBrowser().auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/${lang}/onboarding`,
        data: { locale: lang },
      },
    });
    setBusy(false);
    if (error) setError(errorText);
    else setStep("code");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabaseBrowser().auth.verifyOtp({ email, token: code, type: "email" });
    if (error) {
      setBusy(false);
      setError(t.invalid);
      return;
    }
    router.replace(`/${lang}/onboarding`);
    router.refresh();
  }

  if (step === "email") {
    return (
      <form onSubmit={sendCode} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 font-bold">
          {t.email}
          <input
            className="field"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {error && <p className="text-danger">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{t.send}</button>
      </form>
    );
  }

  return (
    <form onSubmit={verify} className="flex flex-col gap-4">
      <p className="rounded-2xl bg-brand-soft p-4 text-brand">{fmt(t.sent, { email })}</p>
      <label className="flex flex-col gap-2 font-bold">
        {t.code}
        <input
          className="field text-center font-display text-3xl tracking-[0.5em]"
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          autoFocus
        />
      </label>
      {error && <p className="text-danger">{error}</p>}
      <button className="btn btn-primary" disabled={busy || code.length !== 6}>{t.verify}</button>
      <button type="button" className="text-sm text-ink-soft underline" onClick={() => { setStep("email"); setCode(""); }}>
        {t.changeEmail}
      </button>
    </form>
  );
}
