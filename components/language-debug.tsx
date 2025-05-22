"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface LanguageDebugProps {
  currentLocale: string
}

export default function LanguageDebug({ currentLocale }: LanguageDebugProps) {
  const [showDebug, setShowDebug] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="outline" size="sm" onClick={() => setShowDebug(!showDebug)}>
        Debug
      </Button>

      {showDebug && (
        <div className="absolute bottom-full right-0 mb-2 p-4 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 w-80">
          <h3 className="font-medium mb-2">Language Debug Info</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Current Locale:</strong> {currentLocale}
            </p>
            <p>
              <strong>Current Path:</strong> {typeof window !== "undefined" ? window.location.pathname : "N/A"}
            </p>
            <div className="mt-4">
              <h4 className="font-medium mb-1">Quick Language Links:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                <a href="/en" className="text-blue-500 hover:underline">
                  English
                </a>
                <a href="/es" className="text-blue-500 hover:underline">
                  Spanish
                </a>
                <a href="/fr" className="text-blue-500 hover:underline">
                  French
                </a>
                <a href="/it" className="text-blue-500 hover:underline">
                  Italian
                </a>
                <a href="/hr" className="text-blue-500 hover:underline">
                  Croatian
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
