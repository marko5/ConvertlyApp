import type { CapacitorConfig } from "@capacitor/cli"
import { APP_URL } from "./lib/domain-config"

const config: CapacitorConfig = {
  appId: "com.yourname.convertly",
  appName: "Convertly",
  webDir: "out", // This is crucial for Next.js static export
  bundledWebRuntime: false,
  plugins: {
    // Remove AdMob configuration
    CapacitorHttp: {
      enabled: true,
    },
  },
  server: {
    androidScheme: "https",
    hostname: APP_URL.replace("https://", ""),
    iosScheme: "https",
    allowNavigation: [APP_URL],
  },
}

export default config
