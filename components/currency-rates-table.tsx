"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, ArrowUp, Minus, Search, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

// Currency data with codes, names, and exchange rates (projected for 2025)
const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", rate: 1, change: 0, region: "Americas", major: true },
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 0.89, change: -0.02, region: "Europe", major: true },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", rate: 0.76, change: 0.01, region: "Europe", major: true },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", rate: 162.45, change: 1.25, region: "Asia", major: true },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", rate: 1.42, change: -0.03, region: "Americas", major: false },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", rate: 1.58, change: 0.04, region: "Oceania", major: false },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", rate: 7.05, change: -0.12, region: "Asia", major: true },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", rate: 87.65, change: 0.75, region: "Asia", major: false },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", rate: 0.88, change: -0.01, region: "Europe", major: false },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", rate: 1.32, change: -0.02, region: "Asia", major: false },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽", rate: 18.25, change: 0.35, region: "Americas", major: false },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷", rate: 5.35, change: 0.15, region: "Americas", major: false },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺", rate: 96.75, change: 1.45, region: "Europe", major: false },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷", rate: 1425.8, change: 12.5, region: "Asia", major: false },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦", rate: 19.85, change: 0.45, region: "Africa", major: false },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪", rate: 10.25, change: -0.15, region: "Europe", major: false },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿", rate: 1.68, change: 0.03, region: "Oceania", major: false },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷", rate: 32.75, change: 0.85, region: "Europe", major: false },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪", rate: 3.67, change: 0, region: "Middle East", major: false },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰", rate: 7.82, change: 0.01, region: "Asia", major: false },
]

interface CurrencyRatesTableProps {
  dict: any
}

export default function CurrencyRatesTable({ dict }: CurrencyRatesTableProps) {
  const [baseCurrency, setBaseCurrency] = useState("USD")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeRegion, setActiveRegion] = useState("Major")
  const [animateItems, setAnimateItems] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

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

  // Get trending currencies (biggest movers)
  const trendingUp = [...currencies]
    .filter((c) => c.code !== baseCurrency)
    .sort((a, b) => b.change - a.change)
    .slice(0, isDesktop ? 5 : 3)

  const trendingDown = [...currencies]
    .filter((c) => c.code !== baseCurrency)
    .sort((a, b) => a.change - b.change)
    .slice(0, isDesktop ? 5 : 3)

  // Get region name from dictionary
  const getRegionName = (region: string) => {
    const regionKey = region.toLowerCase().replace(/\s+/g, "")
    return dict.regions[regionKey] || region
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="text-white">{dict.currency.title}</CardTitle>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5">
              <span className="text-sm font-medium">{dict.currency.base}</span>
              <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                <SelectTrigger className="w-[130px] border-0 bg-transparent text-white focus:ring-0 focus:ring-offset-0 p-0">
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
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>{dict.common.updated} May 2025</span>
            </div>
          </div>
        </CardHeader>

        <div className="p-4 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {trendingUp.map((currency) => (
                <Badge
                  key={`up-${currency.code}`}
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 flex items-center gap-1"
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
                  className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 flex items-center gap-1"
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
            <div className="px-4 border-b">
              <TabsList className="h-10 w-full justify-start bg-transparent overflow-x-auto">
                {["Major", "Americas", "Europe", "Asia", "Oceania", "Africa", "Middle East"].map((region) => (
                  <TabsTrigger
                    key={region}
                    value={region}
                    className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400"
                  >
                    {getRegionName(region)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className={`max-h-[${isDesktop ? "600px" : "400px"}] overflow-y-auto`}>
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
                        "p-4 hover:bg-muted/50 transition-all duration-200 flex items-center justify-between",
                        animateItems && "animate-in fade-in slide-in-from-bottom-2",
                        animateItems && `delay-[${index * 50}ms]`,
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 text-2xl">{currency.flag}</div>
                        <div>
                          <div className="font-medium">{currency.code}</div>
                          <div className="text-sm text-muted-foreground">{currency.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-lg font-medium">{exchangeRate.toFixed(4)}</div>
                        <div className={`text-xs flex items-center justify-end gap-1 ${changeColorClass}`}>
                          <ChangeIcon className="h-3 w-3" />
                          <span>{Math.abs(currency.change).toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredCurrencies.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">{dict.common.noResults}</div>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
