"use client"

import type React from "react"

import { useBreakpoint } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

interface ResponsiveLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()

  return (
    <div
      className={cn(
        "w-full mx-auto transition-all duration-300",
        {
          "max-w-sm px-4": isMobile,
          "max-w-2xl px-6": isTablet,
          "max-w-4xl px-8": isDesktop,
        },
        className,
      )}
    >
      {children}
    </div>
  )
}
