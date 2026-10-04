import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isLocale } from "@/config/app";
import { getDictionary } from "@/i18n";
import { isPublicDoc, publicDocs, readPublicDoc } from "@/lib/docs";

export default async function Trust({ params }: PageProps<"/[lang]/trust/[[...doc]]">) {
  const { lang, doc } = await params;
  if (!isLocale(lang)) notFound();
  const slug = doc?.[0] ?? "trust-center";
  if (!isPublicDoc(slug) || (doc && doc.length > 1)) notFound();
  const t = await getDictionary(lang);
  const { body, isDraft } = await readPublicDoc(slug, lang);

  return (
    <main className="safe-area mx-auto flex min-h-dvh max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-4">
        <Link href={`/${lang}`} className="text-brand underline">← {t.common.back}</Link>
        <h1 className="font-display text-4xl font-extrabold">🛡️ {t.trustPage.title}</h1>
        <p className="text-ink-soft">{t.trustPage.subtitle}</p>
        <nav className="flex flex-wrap gap-2">
          {publicDocs.map((d) => (
            <Link
              key={d}
              href={`/${lang}/trust/${d}`}
              className={`rounded-full px-4 py-2 text-sm font-bold ${d === slug ? "bg-brand text-white" : "bg-paper shadow-[inset_0_0_0_2px_var(--color-line)]"}`}
            >
              {t.trustPage.docs[d]}
            </Link>
          ))}
        </nav>
      </header>
      {isDraft && (
        <p className="rounded-2xl bg-sun/30 p-4 text-sm font-bold">
          🚧 {lang === "it" ? "Bozza in revisione: il servizio è in beta privata e non è ancora aperto al pubblico." : "Draft under review: the service is in private beta and not yet open to the public."}
        </p>
      )}
      <article className="prose-kid card p-6 sm:p-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </article>
    </main>
  );
}
