"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface SplashScreenProps {
  slogan: string
}

export default function SplashScreen({ slogan }: SplashScreenProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDarkMode = resolvedTheme === "dark"

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900 z-50">
      <div className="relative w-32 h-32 mb-6">
        {/* Logo Animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-full h-full animate-logo-pulse"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-emerald-500 dark:stroke-emerald-400"
              strokeWidth="2"
              strokeDasharray="283"
              strokeDashoffset="283"
              style={{
                animation: "dash 2s ease-in-out forwards",
              }}
            />
            <path
              d="M30 50L45 65L70 35"
              className="stroke-emerald-600 dark:stroke-emerald-300"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              strokeDashoffset="100"
              style={{
                animation: "dash 1s ease-in-out forwards 0.5s",
              }}
            />
            <path
              d="M50 25V75"
              className="stroke-emerald-600 dark:stroke-emerald-300"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="50"
              strokeDashoffset="50"
              style={{
                animation: "dash 1s ease-in-out forwards 0.7s",
              }}
            />
            <path
              d="M25 50H75"
              className="stroke-emerald-600 dark:stroke-emerald-300"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="50"
              strokeDashoffset="50"
              style={{
                animation: "dash 1s ease-in-out forwards 0.9s",
              }}
            />
          </svg>
        </div>
      </div>

      {/* Text Animation */}
      <div className="relative">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 animate-text-fade-in">
          Convertly
        </h1>
        <div className="h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-teal-500 mt-1 animate-line-expand"></div>
      </div>

      <p className="text-emerald-700 dark:text-emerald-300 mt-4 opacity-0 animate-subtitle-fade-in">{slogan}</p>
    </div>
  )
}
