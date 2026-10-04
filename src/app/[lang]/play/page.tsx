import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/app";
import { avatarById } from "@/config/characters";
import { getDictionary } from "@/i18n";
import { requireFamily } from "@/lib/family";

export default async function WhoPlays({ params }: PageProps<"/[lang]/play">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const { children } = await requireFamily(lang);

  return (
    <main className="safe-area no-select flex min-h-dvh flex-col">
      <div className="flex justify-end">
        <Link href={`/${lang}/parent`} className="btn btn-ghost !min-h-11 !px-4 !text-base">🔒 {t.kid.parentArea}</Link>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-10 py-6">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{t.kid.whoPlays}</h1>
        <div className="flex max-w-4xl flex-wrap justify-center gap-6 sm:gap-10">
          {children.map((c, i) => {
            const a = avatarById(c.avatar);
            return (
              <Link
                key={c.id}
                href={`/${lang}/play/${c.id}`}
                className="animate-pop flex flex-col items-center gap-3 transition active:scale-95"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span
                  className="flex h-32 w-32 items-center justify-center rounded-[2.5rem] text-7xl shadow-[0_6px_0_rgba(0,0,0,0.12)] sm:h-40 sm:w-40 sm:text-8xl"
                  style={{ background: a.color }}
                >
                  {a.emoji}
                </span>
                <span className="font-display text-2xl font-bold">{c.nickname}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
