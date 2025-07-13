import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/lib/i18n-config"
import { defaultLocale, locales } from "@/lib/i18n-config"
import ClientPage from "./client-page"
import { redirect } from "next/navigation"

// Static fallback data that matches the expected structure
const CRYPTO_FALLBACK = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    priceUsd: "43250.00",
    changePercent24Hr: "2.45",
    imageUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    priceUsd: "2580.00",
    changePercent24Hr: "-1.23",
    imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    priceUsd: "1.00",
    changePercent24Hr: "0.01",
    imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    priceUsd: "315.50",
    changePercent24Hr: "1.87",
    imageUrl: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    priceUsd: "98.75",
    changePercent24Hr: "4.32",
    imageUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  },
]

async function getInitialCryptoRates() {
  // Always return fallback data in preview/development to avoid fetch issues
  if (process.env.NODE_ENV === "development") {
    console.warn("Running in development mode, using fallback crypto data.")
    return CRYPTO_FALLBACK
  }

  try {
    // Simple fetch without AbortController to avoid compatibility issues
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false",
      {
        next: { revalidate: 3600 }, // 1 hour cache
        headers: {
          Accept: "application/json",
          "User-Agent": "Convertly/1.0", // Added User-Agent header
        },
      },
    )

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText || "Unknown Error"}`)
    }

    const data = await res.json()

    // Validate the response structure
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid API response: Data is not an array or is empty.")
    }

    return data.map((coin: any) => ({
      id: coin.id || "unknown",
      name: coin.name || "Unknown",
      symbol: (coin.symbol || "UNK").toUpperCase(),
      priceUsd: (coin.current_price || 0).toString(),
      changePercent24Hr: (coin.price_change_percentage_24h || 0).toString(),
      imageUrl: coin.image || "/placeholder.svg?height=20&width=20", // Provide a fallback image
    }))
  } catch (error) {
    console.warn("Crypto API fetch failed, using fallback data:", error)
    return CRYPTO_FALLBACK
  }
}

// Generate static params for all supported locales
export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale.code,
  }))
}

export default async function LocalePage({ params }: { params: { lang: string } }) {
  // Validate the locale parameter
  const isValidLocale = locales.some((locale) => locale.code === params.lang)

  if (!isValidLocale) {
    // If invalid locale, redirect to default
    redirect(`/${defaultLocale}`)
  }

  const lang = params.lang as Locale

  try {
    // Get dictionary with error handling
    const dict = await getDictionary(lang)

    // Fetch initial crypto rates with robust error handling
    const initialCryptoRates = await getInitialCryptoRates()

    return <ClientPage lang={lang} dict={dict} initialCryptoRates={initialCryptoRates} />
  } catch (error) {
    console.error("Error loading page:", error)
    // Fallback to default locale if there's an error
    redirect(`/${defaultLocale}`)
  }
}
