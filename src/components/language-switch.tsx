"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/config/app";

const labels: Record<Locale, string> = { en: "EN", it: "IT" };

export function LanguageSwitch({ current }: { current: Locale }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");
  return (
    <div className="flex rounded-full bg-paper p-1 shadow-[inset_0_0_0_2px_var(--color-line)]">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          className={`rounded-full px-3 py-1.5 text-sm font-bold ${l === current ? "bg-brand text-white" : "text-ink-soft"}`}
          aria-current={l === current ? "true" : undefined}
        >
          {labels[l]}
        </Link>
      ))}
    </div>
  );
}
