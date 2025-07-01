"use client"

type EventOptions = {
  category?: string
  label?: string
  value?: number
  [key: string]: any
}

export const trackEvent = (eventName: string, options: EventOptions = {}) => {
  // Only run on client side
  if (typeof window === "undefined") return

  try {
    // Use a timeout to ensure the analytics script has loaded
    setTimeout(() => {
      if (window.va && typeof window.va === "function") {
        window.va("event", {
          name: eventName,
          ...options,
        })
      }
    }, 100)
  } catch (error) {
    // Silently handle errors to prevent breaking the app
    console.error("Analytics error:", error)
  }
}

// Define common events for reuse
export const AnalyticsEvents = {
  CATEGORY_SELECTED: "category_selected",
  UNIT_CONVERTED: "unit_converted",
  LANGUAGE_CHANGED: "language_changed",
  THEME_CHANGED: "theme_changed",
  CURRENCY_BASE_CHANGED: "currency_base_changed",
  COPY_RESULT: "copy_result",
}
