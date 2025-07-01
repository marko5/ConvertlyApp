"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      // Track page views when the route changes
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

      // Simple console log for debugging
      console.log(`Page view: ${url}`)

      // Only track if analytics is available
      if (typeof window !== "undefined" && window.va) {
        window.va("page_view", { path: url })
      }
    } catch (error) {
      // Silently handle any errors
      console.error("Page tracking error:", error)
    }
  }, [pathname, searchParams, mounted])

  return null
}
