"use client"

import { useEffect, useState, useRef } from "react"
import { useAdMob } from "@/hooks/use-admob"

interface InterstitialAdProps {
  adUnitId?: string
  trigger?: "manual" | "auto"
  autoTriggerDelay?: number
  onAdShown?: () => void
  onAdDismissed?: () => void
  onAdFailed?: (error: any) => void
}

export default function InterstitialAd({
  adUnitId,
  trigger = "manual",
  autoTriggerDelay = 60000, // 1 minute
  onAdShown,
  onAdDismissed,
  onAdFailed,
}: InterstitialAdProps) {
  const [isCapacitor, setIsCapacitor] = useState(false)
  const { showInterstitialAd, isAdMobInitialized } = useAdMob()
  const lastShownTimeRef = useRef<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Check if we're in a Capacitor environment
  useEffect(() => {
    setIsCapacitor(typeof window !== "undefined" && window.Capacitor !== undefined)
  }, [])

  // Show interstitial ad
  const showAd = async () => {
    if (!isCapacitor || !isAdMobInitialized) return

    try {
      const now = Date.now()

      // Don't show ads too frequently
      if (now - lastShownTimeRef.current < 30000) {
        // 30 seconds minimum between ads
        return
      }

      const result = await showInterstitialAd({
        adId: adUnitId,
      })

      if (result) {
        lastShownTimeRef.current = now
        onAdShown?.()
      }
    } catch (error) {
      onAdFailed?.(error)
    }
  }

  // Auto-trigger ad after delay
  useEffect(() => {
    if (trigger === "auto" && isCapacitor && isAdMobInitialized) {
      timerRef.current = setTimeout(() => {
        showAd()

        // Set up recurring timer
        const intervalId = setInterval(() => {
          showAd()
        }, autoTriggerDelay)

        // Store the interval ID for cleanup
        timerRef.current = intervalId as unknown as NodeJS.Timeout
      }, autoTriggerDelay)

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          clearInterval(timerRef.current as unknown as NodeJS.Timer)
        }
      }
    }
  }, [trigger, isCapacitor, isAdMobInitialized, autoTriggerDelay])

  // Register ad event listeners
  useEffect(() => {
    if (!isCapacitor) return

    const setupListeners = async () => {
      try {
        const { AdMob } = await import("@capacitor/admob")

        // Add event listeners
        AdMob.addListener("interstitialDidLoad", () => {
          console.log("Interstitial ad loaded")
        })

        AdMob.addListener("interstitialDidShow", () => {
          onAdShown?.()
        })

        AdMob.addListener("interstitialDidDismiss", () => {
          onAdDismissed?.()
        })

        AdMob.addListener("interstitialDidFailToLoad", (error) => {
          onAdFailed?.(error)
        })

        return () => {
          // Remove event listeners
          AdMob.removeAllListeners()
        }
      } catch (error) {
        console.error("Error setting up ad listeners:", error)
      }
    }

    setupListeners()
  }, [isCapacitor, onAdShown, onAdDismissed, onAdFailed])

  // This component doesn't render anything visible
  return null
}
