"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Initial check
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    // Add listener for changes
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    // Clean up
    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

// Predefined breakpoint hooks for common use cases
export function useBreakpoint() {
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)")
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const isLarge = useMediaQuery("(min-width: 1280px)")

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    // Convenience combinations
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
  }
}
