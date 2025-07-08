import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/lib/i18n-config"
import { defaultLocale, locales } from "@/lib/i18n-config"
import ClientPage from "./client-page"
import { redirect } from "next/navigation"

async function getInitialCryptoRates() {
  // In a real application, you would fetch data from a cryptocurrency API here.
  // For demonstration, returning mock data.
  // Replace with your actual API call and error handling.
  try {
    // Example using CoinGecko API for top 10 cryptocurrencies (free tier limits requests)
    // const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false', {
    //   next: { revalidate: 86400 } // Revalidate every 24 hours
    // });
    // if (!res.ok) {
    //   throw new Error(`Failed to fetch crypto rates: ${res.statusText}`);
    // }
    // const data = await res.json();
    // return data.map((coin: any) => ({
    //   id: coin.id,
    //   name: coin.name,
    //   symbol: coin.symbol.toUpperCase(),
    //   priceUsd: coin.current_price.toString(),
    //   changePercent24Hr: coin.price_change_percentage_24h.toString(),
    // }));

    // Placeholder Data - Replace with actual API call
    return [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", priceUsd: "68000.50", changePercent24Hr: "-1.25" },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", priceUsd: "3500.20", changePercent24Hr: "2.10" },
      { id: "tether", name: "Tether", symbol: "USDT", priceUsd: "1.00", changePercent24Hr: "0.01" },
      { id: "ripple", name: "Ripple", symbol: "XRP", priceUsd: "0.60", changePercent24Hr: "-0.55" },
      { id: "solana", name: "Solana", symbol: "SOL", priceUsd: "150.75", changePercent24Hr: "3.40" },
    ];
  } catch (error) {
    console.error("Error fetching initial crypto rates:", error);
    return []; // Return empty array on error
  }
}

export default async function Home({ params }: { params: { lang: string } }) {
  // Check if we're accessing the literal [lang] route
  if (params.lang === "[lang]") {
    // Redirect to the default locale
    redirect(`/${defaultLocale}`)
    return null
  }

  // Check if the language is valid
  const isValidLocale = locales.some((locale) => locale.code === params.lang)

  // If not valid, use default locale
  const lang = isValidLocale ? params.lang : defaultLocale

  // Get dictionary with fallback handling
  const dict = await getDictionary(lang)

  // Fetch initial crypto rates
  const initialCryptoRates = await getInitialCryptoRates();

  return (
    <>
      <ClientPage lang={lang as Locale} dict={dict} initialCryptoRates={initialCryptoRates} />
    </>
  )
}
