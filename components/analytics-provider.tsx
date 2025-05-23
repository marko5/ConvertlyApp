"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Analytics } from "@vercel/analytics/react"

export function AnalyticsProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views when the route changes
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    // You can add custom tracking here if needed
    console.log(`Page view: ${url}`)
  }, [pathname, searchParams])

  return <Analytics />
}
