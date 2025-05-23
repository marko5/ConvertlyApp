"use client"

type EventOptions = {
  category?: string
  label?: string
  value?: number
  [key: string]: any
}

export const trackEvent = (eventName: string, options: EventOptions = {}) => {
  // Check if window and Vercel Analytics are available
  if (typeof window !== "undefined" && window.va) {
    window.va("event", {
      name: eventName,
      ...options,
    })
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
