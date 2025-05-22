import "server-only"
import type { Locale } from "./i18n-config"

// We enumerate all dictionaries here for better typechecking
const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  es: () => import("@/dictionaries/es.json").then((module) => module.default),
  fr: () => import("@/dictionaries/fr.json").then((module) => module.default),
  it: () => import("@/dictionaries/it.json").then((module) => module.default),
  hr: () => import("@/dictionaries/hr.json").then((module) => module.default),
  de: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  pt: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  nl: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  pl: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  sv: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  no: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  da: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  fi: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  ru: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  ja: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  zh: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  ko: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  ar: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  hi: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  tr: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
  el: () => import("@/dictionaries/en.json").then((module) => module.default), // Fallback to English for now
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
