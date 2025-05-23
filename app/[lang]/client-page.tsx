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
import LanguageDebug from "@/components/language-debug"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Info } from "lucide-react"
import type { Locale } from "@/lib/i18n-config"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

export default function ClientPage({ lang, dict }: { lang: Locale; dict: any }) {
  const [selectedCategory, setSelectedCategory] = useState("length")
  const [activeTab, setActiveTab] = useState("converter")
  const [showSplash, setShowSplash] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 768px)")

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
    trackEvent(AnalyticsEvents.CATEGORY_SELECTED, {
      category: "tab",
      label: value,
    })
  }

  // Track when the user changes categories
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    trackEvent(AnalyticsEvents.CATEGORY_SELECTED, {
      category: "conversion_category",
      label: category,
    })
  }

  if (showSplash) {
    return <SplashScreen slogan={dict.app.slogan} />
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pb-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-background">
      <div className={`w-full mx-auto ${isDesktop ? "max-w-4xl" : "max-w-md"}`}>
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AppLogo size={32} />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                {dict.app.name}
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">{dict.app.slogan}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector currentLocale={lang} />
            <ModeToggle />
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="converter"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
            >
              {dict.tabs.converter}
            </TabsTrigger>
            <TabsTrigger
              value="currency-rates"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
            >
              {dict.tabs.currencyRates}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="space-y-6">
            <div className={isDesktop ? "grid grid-cols-[300px_1fr] gap-6" : "space-y-6"}>
              <CategoryGrid selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} dict={dict} />
              <ConversionPanel category={selectedCategory} dict={dict} />
            </div>
          </TabsContent>

          <TabsContent value="currency-rates">
            <CurrencyRatesTable dict={dict} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Info className="h-3 w-3" />
            <span>{isDesktop ? dict.common.bookmark : dict.common.homeScreen}</span>
          </div>
          <p>{dict.common.copyright}</p>
        </footer>
      </div>

      {/* Debug component */}
      <LanguageDebug currentLocale={lang} />
    </main>
  )
}
