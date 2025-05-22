"use client"

import { useEffect, useState } from "react"
import { useAdMob } from "@/hooks/use-admob"

interface RewardedAdProps {
  adUnitId?: string
  onAdLoaded?: () => void
  onAdShown?: () => void
  onAdDismissed?: () => void
  onAdFailed?: (error: any) => void
  onRewarded?: (reward: { type: string; amount: number }) => void
}

export default function RewardedAd({
  adUnitId,
  onAdLoaded,
  onAdShown,
  onAdDismissed,
  onAdFailed,
  onRewarded,
}: RewardedAdProps) {
  const [isCapacitor, setIsCapacitor] = useState(false)
  const { showRewardedAd, isAdMobInitialized } = useAdMob()
  const [isReady, setIsReady] = useState(false)

  // Check if we're in a Capacitor environment
  useEffect(() => {
    setIsCapacitor(typeof window !== "undefined" && window.Capacitor !== undefined)
  }, [])

  // Show rewarded ad
  const showAd = async () => {
    if (!isCapacitor || !isAdMobInitialized) return false

    try {
      const result = await showRewardedAd({
        adId: adUnitId,
      })

      if (result) {
        onAdShown?.()
        return true
      }
      return false
    } catch (error) {
      onAdFailed?.(error)
      return false
    }
  }

  // Register ad event listeners
  useEffect(() => {
    if (!isCapacitor) return

    const setupListeners = async () => {
      try {
        const { AdMob } = await import("@capacitor/admob")

        // Add event listeners
        AdMob.addListener("onRewardedVideoAdLoaded", () => {
          setIsReady(true)
          onAdLoaded?.()
        })

        AdMob.addListener("onRewardedVideoAdOpened", () => {
          onAdShown?.()
        })

        AdMob.addListener("onRewardedVideoAdClosed", () => {
          setIsReady(false)
          onAdDismissed?.()
        })

        AdMob.addListener("onRewardedVideoAdFailedToLoad", (error) => {
          setIsReady(false)
          onAdFailed?.(error)
        })

        AdMob.addListener("onRewarded", (reward) => {
          onRewarded?.(reward)
        })

        return () => {
          // Remove event listeners
          AdMob.removeAllListeners()
        }
      } catch (error) {
        console.error("Error setting up rewarded ad listeners:", error)
      }
    }

    setupListeners()
  }, [isCapacitor, onAdLoaded, onAdShown, onAdDismissed, onAdFailed, onRewarded])

  // This component doesn't render anything visible, but exposes the showAd method
  return { showAd, isReady }
}
