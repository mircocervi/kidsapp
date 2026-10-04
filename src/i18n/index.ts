import "server-only";
import type { Locale } from "@/config/app";
import type en from "./dictionaries/en.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  it: () => import("./dictionaries/it.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
