"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "@/components/mode-toggle"
import CategoryGrid from "@/components/category-grid"
import ConversionPanel from "@/components/conversion-panel"
import CurrencyRatesTable from "@/components/currency-rates-table"
import SplashScreen from "@/components/splash-screen"
import AppLogo from "@/components/app-logo"
import LanguageSelector from "@/components/language-selector"
import { ResponsiveLayout } from "@/components/responsive-layout"
import { useBreakpoint } from "@/hooks/use-media-query"
import { Info } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

export default function ClientPage({ lang, dict }: { lang: Locale; dict: any }) {
  const [selectedCategory, setSelectedCategory] = useState("length")
  const [activeTab, setActiveTab] = useState("converter")
  const [showSplash, setShowSplash] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { isMobile, isTablet, isDesktop } = useBreakpoint()

  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000) // 3 seconds for the animation

    return () => clearTimeout(timer)
  }, [])

  // Track when the user changes tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Safe analytics tracking
    if (mounted) {
      try {
        trackEvent(AnalyticsEvents.CATEGORY_SELECTED, {
          category: "tab",
          label: value,
          screen_size: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
        })
      } catch (error) {
        console.error("Analytics tracking error:", error)
      }
    }
  }

  // Track when the user changes categories
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)

    // Safe analytics tracking
    if (mounted) {
      try {
        trackEvent(AnalyticsEvents.CATEGORY_SELECTED, {
          category: "conversion_category",
          label: category,
          screen_size: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
        })
      } catch (error) {
        console.error("Analytics tracking error:", error)
      }
    }
  }

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return null
  }

  if (showSplash) {
    return <SplashScreen slogan={dict.app.slogan} />
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-background">
      <ResponsiveLayout className="py-4 pb-24">
        {/* Header - Responsive */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AppLogo size={isMobile ? 28 : 32} />
            <div>
              <h1
                className={`font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent ${
                  isMobile ? "text-xl" : "text-2xl"
                }`}
              >
                {dict.app.name}
              </h1>
              <p className={`text-muted-foreground -mt-1 ${isMobile ? "text-xs" : "text-sm"}`}>{dict.app.slogan}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector currentLocale={lang} />
            <ModeToggle />
          </div>
        </header>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Tab Navigation - Responsive */}
          <TabsList className={`grid w-full grid-cols-2 mb-6 ${isMobile ? "h-10" : "h-12"}`}>
            <TabsTrigger
              value="converter"
              className={`data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400 ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              {dict.tabs.converter}
            </TabsTrigger>
            <TabsTrigger
              value="currency-rates"
              className={`data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400 ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              {dict.tabs.currencyRates}
            </TabsTrigger>
          </TabsList>

          {/* Converter Tab - Responsive Layout */}
          <TabsContent value="converter" className="space-y-6">
            <div
              className={
                isDesktop
                  ? "grid grid-cols-[300px_1fr] gap-6"
                  : isTablet
                    ? "grid grid-cols-[250px_1fr] gap-4"
                    : "space-y-6"
              }
            >
              <CategoryGrid selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} dict={dict} />
              <ConversionPanel category={selectedCategory} dict={dict} />
            </div>
          </TabsContent>

          {/* Currency Rates Tab */}
          <TabsContent value="currency-rates">
            <CurrencyRatesTable dict={dict} />
          </TabsContent>
        </Tabs>

        {/* Footer - Responsive */}
        <footer className={`mt-8 text-center text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}>
          <div className="flex items-center justify-center gap-1 mb-2">
            <Info className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            <span>{isDesktop ? dict.common.bookmark : dict.common.homeScreen}</span>
          </div>
          <p>{dict.common.copyright}</p>
        </footer>
      </ResponsiveLayout>
    </main>
  )
}
