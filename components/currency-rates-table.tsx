"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, ArrowUp, Minus, Search, TrendingUp, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBreakpoint } from "@/hooks/use-media-query"
import { useCurrencyRates } from "@/hooks/use-currency-rates"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface CurrencyRatesTableProps {
  dict: any
}

export default function CurrencyRatesTable({ dict }: CurrencyRatesTableProps) {
  const [baseCurrency, setBaseCurrency] = useState("USD")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeRegion, setActiveRegion] = useState("Major")
  const [animateItems, setAnimateItems] = useState(false)
  const { isMobile, isTablet, isDesktop } = useBreakpoint()

  const { rates: currencies, loading, error, lastUpdated, refreshRates } = useCurrencyRates()

  // Find the rate of the selected base currency
  const baseRate = currencies.find((c) => c.code === baseCurrency)?.rate || 1

  // Filter currencies based on search query and active region
  const filteredCurrencies = currencies.filter((currency) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by region or major status
    const matchesRegion =
      activeRegion === "All" || (activeRegion === "Major" && currency.major) || currency.region === activeRegion

    // Don't show the base currency
    return currency.code !== baseCurrency && matchesSearch && matchesRegion
  })

  // Trigger animation when base currency changes
  useEffect(() => {
    setAnimateItems(true)
    const timer = setTimeout(() => setAnimateItems(false), 500)
    return () => clearTimeout(timer)
  }, [baseCurrency])

  // Track base currency changes
  const handleBaseCurrencyChange = (newBase: string) => {
    setBaseCurrency(newBase)
    trackEvent(AnalyticsEvents.CURRENCY_BASE_CHANGED, {
      from: baseCurrency,
      to: newBase,
      screen_size: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
    })
  }

  // Handle manual refresh
  const handleRefresh = async () => {
    await refreshRates()
    trackEvent("currency_rates_refreshed", {
      manual: true,
      screen_size: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
    })
  }

  // Get trending currencies (biggest movers)
  const trendingUp = [...currencies]
    .filter((c) => c.code !== baseCurrency)
    .sort((a, b) => b.change - a.change)
    .slice(0, isMobile ? 2 : isTablet ? 3 : 5)

  const trendingDown = [...currencies]
    .filter((c) => c.code !== baseCurrency)
    .sort((a, b) => a.change - b.change)
    .slice(0, isMobile ? 2 : isTablet ? 3 : 5)

  // Get region name from dictionary
  const getRegionName = (region: string) => {
    const regionKey = region.toLowerCase().replace(/\s+/g, "")
    return dict.regions[regionKey] || region
  }

  // Format last updated time
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffHours > 24) {
      return date.toLocaleDateString()
    } else if (diffHours > 0) {
      return `${diffHours}h ago`
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`
    } else {
      return "Just now"
    }
  }

  if (loading && currencies.length === 0) {
    return (
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardTitle className={`text-white ${isMobile ? "text-lg" : "text-xl"}`}>{dict.currency.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">{dict.common.loading}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div
            className={`flex justify-between items-start gap-3 ${isMobile ? "flex-col" : "flex-row sm:items-center"}`}
          >
            <CardTitle className={`text-white ${isMobile ? "text-lg" : "text-xl"}`}>{dict.currency.title}</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5">
                <span className={`font-medium ${isMobile ? "text-xs" : "text-sm"}`}>{dict.currency.base}</span>
                <Select value={baseCurrency} onValueChange={handleBaseCurrencyChange}>
                  <SelectTrigger
                    className={`border-0 bg-transparent text-white focus:ring-0 focus:ring-offset-0 p-0 ${isMobile ? "w-[100px]" : "w-[130px]"}`}
                  >
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <span className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                disabled={loading}
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 ${isMobile ? "text-xs" : "text-sm"}`}
              >
                <TrendingUp className="h-3 w-3" />
                <span>
                  {dict.common.updated} {formatLastUpdated(lastUpdated)}
                </span>
              </div>
              {error && (
                <div
                  className={`flex items-center gap-1 bg-red-500/20 rounded-full px-2 py-0.5 ${isMobile ? "text-xs" : "text-sm"}`}
                >
                  <span>⚠️ {error}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <div
          className={`bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background ${isMobile ? "p-3" : "p-4"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {trendingUp.map((currency) => (
                <Badge
                  key={`up-${currency.code}`}
                  variant="outline"
                  className={`bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 flex items-center gap-1 ${isMobile ? "text-xs" : "text-sm"}`}
                >
                  <span>{currency.flag}</span>
                  <span>{currency.code}</span>
                  <ArrowUp className="h-3 w-3" />
                </Badge>
              ))}
              {trendingDown.map((currency) => (
                <Badge
                  key={`down-${currency.code}`}
                  variant="outline"
                  className={`bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 flex items-center gap-1 ${isMobile ? "text-xs" : "text-sm"}`}
                >
                  <span>{currency.flag}</span>
                  <span>{currency.code}</span>
                  <ArrowDown className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={dict.currency.searchPlaceholder}
              className="pl-9 border-muted bg-white/80 dark:bg-background/80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <CardContent className="p-0">
          <Tabs value={activeRegion} onValueChange={setActiveRegion} className="w-full">
            <div className={`border-b ${isMobile ? "px-3" : "px-4"}`}>
              <TabsList
                className={`h-10 w-full justify-start bg-transparent overflow-x-auto ${isMobile ? "gap-1" : "gap-2"}`}
              >
                {["Major", "Americas", "Europe", "Asia", "Oceania", "Africa", "Middle East"].map((region) => (
                  <TabsTrigger
                    key={region}
                    value={region}
                    className={`data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400 ${isMobile ? "text-xs px-2" : "text-sm"}`}
                  >
                    {getRegionName(region)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className={`max-h-[${isMobile ? "300px" : isTablet ? "400px" : "600px"}] overflow-y-auto`}>
              <div className={isDesktop ? "grid grid-cols-2 divide-x divide-y" : "grid grid-cols-1 divide-y"}>
                {filteredCurrencies.map((currency, index) => {
                  // Calculate the exchange rate relative to the base currency
                  const exchangeRate = currency.rate / baseRate

                  // Determine change indicator
                  let ChangeIcon = Minus
                  let changeColorClass = "text-muted-foreground"

                  if (currency.change > 0) {
                    ChangeIcon = ArrowUp
                    changeColorClass = "text-green-500"
                  } else if (currency.change < 0) {
                    ChangeIcon = ArrowDown
                    changeColorClass = "text-red-500"
                  }

                  return (
                    <div
                      key={currency.code}
                      className={cn(
                        "hover:bg-muted/50 transition-all duration-200 flex items-center justify-between",
                        isMobile ? "p-3" : "p-4",
                        animateItems && "animate-in fade-in slide-in-from-bottom-2",
                        animateItems && `delay-[${index * 50}ms]`,
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 ${isMobile ? "text-xl" : "text-2xl"}`}>{currency.flag}</div>
                        <div>
                          <div className={`font-medium ${isMobile ? "text-sm" : "text-base"}`}>{currency.code}</div>
                          <div className={`text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}>
                            {currency.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono font-medium ${isMobile ? "text-base" : "text-lg"}`}>
                          {exchangeRate.toFixed(4)}
                        </div>
                        <div
                          className={`flex items-center justify-end gap-1 ${changeColorClass} ${isMobile ? "text-xs" : "text-sm"}`}
                        >
                          <ChangeIcon className="h-3 w-3" />
                          <span>{Math.abs(currency.change).toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredCurrencies.length === 0 && (
                  <div className={`text-center text-muted-foreground ${isMobile ? "p-6" : "p-8"}`}>
                    {dict.common.noResults}
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
