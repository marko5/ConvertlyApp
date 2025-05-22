"use client"

import { useEffect, useState } from "react"
import { useAdMob } from "@/hooks/use-admob"

interface MobileAdBannerProps {
  position?: "top" | "bottom"
  adUnitId?: string
}

export default function MobileAdBanner({ position = "bottom", adUnitId }: MobileAdBannerProps) {
  const [isCapacitor, setIsCapacitor] = useState(false)
  const { showBannerAd, isAdMobInitialized } = useAdMob()

  // Check if we're in a Capacitor environment
  useEffect(() => {
    setIsCapacitor(typeof window !== "undefined" && window.Capacitor !== undefined)
  }, [])

  // Show banner ad when AdMob is initialized
  useEffect(() => {
    if (isCapacitor && isAdMobInitialized) {
      showBannerAd({
        adId: adUnitId,
        position: position === "top" ? "TOP_CENTER" : "BOTTOM_CENTER",
        bannerSize: "ADAPTIVE_BANNER",
      })
    }
  }, [isCapacitor, isAdMobInitialized, adUnitId, position, showBannerAd])

  // If not in Capacitor environment, render nothing
  if (!isCapacitor) {
    return null
  }

  // The actual banner is managed by the native layer, so we don't need to render anything
  return null
}
