import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { appName, isLocale } from "@/config/app";
import { getDictionary } from "@/i18n";
import { currentParent } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (await currentParent()) redirect(`/${lang}/onboarding`);
  const t = await getDictionary(lang);

  return (
    <main className="safe-area mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-8">
      <Link href={`/${lang}`} className="flex items-center gap-2 self-center font-display text-2xl font-extrabold">
        <img src="/icons/icon-192.png" alt="" className="h-12 w-12 rounded-2xl" />
        {appName}
      </Link>
      <div className="card flex flex-col gap-5 p-7">
        <div>
          <h1 className="font-display text-3xl font-extrabold">{t.login.title}</h1>
          <p className="mt-1 text-ink-soft">{t.login.subtitle}</p>
        </div>
        <LoginForm lang={lang} t={t.login} errorText={t.common.error} />
      </div>
      <p className="text-center text-sm text-ink-soft">👨‍👩‍👧 {t.login.adultsOnly}</p>
    </main>
  );
}
