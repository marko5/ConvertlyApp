import Link from "next/link"
import { defaultLocale } from "@/lib/i18n-config"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-6xl font-bold text-emerald-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link
        href={`/${defaultLocale}`}
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Return to Home
      </Link>
    </div>
  )
}
