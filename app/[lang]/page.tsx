import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/lib/i18n-config"
import ClientPage from "./client-page"

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)

  return (
    <>
      <ClientPage lang={lang} dict={dict} />
    </>
  )
}
