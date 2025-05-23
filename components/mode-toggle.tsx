"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show the toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Simple toggle function
  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    // Track theme change
    trackEvent(AnalyticsEvents.THEME_CHANGED, {
      from: resolvedTheme,
      to: newTheme,
    })
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 bg-white dark:bg-gray-800"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
