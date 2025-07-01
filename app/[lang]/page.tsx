import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/lib/i18n-config"
import { defaultLocale, locales } from "@/lib/i18n-config"
import ClientPage from "./client-page"
import { redirect } from "next/navigation"

export default async function Home({ params }: { params: { lang: string } }) {
  // Check if we're accessing the literal [lang] route
  if (params.lang === "[lang]") {
    // Redirect to the default locale
    redirect(`/${defaultLocale}`)
    return null
  }

  // Check if the language is valid
  const isValidLocale = locales.some((locale) => locale.code === params.lang)

  // If not valid, use default locale
  const lang = isValidLocale ? params.lang : defaultLocale

  // Get dictionary with fallback handling
  const dict = await getDictionary(lang)

  return (
    <>
      <ClientPage lang={lang as Locale} dict={dict} />
    </>
  )
}
