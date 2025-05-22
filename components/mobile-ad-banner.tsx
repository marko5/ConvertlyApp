"use client"

import { useEffect, useState } from "react"

interface MobileAdBannerProps {
  position?: "top" | "bottom"
  adUnitId?: string
}

export default function MobileAdBanner({ position = "bottom", adUnitId }: MobileAdBannerProps) {
  const [isCapacitor, setIsCapacitor] = useState(false)

  // Web-only version - doesn't do anything
  useEffect(() => {
    setIsCapacitor(false)
  }, [])

  // If not in Capacitor environment, render nothing
  if (!isCapacitor) {
    return null
  }

  // The actual banner is managed by the native layer, so we don't need to render anything
  return null
}
