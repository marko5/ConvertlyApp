# Building and Exporting ConvertlyApp to Android Studio

This guide will walk you through the steps to build your Next.js web application, bundle it with Capacitor, and open it in Android Studio to create a native Android app.

## Prerequisites

1.  **Node.js / Bun**: Ensure you have Node.js (LTS version) or Bun installed.
2.  **Android Studio**: Download and install Android Studio from the official website.
3.  **Android SDK**: Make sure you have the necessary Android SDKs installed via Android Studio's SDK Manager (API Level 34 recommended).
4.  **Java Development Kit (JDK)**: Android Studio typically bundles a JDK, but ensure you have JDK 17 or newer installed and configured.

## Step-by-Step Guide

### 1. Install Dependencies

First, ensure all your project's dependencies are installed.

\`\`\`bash
bun install
\`\`\`

### 2. Add Android Platform (if not already added)

If you haven't added the Android platform to your Capacitor project yet, run this command:

\`\`\`bash
bun run capacitor:add:android
# This will create the 'android' directory in your project root.
\`\`\`

### 3. Build the Web Application and Sync with Capacitor

This command will:
*   Build your Next.js application for static export (`next build`). The output will be in the `out/` directory.
*   Copy the built web assets into the Capacitor Android project (`npx cap sync android`).
*   Update Capacitor's native dependencies.

\`\`\`bash
bun run build:android
\`\`\`

### 4. Open the Android Project in Android Studio

Once the sync is complete, you can open the Android project in Android Studio:

\`\`\`bash
bun run capacitor:open:android
\`\`\`

Android Studio will open, and it might take some time to sync Gradle files and download dependencies for the first time.

### 5. Run Your App in Android Studio

1.  **Select a Device**: In Android Studio, select an AVD (Android Virtual Device) from the device dropdown menu or connect a physical Android device.
2.  **Run**: Click the green "Run" button (looks like a play icon) in the toolbar.

Your web application should now launch as a native Android app on your selected device or emulator.

### 6. Important Android Studio Configurations (for Release Builds)

#### a. Set up AdMob (if applicable)

If you plan to use AdMob, you need to:
*   **Replace Placeholder AdMob App ID**: In `android/app/src/main/AndroidManifest.xml`, locate the `com.google.android.gms.ads.APPLICATION_ID` meta-data tag and replace `ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy` with your actual AdMob App ID.
*   **Add Google Services JSON**: If you're using Firebase services (which AdMob often integrates with), place your `google-services.json` file in the `android/app/` directory.

#### b. Configure Signing for Release

For release builds (e.g., for Google Play Store), you need to sign your app.
1.  In Android Studio, go to `Build > Generate Signed Bundle / APK...`.
2.  Choose "Android App Bundle" or "APK".
3.  Create a new keystore or use an existing one. **Keep your keystore file and password secure!**
4.  Follow the prompts to generate the signed bundle/APK.

#### c. Update App Icon and Splash Screen

*   **App Icon**: Replace the default icons in `android/app/src/main/res/mipmap-*` directories with your app's actual icons.
*   **Splash Screen**: If you have a custom splash screen image, ensure it's correctly placed in `android/app/src/main/res/drawable/splash.png` (or similar, as configured in `capacitor.config.ts`).

#### d. Network Security Configuration

Your `AndroidManifest.xml` already includes `android:usesCleartextTraffic="true"` and references `network_security_config.xml`. Ensure `android/app/src/main/res/xml/network_security_config.xml` exists and is configured to allow necessary network traffic (especially for APIs like CoinGecko).

\`\`\`xml
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <!-- Add any other domains that might use HTTP (not HTTPS) in development -->
    </domain-config>
</network-security-config>
\`\`\`

This comprehensive setup should get your ConvertlyApp ready for Android Studio and building a native Android application!
