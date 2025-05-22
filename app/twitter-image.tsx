import { ImageResponse } from "next/og"
import { PWA_CONFIG } from "@/lib/domain-config"

export const runtime = "edge"

export const alt = PWA_CONFIG.name
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 96,
        background: "linear-gradient(to bottom right, #10b981, #0d9488)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" style={{ marginRight: 24 }}>
          <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" />
          <path d="M30 50L45 65L70 35" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 25V75" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <path d="M25 50H75" stroke="white" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <div style={{ fontWeight: "bold" }}>Convertly</div>
      </div>
      <div style={{ fontSize: 36, opacity: 0.8 }}>Measure everything, anywhere</div>
    </div>,
    { ...size },
  )
}
