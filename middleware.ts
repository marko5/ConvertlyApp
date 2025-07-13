import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { locales, defaultLocale } from "@/lib/i18n-config"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // This ensures Vercel's internal paths are not processed by locale logic.
  if (pathname.startsWith("/_vercel")) {
    return NextResponse.next()
  }

  // Handle root path
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }

  // Special case: redirect /[lang] to /en
  if (pathname === "/[lang]") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale.code}/`) && pathname !== `/${locale.code}`,
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Use default locale
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`, request.url),
    )
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)"],
}
