// Currency exchange rates service
export interface CurrencyRate {
  code: string
  name: string
  flag: string
  rate: number
  change: number
  region: string
  major: boolean
}

// Updated rates as of January 2025
const CURRENT_RATES: CurrencyRate[] = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", rate: 1, change: 0, region: "Americas", major: true },
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 0.91, change: -0.015, region: "Europe", major: true },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", rate: 0.78, change: 0.008, region: "Europe", major: true },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", rate: 156.25, change: -2.15, region: "Asia", major: true },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", rate: 1.44, change: 0.02, region: "Americas", major: false },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", rate: 1.62, change: 0.035, region: "Oceania", major: false },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", rate: 7.32, change: 0.18, region: "Asia", major: true },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", rate: 85.45, change: 0.65, region: "Asia", major: false },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", rate: 0.89, change: -0.008, region: "Europe", major: false },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", rate: 1.35, change: 0.015, region: "Asia", major: false },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽", rate: 20.15, change: 0.45, region: "Americas", major: false },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷", rate: 6.12, change: 0.28, region: "Americas", major: false },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺", rate: 98.75, change: 2.35, region: "Europe", major: false },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷", rate: 1445.8, change: 18.5, region: "Asia", major: false },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦", rate: 18.95, change: -0.25, region: "Africa", major: false },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪", rate: 10.85, change: 0.12, region: "Europe", major: false },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿", rate: 1.75, change: 0.045, region: "Oceania", major: false },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷", rate: 34.25, change: 0.95, region: "Europe", major: false },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪", rate: 3.67, change: 0, region: "Middle East", major: false },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰", rate: 7.78, change: -0.02, region: "Asia", major: false },
]

// Cache for storing rates with timestamp
interface CurrencyCache {
  rates: CurrencyRate[]
  lastUpdated: number
  nextUpdate: number
}

const CACHE_KEY = "convertly_currency_rates"
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export class CurrencyService {
  private static instance: CurrencyService
  private cache: CurrencyCache | null = null

  private constructor() {}

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService()
    }
    return CurrencyService.instance
  }

  // Get cached rates or fetch new ones
  async getRates(): Promise<CurrencyRate[]> {
    // Always return current rates for server-side rendering
    if (typeof window === "undefined") {
      return CURRENT_RATES
    }

    // Check cache first
    const cached = this.getFromCache()
    if (cached && this.isCacheValid(cached)) {
      return cached.rates
    }

    // Try to fetch live rates, fallback to current rates
    try {
      const liveRates = await this.fetchLiveRates()
      this.saveToCache(liveRates)
      return liveRates
    } catch (error) {
      console.warn("Failed to fetch live rates, using cached/default rates:", error)
      return cached?.rates || CURRENT_RATES
    }
  }

  // Fetch live rates from a free API
  private async fetchLiveRates(): Promise<CurrencyRate[]> {
    try {
      // Using exchangerate-api.com (free tier: 1500 requests/month)
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Map the API response to our currency format
      return CURRENT_RATES.map((currency) => {
        const apiRate = data.rates?.[currency.code]
        if (apiRate && currency.code !== "USD") {
          // Calculate change (simulate based on small random variation)
          const change = (Math.random() - 0.5) * 0.1 * apiRate
          return {
            ...currency,
            rate: apiRate,
            change: Number.parseFloat(change.toFixed(4)),
          }
        }
        return currency
      })
    } catch (error) {
      console.error("Error fetching live rates:", error)
      throw error
    }
  }

  // Cache management
  private getFromCache(): CurrencyCache | null {
    if (typeof window === "undefined") return null

    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error("Error reading from cache:", error)
      return null
    }
  }

  private saveToCache(rates: CurrencyRate[]): void {
    if (typeof window === "undefined") return

    try {
      const cache: CurrencyCache = {
        rates,
        lastUpdated: Date.now(),
        nextUpdate: Date.now() + CACHE_DURATION,
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
      this.cache = cache
    } catch (error) {
      console.error("Error saving to cache:", error)
    }
  }

  private isCacheValid(cache: CurrencyCache): boolean {
    return Date.now() < cache.nextUpdate
  }

  // Check if monthly update is needed
  shouldUpdateMonthly(): boolean {
    if (typeof window === "undefined") return false

    const cached = this.getFromCache()
    if (!cached) return true

    const monthsSinceUpdate = (Date.now() - cached.lastUpdated) / (30 * 24 * 60 * 60 * 1000)
    return monthsSinceUpdate >= 1
  }

  // Force refresh rates
  async refreshRates(): Promise<CurrencyRate[]> {
    try {
      const liveRates = await this.fetchLiveRates()
      this.saveToCache(liveRates)
      return liveRates
    } catch (error) {
      console.error("Failed to refresh rates:", error)
      return CURRENT_RATES
    }
  }

  // Get last update timestamp
  getLastUpdateTime(): Date | null {
    if (typeof window === "undefined") return null

    const cached = this.getFromCache()
    return cached ? new Date(cached.lastUpdated) : null
  }
}

// Export singleton instance
export const currencyService = CurrencyService.getInstance()
