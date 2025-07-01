import { redirect } from "next/navigation"
import { defaultLocale } from "@/lib/i18n-config"

export default function RootPage() {
  // Redirect root path to default locale
  redirect(`/${defaultLocale}`)
}
