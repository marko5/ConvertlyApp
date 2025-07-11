import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import { APP_CONFIG, APP_URL, PWA_CONFIG } from "@/lib/domain-config"
import { ADMOB_APP_ID } from "@/lib/ad-constants"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: PWA_CONFIG.name,
    template: `%s | ${PWA_CONFIG.name}`,
  },
  description: PWA_CONFIG.description,
  applicationName: PWA_CONFIG.name,
  authors: [{ name: "Convertly Team" }],
  keywords: ["converter", "measurement", "units", "calculator", "currency", "exchange rates"],
  creator: "Convertly Team",
  publisher: "Convertly Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: APP_CONFIG.locale,
    url: APP_URL,
    title: PWA_CONFIG.name,
    description: PWA_CONFIG.description,
    siteName: PWA_CONFIG.name,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: PWA_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PWA_CONFIG.name,
    description: PWA_CONFIG.description,
    creator: APP_CONFIG.twitterHandle,
    images: [`${APP_URL}/twitter-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: APP_URL,
    languages: {
      "en-US": `${APP_URL}/en-US`,
    },
  },
  verification: {
    // Add your verification tokens here
    google: "google-site-verification-token",
    yandex: "yandex-verification-token",
  },
    generator: 'v0.dev'
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={PWA_CONFIG.shortName} />
        <link rel="apple-touch-icon" href="/apple-icon-180.png" />

        {/* Domain verification */}
        <meta name="apple-itunes-app" content={`app-id=yourappid, app-argument=${APP_URL}`} />

        {/* Canonical URL */}
        <link rel="canonical" href={APP_URL} />
        {/* Google AdSense */}
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADMOB_APP_ID}`}
          crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
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
