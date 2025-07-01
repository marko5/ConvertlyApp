"use client"

import { useState, useEffect } from "react"
import { currencyService, type CurrencyRate } from "@/lib/currency-service"

export function useCurrencyRates() {
  const [rates, setRates] = useState<CurrencyRate[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load rates on mount
  useEffect(() => {
    loadRates()
  }, [])

  // Check for monthly updates (only on client)
  useEffect(() => {
    const checkMonthlyUpdate = () => {
      if (typeof window !== "undefined" && currencyService.shouldUpdateMonthly()) {
        console.log("Monthly update needed, refreshing rates...")
        refreshRates()
      }
    }

    // Check after a delay to ensure component is mounted
    const timeout = setTimeout(checkMonthlyUpdate, 1000)

    // Set up interval to check daily
    const interval = setInterval(checkMonthlyUpdate, 24 * 60 * 60 * 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  const loadRates = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedRates = await currencyService.getRates()
      setRates(fetchedRates)
      setLastUpdated(currencyService.getLastUpdateTime())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load currency rates")
    } finally {
      setLoading(false)
    }
  }

  const refreshRates = async () => {
    try {
      setError(null)
      const freshRates = await currencyService.refreshRates()
      setRates(freshRates)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh currency rates")
    }
  }

  return {
    rates,
    loading,
    error,
    lastUpdated,
    refreshRates,
    reload: loadRates,
  }
}
