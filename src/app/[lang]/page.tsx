import Link from "next/link";
import { notFound } from "next/navigation";
import { appName, isLocale } from "@/config/app";
import { mascots } from "@/config/characters";
import { getDictionary } from "@/i18n";
import { currentParent } from "@/lib/supabase/server";
import { LanguageSwitch } from "@/components/language-switch";

export default async function Landing({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const session = await currentParent();
  const ctaHref = session ? `/${lang}/play` : `/${lang}/login`;

  return (
    <div className="safe-area mx-auto flex max-w-6xl flex-col gap-16 pb-10">
      <header className="flex items-center justify-between gap-3">
        <Link href={`/${lang}`} className="flex items-center gap-2 font-display text-2xl font-extrabold">
          <img src="/icons/icon-192.png" alt="" className="h-10 w-10 rounded-xl" />
          {appName}
        </Link>
        <nav className="flex items-center gap-2">
          <LanguageSwitch current={lang} />
          <Link href={ctaHref} className="btn btn-ghost !min-h-11 !px-4 !text-base">
            {session ? t.kid.games : t.landing.login}
          </Link>
        </nav>
      </header>

      <section className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full bg-brand-soft px-4 py-1.5 text-sm font-bold text-brand">{t.landing.badge}</span>
          <h1 className="font-display text-4xl leading-tight font-extrabold sm:text-5xl lg:text-6xl">{t.landing.title}</h1>
          <p className="text-lg text-ink-soft sm:text-xl">{t.landing.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={ctaHref} className="btn btn-coral">{t.landing.cta}</Link>
            <Link href={`/${lang}/trust`} className="btn btn-ghost">🛡️ {t.common.trust}</Link>
          </div>
        </div>
        <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4" aria-hidden>
          {mascots.map((m, i) => (
            <div
              key={m.id}
              className="card animate-bob flex aspect-square flex-col items-center justify-center gap-2"
              style={{ background: m.color, animationDelay: `${i * 0.3}s` }}
            >
              <span className="text-7xl">{m.emoji}</span>
              <span className="font-display text-xl font-bold">{m.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-3xl font-extrabold">{t.landing.featuresTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.landing.features.map((f) => (
            <div key={f.title} className="card flex flex-col gap-2 p-6">
              <span className="text-4xl">{f.icon}</span>
              <h3 className="font-display text-xl font-bold">{f.title}</h3>
              <p className="text-ink-soft">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-3xl font-extrabold">{t.landing.howTitle}</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {t.landing.how.map((s, i) => (
            <li key={s.title} className="card flex gap-4 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sun font-display text-2xl font-extrabold">{i + 1}</span>
              <div>
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                <p className="text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card flex flex-col gap-5 bg-ink! p-8 text-white">
        <h2 className="font-display text-3xl font-extrabold">🛡️ {t.landing.safetyTitle}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {t.landing.safety.map((s) => (
            <li key={s} className="flex gap-3 text-lg"><span className="text-mint">✔</span>{s}</li>
          ))}
        </ul>
        <Link href={`/${lang}/trust`} className="btn btn-primary w-fit">{t.landing.trustCta}</Link>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
        <span>© {new Date().getFullYear()} {appName} · {t.landing.footer}</span>
        <span className="flex gap-4">
          <Link href={`/${lang}/trust/privacy-policy`} className="underline">{t.common.privacy}</Link>
          <Link href={`/${lang}/trust`} className="underline">{t.common.trust}</Link>
        </span>
      </footer>
    </div>
  );
}
