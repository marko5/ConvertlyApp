import type { MetadataRoute } from "next"
import { PWA_CONFIG, APP_URL } from "@/lib/domain-config"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PWA_CONFIG.name,
    short_name: PWA_CONFIG.shortName,
    description: PWA_CONFIG.description,
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: PWA_CONFIG.backgroundColor,
    theme_color: PWA_CONFIG.themeColor,
    orientation: "portrait",
    scope: "/",
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshot1.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshot2.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
    categories: ["utilities", "productivity"],
    shortcuts: [
      {
        name: "Open Converter",
        url: "/?tab=converter",
        description: "Open the measurement converter",
      },
      {
        name: "Currency Rates",
        url: "/?tab=currency-rates",
        description: "Check latest currency rates",
      },
    ],
    related_applications: [
      {
        platform: "webapp",
        url: `${APP_URL}/manifest.json`,
      },
    ],
  }
}
