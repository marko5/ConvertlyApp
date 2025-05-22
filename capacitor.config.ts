import type { CapacitorConfig } from "@capacitor/cli"
import { APP_URL } from "./lib/domain-config"

const config: CapacitorConfig = {
  appId: "com.yourname.convertly",
  appName: "Convertly",
  webDir: "out",
  bundledWebRuntime: false,
  plugins: {
    // Add AdMob configuration with your app ID
    AdMob: {
      appId: "ca-app-pub-5141185566064464~3497144840",
    },
    // Add Universal Links & App Links configuration
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
