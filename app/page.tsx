"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "@/components/mode-toggle"
import CategoryGrid from "@/components/category-grid"
import ConversionPanel from "@/components/conversion-panel"
import CurrencyRatesTable from "@/components/currency-rates-table"
import GoogleAdBanner from "@/components/google-ad-banner"
import SplashScreen from "@/components/splash-screen"
import AppLogo from "@/components/app-logo"
import InstallPrompt from "@/components/install-prompt"
import MobileAdBanner from "@/components/mobile-ad-banner"
import InterstitialAd from "@/components/interstitial-ad"
import Script from "next/script"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Info } from "lucide-react"
import { BANNER_AD_UNIT_ID, INTERSTITIAL_AD_UNIT_ID } from "@/lib/ad-constants"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("length")
  const [activeTab, setActiveTab] = useState("converter")
  const [showSplash, setShowSplash] = useState(true)
  const [isCapacitor, setIsCapacitor] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const interstitialShownRef = useRef<boolean>(false)

  // Check if we're in a Capacitor environment
  useEffect(() => {
    setIsCapacitor(typeof window !== "undefined" && window.Capacitor !== undefined)
  }, [])

  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000) // 3 seconds for the animation

    return () => clearTimeout(timer)
  }, [])

  // Show interstitial ad when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // If we've switched to currency rates and haven't shown an interstitial yet, show one
    if (value === "currency-rates" && isCapacitor && !interstitialShownRef.current) {
      interstitialShownRef.current = true
      // The InterstitialAd component will handle showing the ad
    }
  }

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)

    // Show interstitial ad occasionally when changing categories (e.g., every 3rd change)
    // This is just an example strategy - adjust based on your preference
    if (isCapacitor && Math.random() < 0.3) {
      // 30% chance to show an ad
      // The InterstitialAd component will handle showing the ad
    }
  }

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <>
      {/* Google AdSense Script (for web) */}
      {!isCapacitor && (
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5141185566064464"
          crossOrigin="anonymous"
        />
      )}

      {/* Interstitial Ad (for mobile app) */}
      {isCapacitor && (
        <InterstitialAd
          adUnitId={INTERSTITIAL_AD_UNIT_ID}
          trigger="auto"
          autoTriggerDelay={180000} // Show an interstitial every 3 minutes
          onAdShown={() => console.log("Interstitial ad shown")}
          onAdDismissed={() => console.log("Interstitial ad dismissed")}
        />
      )}

      <main className="flex min-h-screen flex-col items-center p-4 pb-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-background">
        <div className={`w-full mx-auto ${isDesktop ? "max-w-4xl" : "max-w-md"}`}>
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AppLogo size={32} />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Convertly
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">Measure everything, anywhere</p>
              </div>
            </div>
            <ModeToggle />
          </header>

          {/* Top Ad Banner - Web version */}
          {!isCapacitor && <GoogleAdBanner className="mb-6" slot="3497144840" />}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="converter"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
              >
                Converter
              </TabsTrigger>
              <TabsTrigger
                value="currency-rates"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
              >
                Currency Rates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="converter" className="space-y-6">
              <div className={isDesktop ? "grid grid-cols-[300px_1fr] gap-6" : "space-y-6"}>
                <CategoryGrid selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
                <ConversionPanel category={selectedCategory} />
              </div>
            </TabsContent>

            <TabsContent value="currency-rates">
              <CurrencyRatesTable />
            </TabsContent>

            {/* Bottom Ad Banner - Web version */}
            {!isCapacitor && <GoogleAdBanner className="mt-6" slot="3497144840" />}
          </Tabs>

          {/* Footer */}
          <footer className="mt-8 text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Info className="h-3 w-3" />
              <span>
                {isDesktop
                  ? "Press Ctrl+D to bookmark this app for quick access"
                  : "Add to home screen for quick access"}
              </span>
            </div>
            <p>© 2025 Convertly. All rights reserved.</p>
          </footer>
        </div>
      </main>

      {/* Install Prompt - Web only */}
      {!isCapacitor && <InstallPrompt />}

      {/* Mobile Ad Banner - Mobile app only */}
      {isCapacitor && <MobileAdBanner position="bottom" adUnitId={BANNER_AD_UNIT_ID} />}
    </>
  )
}
