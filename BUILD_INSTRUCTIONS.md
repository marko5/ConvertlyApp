# Building and Exporting Convertly to Android Studio

This guide will walk you through the steps to build your Convertly web application, bundle it with Capacitor, and open the resulting Android project in Android Studio.

## Prerequisites

1.  **Node.js and npm/bun**: Ensure you have Node.js (LTS recommended) and a package manager (npm, yarn, or bun) installed.
2.  **Android Studio**: Download and install Android Studio. Make sure you have the necessary Android SDKs and build tools installed.
3.  **Java Development Kit (JDK)**: Ensure you have a compatible JDK installed (e.g., OpenJDK 17 or later).

## Steps

### 1. Install Dependencies

Ensure all your project dependencies are installed.
\`\`\`bash
bun install
# or npm install
# or yarn install
\`\`\`

### 2. Build the Next.js Web Application

First, build your Next.js application for static export. This will create an `out` directory containing the static HTML, CSS, and JavaScript files.

\`\`\`bash
bun run build
# or npm run build
# or yarn build
\`\`\`

### 3. Add Android Platform (if not already added)

If you haven't added the Android platform to your Capacitor project yet, run this command:

\`\`\`bash
bun run capacitor:add:android
# or npm run capacitor:add:android
# or yarn capacitor:add:android
\`\`\`
This will create the `android` directory in your project root, along with the necessary `gradle` files.

### 4. Sync Web Assets to Android Project

After building your web app, you need to sync these assets into the Capacitor Android project. This command copies your `out` directory content into the `android/app/src/main/assets/public` folder.

\`\`\`bash
bun run capacitor:sync:android
# or npm run capacitor:sync:android
# or yarn capacitor:sync:android
\`\`\`

### 5. Open in Android Studio

Now, you can open the generated Android project in Android Studio.

\`\`\`bash
bun run capacitor:open:android
# or npm run capacitor:open:android
# or yarn capacitor:open:android
\`\`\`

Android Studio will open, and it might take some time to sync Gradle files and download any missing dependencies.

### 6. Build and Run from Android Studio

Once Android Studio is ready:

1.  **Select a Device/Emulator**: In Android Studio, select a virtual device or connect a physical Android device.
2.  **Run the App**: Click the "Run" button (green play icon) in the toolbar.

This will build and install the Android application on your selected device/emulator.

### Useful Commands (from `package.json`)

*   `bun run build`: Builds the Next.js web app for static export.
*   `bun run capacitor:add:android`: Adds the Android platform to Capacitor.
*   `bun run capacitor:sync:android`: Syncs web assets to the Android project.
*   `bun run capacitor:open:android`: Opens the Android project in Android Studio.
*   `bun run build:android`: A convenience script that runs `bun run build` followed by `bun run capacitor:sync:android`.

### Important Notes for Android Studio

*   **Gradle Sync**: If you encounter issues, try "Sync Project with Gradle Files" from the File menu in Android Studio.
*   **Signing**: For release builds, you will need to configure app signing in Android Studio.
*   **AdMob**: If you plan to use AdMob, ensure your `google-services.json` file is placed in `android/app/` and your AdMob App ID is correctly configured in `AndroidManifest.xml` and `strings.xml`.
*   **Network Security**: If your app makes HTTP requests to non-HTTPS domains or specific custom domains, you might need to configure `network_security_config.xml` in `android/app/src/main/res/xml/`.

By following these steps, you should be able to successfully build and run your Convertly web app as an Android application.
