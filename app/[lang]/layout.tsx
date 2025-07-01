import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import { locales, defaultLocale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/get-dictionary"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { Suspense } from "react"
import { PageViewTracker } from "@/components/page-view-tracker"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  // Handle invalid locale
  const isValidLocale = locales.some((locale) => locale.code === params.lang)
  const lang = isValidLocale ? params.lang : defaultLocale

  try {
    const dict = await getDictionary(lang)

    return {
      title: dict.app.name,
      description: dict.app.slogan,
      applicationName: dict.app.name,
      authors: [{ name: "Convertly Team" }],
      keywords: ["converter", "measurement", "units", "calculator", "currency", "exchange rates"],
    }
  } catch (error) {
    // Fallback metadata
    return {
      title: "Convertly",
      description: "Measure everything, anywhere",
      applicationName: "Convertly",
    }
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#065f46" },
  ],
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale.code }))
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { lang: string }
}>) {
  // Handle invalid locale
  const isValidLocale = locales.some((locale) => locale.code === params.lang)
  const lang = isValidLocale ? params.lang : defaultLocale

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>

        {/* Analytics - moved to the end */}
        <AnalyticsProvider />

        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>

        {/* Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
