"use client"

import { useEffect, useRef, useState } from "react"
import { ADMOB_APP_ID } from "@/lib/ad-constants"

interface GoogleAdBannerProps {
  className?: string
  format?: "auto" | "horizontal" | "vertical" | "rectangle"
  slot?: string
  responsive?: boolean
  testMode?: boolean
}

export default function GoogleAdBanner({
  className = "",
  format = "auto",
  slot = "XXXXXXXXXX",
  responsive = true,
  testMode = false,
}: GoogleAdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      // Check if AdSense is loaded
      if (adRef.current && window.adsbygoogle) {
        // Push ad to Google AdSense
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})

        // Set a timeout to check if ad loaded
        const timeout = setTimeout(() => {
          // If the ad container has children, it likely loaded
          if (adRef.current && adRef.current.querySelector("iframe")) {
            setAdLoaded(true)
          } else {
            setAdError(true)
          }
        }, 2000)

        return () => clearTimeout(timeout)
      }
    } catch (error) {
      console.error("Error loading Google AdSense:", error)
      setAdError(true)
    }
  }, [])

  // For test mode, show a placeholder
  if (testMode) {
    return (
      <div className={`w-full overflow-hidden bg-muted/30 rounded-lg p-2 text-center ${className}`}>
        <div className="min-h-16 flex items-center justify-center border border-dashed border-muted-foreground/50">
          <span className="text-xs text-muted-foreground">Ad Placeholder (Test Mode)</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full overflow-hidden bg-muted/30 rounded-lg p-2 text-center ${className}`}>
      <div ref={adRef} className="min-h-16 flex items-center justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100px" }}
          data-ad-client={ADMOB_APP_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        ></ins>
        {adError && <span className="text-xs text-muted-foreground">Advertisement</span>}
      </div>
    </div>
  )
}
