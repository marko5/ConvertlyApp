"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { locales } from "@/lib/i18n-config"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface LanguageSwitcherProps {
  currentLocale: string
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)

  const handleLanguageChange = (locale: string) => {
    // Simple direct navigation - most reliable approach
    window.location.pathname = `/${locale}`
  }

  // Find the current locale object
  const currentLocaleObj = locales.find((l) => l.code === currentLocale) || locales[0]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 px-2">
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline-flex items-center gap-1">
            <span>{currentLocaleObj.flag}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            className={cn("flex items-center gap-2 cursor-pointer", locale.code === currentLocale && "font-medium")}
            onClick={() => handleLanguageChange(locale.code)}
          >
            <span>{locale.flag}</span>
            <span>{locale.name}</span>
            {locale.code === currentLocale && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
