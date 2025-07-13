"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { cryptoService, type CryptoRate } from "@/lib/crypto-service" // Import the singleton instance

export function useCryptoRates(initialRates: CryptoRate[] = []) {
  const [rates, setRates] = useState<CryptoRate[]>(initialRates)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load rates on mount
  useEffect(() => {
    loadRates()
  }, [])

  // Auto-refresh every 5 minutes when enabled
  useEffect(() => {
    if (!autoRefresh) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }

    // Clear any existing interval before setting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      if (cryptoService.shouldUpdate()) {
        refreshRates()
      }
    }, 30000) // Check every 30 seconds if an update is needed (cache duration is 5 min)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh])

  const loadRates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedRates = await cryptoService.getRates() // Use the service to get rates
      setRates(fetchedRates)
      setLastUpdated(cryptoService.getLastUpdateTime())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load crypto rates")
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshRates = useCallback(async () => {
    try {
      setError(null)
      const freshRates = await cryptoService.refreshRates() // Use the service to force refresh
      setRates(freshRates)
      setLastUpdated(new Date()) // Update timestamp to now
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh crypto rates")
    }
  }, [])

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh((prev) => !prev)
  }, [])

  return {
    rates,
    loading,
    error,
    lastUpdated,
    autoRefresh,
    refreshRates,
    toggleAutoRefresh,
    reload: loadRates, // Expose reload for manual trigger if needed
  }
}
