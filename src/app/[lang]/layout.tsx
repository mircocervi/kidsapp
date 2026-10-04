import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Baloo_2, Nunito } from "next/font/google";
import { appName, isLocale, locales } from "@/config/app";
import { getDictionary } from "@/i18n";
import { ServiceWorker } from "@/components/service-worker";
import "../globals.css";

// next/font scarica i font in fase di build e li serve dal nostro dominio:
// nessuna richiesta a Google dal browser delle famiglie.
const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo", weight: ["500", "700", "800"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff8ee",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: { default: `${appName} — ${t.meta.title}`, template: `%s · ${appName}` },
    description: t.meta.description,
    applicationName: appName,
    appleWebApp: { capable: true, title: appName, statusBarStyle: "default" },
    formatDetection: { telephone: false },
    icons: { icon: "/icons/favicon-32.png", apple: "/icons/apple-touch-icon.png" },
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} className={`${baloo.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-dvh">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
