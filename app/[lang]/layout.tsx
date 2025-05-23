import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import { locales, type Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/get-dictionary"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: dict.app.name,
    description: dict.app.slogan,
    applicationName: dict.app.name,
    authors: [{ name: "Convertly Team" }],
    keywords: ["converter", "measurement", "units", "calculator", "currency", "exchange rates"],
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
  params: { lang: Locale }
}>) {
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense>{children}</Suspense>
        </ThemeProvider>
        <AnalyticsProvider />
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
