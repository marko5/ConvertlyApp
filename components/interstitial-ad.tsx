"use client"

import { useEffect, useState } from "react"

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
  autoTriggerDelay = 60000,
  onAdShown,
  onAdDismissed,
  onAdFailed,
}: InterstitialAdProps) {
  const [isCapacitor, setIsCapacitor] = useState(false)

  // Web-only version - doesn't do anything
  useEffect(() => {
    setIsCapacitor(false)
  }, [])

  // This component doesn't render anything visible in web version
  return null
}
