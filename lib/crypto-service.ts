// Cryptocurrency service for fetching real-time data from CoinGecko
export interface CryptoRate {
  id: string
  name: string
  symbol: string
  priceUsd: string
  changePercent24Hr: string
  imageUrl: string
  marketCap?: number
  volume24h?: number
  rank?: number
}

// Cache for storing crypto rates with timestamp
interface CryptoCache {
  rates: CryptoRate[]
  lastUpdated: number
  nextUpdate: number
}

const CACHE_KEY = "convertly_crypto_rates"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"

// Fallback data for when API is unavailable
const CRYPTO_FALLBACK: CryptoRate[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    priceUsd: "43250.00",
    changePercent24Hr: "2.45",
    imageUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    marketCap: 850000000000,
    volume24h: 25000000000,
    rank: 1,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    priceUsd: "2580.00",
    changePercent24Hr: "-1.23",
    imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    marketCap: 310000000000,
    volume24h: 15000000000,
    rank: 2,
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    priceUsd: "1.00",
    changePercent24Hr: "0.01",
    imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    marketCap: 95000000000,
    volume24h: 45000000000,
    rank: 3,
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    priceUsd: "315.50",
    changePercent24Hr: "1.87",
    imageUrl: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    marketCap: 47000000000,
    volume24h: 1200000000,
    rank: 4,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    priceUsd: "98.75",
    changePercent24Hr: "4.32",
    imageUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    marketCap: 45000000000,
    volume24h: 2800000000,
    rank: 5,
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    priceUsd: "0.52",
    changePercent24Hr: "-0.85",
    imageUrl: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
    marketCap: 18000000000,
    volume24h: 450000000,
    rank: 6,
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    priceUsd: "0.63",
    changePercent24Hr: "3.21",
    imageUrl: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
    marketCap: 35000000000,
    volume24h: 1800000000,
    rank: 7,
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    priceUsd: "0.085",
    changePercent24Hr: "5.67",
    imageUrl: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
    marketCap: 12000000000,
    volume24h: 800000000,
    rank: 8,
  },
]

export class CryptoService {
  private static instance: CryptoService
  private cache: CryptoCache | null = null

  private constructor() {}

  static getInstance(): CryptoService {
    if (!CryptoService.instance) {
      CryptoService.instance = new CryptoService()
    }
    return CryptoService.instance
  }

  // Get cached rates or fetch new ones
  async getRates(): Promise<CryptoRate[]> {
    // Always return fallback for server-side rendering or if window is undefined
    if (typeof window === "undefined") {
      return CRYPTO_FALLBACK
    }

    // Check cache first
    const cached = this.getFromCache()
    if (cached && this.isCacheValid(cached)) {
      return cached.rates
    }

    // Try to fetch live rates, fallback to cached/default rates
    try {
      const liveRates = await this.fetchLiveRates()
      this.saveToCache(liveRates)
      return liveRates
    } catch (error) {
      console.warn("Failed to fetch live crypto rates, using cached/fallback rates:", error)
      return cached?.rates || CRYPTO_FALLBACK
    }
  }

  // Fetch live rates from CoinGecko API
  private async fetchLiveRates(): Promise<CryptoRate[]> {
    try {
      const response = await fetch(
        `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`, // Increased per_page
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Convertly/1.0",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid API response format or empty data")
      }

      return data.map((coin: any, index: number) => ({
        id: coin.id || "unknown",
        name: coin.name || "Unknown",
        symbol: (coin.symbol || "UNK").toUpperCase(),
        priceUsd: (coin.current_price || 0).toString(),
        changePercent24Hr: (coin.price_change_percentage_24h || 0).toFixed(2),
        imageUrl: coin.image || "/placeholder.svg?height=24&width=24",
        marketCap: coin.market_cap || 0,
        volume24h: coin.total_volume || 0,
        rank: coin.market_cap_rank || index + 1,
      }))
    } catch (error) {
      console.error("Error fetching live crypto rates:", error)
      throw error
    }
  }

  // Cache management
  private getFromCache(): CryptoCache | null {
    if (typeof window === "undefined") return null

    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error("Error reading crypto cache:", error)
      return null
    }
  }

  private saveToCache(rates: CryptoRate[]): void {
    if (typeof window === "undefined") return

    try {
      const cache: CryptoCache = {
        rates,
        lastUpdated: Date.now(),
        nextUpdate: Date.now() + CACHE_DURATION,
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
      this.cache = cache
    } catch (error) {
      console.error("Error saving crypto cache:", error)
    }
  }

  private isCacheValid(cache: CryptoCache): boolean {
    return Date.now() < cache.nextUpdate
  }

  // Force refresh rates
  async refreshRates(): Promise<CryptoRate[]> {
    try {
      const liveRates = await this.fetchLiveRates()
      this.saveToCache(liveRates)
      return liveRates
    } catch (error) {
      console.error("Failed to refresh crypto rates:", error)
      throw error
    }
  }

  // Get last update timestamp
  getLastUpdateTime(): Date | null {
    if (typeof window === "undefined") return null

    const cached = this.getFromCache()
    return cached ? new Date(cached.lastUpdated) : null
  }

  // Check if rates need updating
  shouldUpdate(): boolean {
    if (typeof window === "undefined") return false

    const cached = this.getFromCache()
    if (!cached) return true

    return !this.isCacheValid(cached)
  }
}

// Export singleton instance
export const cryptoService = CryptoService.getInstance()

// This function is specifically for server-side initial data fetching
export async function getInitialCryptoRates(): Promise<CryptoRate[]> {
  // In development, always return fallback data to avoid rate limits and simplify local testing
  if (process.env.NODE_ENV === "development") {
    console.log("Returning crypto fallback data in development mode.")
    return CRYPTO_FALLBACK
  }

  try {
    // Use the cryptoService to get rates, which handles fetching and caching
    const rates = await cryptoService.getRates()
    return rates
  } catch (error) {
    console.error("Error fetching initial crypto rates on server:", error)
    return CRYPTO_FALLBACK
  }
}
