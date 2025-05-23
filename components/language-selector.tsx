"use client"

import { useState } from "react"
import { locales } from "@/lib/i18n-config"
import { Button } from "@/components/ui/button"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

interface LanguageSelectorProps {
  currentLocale: string
}

export default function LanguageSelector({ currentLocale }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const switchLanguage = (locale: string) => {
    // Track language change
    trackEvent(AnalyticsEvents.LANGUAGE_CHANGED, {
      from: currentLocale,
      to: locale,
    })

    // Direct navigation to the root path with the new locale
    window.location.href = `/${locale}`
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-4 font-medium"
      >
        <span className="text-lg">{locales.find((l) => l.code === currentLocale)?.flag || "🌐"}</span>
        <span>Language</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
          <div className="max-h-[300px] overflow-y-auto py-1">
            {locales.map((locale) => (
              <button
                key={locale.code}
                className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  locale.code === currentLocale ? "bg-gray-100 dark:bg-gray-700 font-medium" : ""
                }`}
                onClick={() => switchLanguage(locale.code)}
              >
                <span className="text-lg">{locale.flag}</span>
                <span>{locale.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
