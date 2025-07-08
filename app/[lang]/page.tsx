import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/lib/i18n-config"
import { defaultLocale, locales } from "@/lib/i18n-config"
import ClientPage from "./client-page"
import { redirect } from "next/navigation"

async function getInitialCryptoRates() {
  try {
    // Using CoinGecko API for top 10 cryptocurrencies (free tier limits requests)
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false', {
      next: { revalidate: 86400 } // Revalidate every 24 hours (86400 seconds)
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch crypto rates: ${res.statusText}`);
    }
    const data = await res.json();
    return data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      priceUsd: coin.current_price.toString(),
      changePercent24Hr: coin.price_change_percentage_24h.toString(),
    }));
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
