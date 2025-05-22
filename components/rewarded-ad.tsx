"use client"

import { useEffect, useState } from "react"

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
  const [isReady, setIsReady] = useState(false)

  // Web-only version - doesn't do anything
  useEffect(() => {
    setIsCapacitor(false)
  }, [])

  // Show rewarded ad - stub for web version
  const showAd = async () => {
    return false
  }

  // This component doesn't render anything visible, but exposes the showAd method
  return { showAd, isReady: false }
}
