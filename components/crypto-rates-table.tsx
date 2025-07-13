"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RefreshCw, Search, TrendingUp, ArrowUp, ArrowDown, Minus, Activity } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useBreakpoint } from "@/hooks/use-media-query"
import { useCryptoRates } from "@/hooks/use-crypto-rates"
import type { CryptoRate } from "@/lib/crypto-service"

interface CryptoRatesTableProps {
  initialCryptoRates: CryptoRate[]
}

const CryptoRatesTable: React.FC<CryptoRatesTableProps> = ({ initialCryptoRates }) => {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortBy, setSortBy] = React.useState<"rank" | "price" | "change" | "volume">("rank")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc")

  const { isMobile, isTablet } = useBreakpoint()

  const {
    rates: cryptoRates,
    loading,
    error,
    lastUpdated,
    autoRefresh,
    refreshRates,
    toggleAutoRefresh,
  } = useCryptoRates(initialCryptoRates)

  // Filter and sort rates
  const filteredAndSortedRates = React.useMemo(() => {
    const filtered = cryptoRates.filter(
      (rate) =>
        rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: number, bValue: number

      switch (sortBy) {
        case "rank":
          aValue = a.rank || 999
          bValue = b.rank || 999
          break
        case "price":
          aValue = Number.parseFloat(a.priceUsd)
          bValue = Number.parseFloat(b.priceUsd)
          break
        case "change":
          aValue = Number.parseFloat(a.changePercent24Hr)
          bValue = Number.parseFloat(b.changePercent24Hr)
          break
        case "volume":
          aValue = a.volume24h || 0
          bValue = b.volume24h || 0
          break
        default:
          return 0
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [cryptoRates, searchTerm, sortBy, sortOrder])

  // Handle sort
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  // Format price
  const formatPrice = (price: string) => {
    const num = Number.parseFloat(price)
    if (num >= 1) return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    if (num >= 0.01) return `$${num.toFixed(4)}`
    return `$${num.toFixed(6)}`
  }

  // Get change indicator
  const getChangeIndicator = (change: string) => {
    const changeNum = Number.parseFloat(change)
    if (changeNum > 0) {
      return { icon: ArrowUp, color: "text-green-500", bgColor: "bg-green-50 dark:bg-green-900/20" }
    } else if (changeNum < 0) {
      return { icon: ArrowDown, color: "text-red-500", bgColor: "bg-red-50 dark:bg-red-900/20" }
    }
    return { icon: Minus, color: "text-gray-500", bgColor: "bg-gray-50 dark:bg-gray-900/20" }
  }

  // Format last updated time
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    return date.toLocaleDateString()
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className={`flex justify-between items-start gap-3 ${isMobile ? "flex-col" : "flex-row sm:items-center"}`}>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <CardTitle className={`text-white ${isMobile ? "text-lg" : "text-xl"}`}>Cryptocurrency Prices</CardTitle>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-refresh toggle */}
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5">
              <Switch
                checked={autoRefresh}
                onCheckedChange={toggleAutoRefresh}
                className="data-[state=checked]:bg-white/30"
              />
              <Label className={`text-white cursor-pointer ${isMobile ? "text-xs" : "text-sm"}`}>Auto-refresh</Label>
            </div>

            {/* Manual refresh button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshRates}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 ${isMobile ? "text-xs" : "text-sm"}`}
            >
              <TrendingUp className="h-3 w-3" />
              <span>Updated {formatLastUpdated(lastUpdated)}</span>
            </div>
            {error && (
              <div
                className={`flex items-center gap-1 bg-red-500/20 rounded-full px-2 py-0.5 ${isMobile ? "text-xs" : "text-sm"}`}
              >
                <span>⚠️ {error}</span>
              </div>
            )}
          </div>

          <Badge variant="outline" className="bg-white/20 text-white border-white/30">
            {filteredAndSortedRates.length} coins
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Search and controls */}
        <div className={`border-b ${isMobile ? "p-3" : "p-4"}`}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              className="pl-9 border-muted bg-white/80 dark:bg-background/80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div>
          {/* Wrapper div – no overflow limits */}
          <Table className="w-full caption-bottom text-sm table-fixed">
            <TableHeader className="sticky top-0 bg-background/95 backdrop-blur">
              <TableRow>
                <TableHead
                  className={cn("cursor-pointer hover:bg-muted/50", isMobile ? "w-[10%]" : "w-[5%]")}
                  onClick={() => handleSort("rank")}
                >
                  <div className="flex items-center gap-1">
                    #
                    {sortBy === "rank" &&
                      (sortOrder === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </div>
                </TableHead>
                <TableHead className={cn(isMobile ? "w-[40%]" : "w-[40%]")}>
                  {/* Adjusted width */}
                  Name
                </TableHead>
                <TableHead
                  className={cn("cursor-pointer hover:bg-muted/50 text-right", isMobile ? "w-[25%]" : "w-[20%]")}
                  onClick={() => handleSort("price")}
                >
                  {/* Adjusted width */}
                  <div className="flex items-center justify-end gap-1">
                    Price
                    {sortBy === "price" &&
                      (sortOrder === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </div>
                </TableHead>
                <TableHead
                  className={cn("cursor-pointer hover:bg-muted/50 text-right", isMobile ? "w-[25%]" : "w-[15%]")}
                  onClick={() => handleSort("change")}
                >
                  {/* Adjusted width */}
                  <div className="flex items-center justify-end gap-1">
                    24h %
                    {sortBy === "change" &&
                      (sortOrder === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </div>
                </TableHead>
                {!isMobile && (
                  <TableHead
                    className="w-[20%] cursor-pointer hover:bg-muted/50 text-right" // Adjusted width
                    onClick={() => handleSort("volume")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Volume (24h)
                      {sortBy === "volume" &&
                        (sortOrder === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                    </div>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedRates.map((rate) => {
                const changeIndicator = getChangeIndicator(rate.changePercent24Hr)
                const ChangeIcon = changeIndicator.icon

                return (
                  <TableRow key={rate.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-muted-foreground">{rate.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative w-6 h-6 flex-shrink-0">
                          <Image
                            src={rate.imageUrl || "/placeholder.svg"}
                            alt={`${rate.name} icon`}
                            width={24}
                            height={24}
                            className="rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=24&width=24"
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{rate.name}</div>
                          <div className="text-sm text-muted-foreground">{rate.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatPrice(rate.priceUsd)}</TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${changeIndicator.bgColor}`}
                      >
                        <ChangeIcon className={`h-3 w-3 ${changeIndicator.color}`} />
                        <span className={`font-medium ${changeIndicator.color}`}>
                          {Math.abs(Number.parseFloat(rate.changePercent24Hr)).toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                    {!isMobile && (
                      <TableCell className="text-right font-mono text-sm">
                        {rate.volume24h ? formatNumber(rate.volume24h) : "N/A"}
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}

              {filteredAndSortedRates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isMobile ? 4 : 5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No cryptocurrencies found matching your search." : "No data available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default CryptoRatesTable
