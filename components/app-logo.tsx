"use client"

import { useTheme } from "next-themes"

interface AppLogoProps {
  className?: string
  size?: number
}

export default function AppLogo({ className = "", size = 24 }: AppLogoProps) {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />
      <path
        d="M30 50L45 65L70 35"
        className="stroke-emerald-600 dark:stroke-emerald-300"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 25V75"
        className="stroke-emerald-600 dark:stroke-emerald-300"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M25 50H75"
        className="stroke-emerald-600 dark:stroke-emerald-300"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}
