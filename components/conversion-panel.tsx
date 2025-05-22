"use client"

import { useState, useEffect } from "react"
import { ArrowDownUp, TrendingUp, Copy, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Conversion units for different categories
const conversionUnits = {
  length: [
    { id: "m", name: "Meters" },
    { id: "cm", name: "Centimeters" },
    { id: "km", name: "Kilometers" },
    { id: "in", name: "Inches" },
    { id: "ft", name: "Feet" },
    { id: "yd", name: "Yards" },
    { id: "mi", name: "Miles" },
  ],
  weight: [
    { id: "kg", name: "Kilograms" },
    { id: "g", name: "Grams" },
    { id: "mg", name: "Milligrams" },
    { id: "lb", name: "Pounds" },
    { id: "oz", name: "Ounces" },
    { id: "st", name: "Stone" },
  ],
  temperature: [
    { id: "c", name: "Celsius" },
    { id: "f", name: "Fahrenheit" },
    { id: "k", name: "Kelvin" },
  ],
  volume: [
    { id: "l", name: "Liters" },
    { id: "ml", name: "Milliliters" },
    { id: "gal", name: "Gallons" },
    { id: "qt", name: "Quarts" },
    { id: "pt", name: "Pints" },
    { id: "cup", name: "Cups" },
    { id: "oz", name: "Fluid Ounces" },
  ],
  time: [
    { id: "s", name: "Seconds" },
    { id: "min", name: "Minutes" },
    { id: "h", name: "Hours" },
    { id: "d", name: "Days" },
    { id: "wk", name: "Weeks" },
    { id: "mo", name: "Months" },
    { id: "yr", name: "Years" },
  ],
  currency: [
    { id: "usd", name: "US Dollar (USD)" },
    { id: "eur", name: "Euro (EUR)" },
    { id: "gbp", name: "British Pound (GBP)" },
    { id: "jpy", name: "Japanese Yen (JPY)" },
    { id: "cad", name: "Canadian Dollar (CAD)" },
    { id: "aud", name: "Australian Dollar (AUD)" },
    { id: "cny", name: "Chinese Yuan (CNY)" },
    { id: "inr", name: "Indian Rupee (INR)" },
    { id: "chf", name: "Swiss Franc (CHF)" },
    { id: "sgd", name: "Singapore Dollar (SGD)" },
  ],
}

// Conversion rates for different categories
const conversionRates = {
  length: {
    m: 1,
    cm: 100,
    km: 0.001,
    in: 39.3701,
    ft: 3.28084,
    yd: 1.09361,
    mi: 0.000621371,
  },
  weight: {
    kg: 1,
    g: 1000,
    mg: 1000000,
    lb: 2.20462,
    oz: 35.274,
    st: 0.157473,
  },
  temperature: {
    // Special case - handled in conversion function
    c: 1,
    f: 1,
    k: 1,
  },
  volume: {
    l: 1,
    ml: 1000,
    gal: 0.264172,
    qt: 1.05669,
    pt: 2.11338,
    cup: 4.22675,
    oz: 33.814,
  },
  time: {
    s: 1,
    min: 1 / 60,
    h: 1 / 3600,
    d: 1 / 86400,
    wk: 1 / 604800,
    mo: 1 / 2592000,
    yr: 1 / 31536000,
  },
  currency: {
    // Updated rates as of May 2025 (projected values)
    usd: 1,
    eur: 0.89,
    gbp: 0.76,
    jpy: 162.45,
    cad: 1.42,
    aud: 1.58,
    cny: 7.05,
    inr: 87.65,
    chf: 0.88,
    sgd: 1.32,
  },
}

// Gradient colors for different categories
const categoryGradients = {
  length: "from-blue-500 to-cyan-500",
  weight: "from-purple-500 to-pink-500",
  temperature: "from-red-500 to-orange-500",
  volume: "from-cyan-500 to-blue-500",
  time: "from-amber-500 to-yellow-500",
  currency: "from-emerald-500 to-teal-600",
}

interface ConversionPanelProps {
  category: string
  dict: any
}

export default function ConversionPanel({ category, dict }: ConversionPanelProps) {
  const [fromValue, setFromValue] = useState<string>("1")
  const [toValue, setToValue] = useState<string>("")
  const [fromUnit, setFromUnit] = useState("")
  const [toUnit, setToUnit] = useState("")
  const [animate, setAnimate] = useState(false)
  const [copied, setCopied] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Set default units when category changes
  useEffect(() => {
    if (conversionUnits[category as keyof typeof conversionUnits]) {
      const units = conversionUnits[category as keyof typeof conversionUnits]
      setFromUnit(units[0].id)
      setToUnit(units[1].id)
      setAnimate(true)
      setTimeout(() => setAnimate(false), 500)
    }
  }, [category])

  // Convert values when inputs change
  useEffect(() => {
    if (fromValue && !isNaN(Number(fromValue)) && fromUnit && toUnit) {
      const result = convert(Number(fromValue), fromUnit, toUnit, category)
      setToValue(result.toFixed(4))
    } else {
      setToValue("")
    }
  }, [fromValue, fromUnit, toUnit, category])

  // Keyboard shortcuts for desktop
  useEffect(() => {
    if (!isDesktop) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S to swap units
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        handleSwap()
      }
      // Ctrl+C to copy result
      else if (e.ctrlKey && e.key === "c" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        copyToClipboard()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isDesktop, fromUnit, toUnit, toValue])

  // Conversion function
  const convert = (value: number, from: string, to: string, category: string) => {
    // Special case for temperature
    if (category === "temperature") {
      // Convert to Celsius first
      let celsius
      if (from === "c") celsius = value
      else if (from === "f") celsius = ((value - 32) * 5) / 9
      else if (from === "k") celsius = value - 273.15
      else return 0

      // Convert from Celsius to target
      if (to === "c") return celsius
      else if (to === "f") return (celsius * 9) / 5 + 32
      else if (to === "k") return celsius + 273.15
      else return 0
    }

    // For other categories, use the conversion rates
    const rates = conversionRates[category as keyof typeof conversionRates]
    if (!rates) return 0

    // Convert from source unit to base unit, then to target unit
    const baseValue = value / (rates[from as keyof typeof rates] || 1)
    return baseValue * (rates[to as keyof typeof rates] || 1)
  }

  // Swap units and values
  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
  }

  // Copy result to clipboard
  const copyToClipboard = () => {
    if (!toValue) return

    // Get unit names from dictionary if available
    const getUnitName = (unitId: string) => {
      if (dict.units && dict.units[category] && dict.units[category][unitId]) {
        return dict.units[category][unitId]
      }
      // Fallback to default unit names
      return conversionUnits[category as keyof typeof conversionUnits]?.find((u) => u.id === unitId)?.name || unitId
    }

    const fromUnitName = getUnitName(fromUnit)
    const toUnitName = getUnitName(toUnit)

    const textToCopy = `${fromValue} ${fromUnitName} = ${toValue} ${toUnitName}`
    navigator.clipboard.writeText(textToCopy)

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get current units for the selected category
  const currentUnits = conversionUnits[category as keyof typeof conversionUnits] || []

  // Get gradient for current category
  const gradient = categoryGradients[category as keyof typeof categoryGradients] || "from-emerald-500 to-teal-600"

  // Get unit name from dictionary
  const getUnitName = (unit: { id: string; name: string }) => {
    if (dict.units && dict.units[category] && dict.units[category][unit.id]) {
      return dict.units[category][unit.id]
    }
    return unit.name
  }

  return (
    <Card
      className={cn(
        "overflow-hidden border-none shadow-lg transition-all duration-300",
        animate && "animate-in fade-in zoom-in-95",
      )}
    >
      <CardHeader className={`bg-gradient-to-r ${gradient} text-white`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">
            {dict.converter.title} {dict.categories[category]}
          </CardTitle>
          {category === "currency" && (
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>{dict.common.updated} May 2025</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950/50 dark:to-background">
        <div className="space-y-4">
          {/* From unit */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{dict.common.from}</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="flex-1 bg-white/80 dark:bg-background/80 border-muted"
              />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger
                  className={`${isDesktop ? "w-[180px]" : "w-[140px]"} bg-white/80 dark:bg-background/80 border-muted`}
                >
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {getUnitName(unit)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSwap}
                    className="rounded-full h-10 w-10 bg-white dark:bg-gray-900 shadow-sm hover:shadow"
                  >
                    <ArrowDownUp className="h-4 w-4" />
                    <span className="sr-only">{dict.common.swap}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {dict.common.swap} {isDesktop && "(Ctrl+S)"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* To unit */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{dict.common.to}</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={toValue}
                  readOnly
                  className="flex-1 pr-10 bg-white/80 dark:bg-background/80 border-muted font-mono"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-10 px-3 text-muted-foreground hover:text-foreground"
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">{copied ? dict.common.copied : dict.common.copy}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? dict.common.copied : `${dict.common.copy} ${isDesktop && "(Ctrl+C)"}`}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger
                  className={`${isDesktop ? "w-[180px]" : "w-[140px]"} bg-white/80 dark:bg-background/80 border-muted`}
                >
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {getUnitName(unit)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isDesktop && (
          <div className="text-xs text-muted-foreground mt-4">
            <p>{dict.converter.shortcuts}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
