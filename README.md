# NewPad — React Native with Play Asset Delivery (PAD)

This application demonstrates **Dynamic Bundle & Asset Delivery** using **Google Play Asset Delivery (PAD)** on **React Native (0.88+)** and **Expo (v58)** with the **New Architecture**.

---

## Table of Contents

1. [Architecture Overview](#-architecture-overview)
2. [How It Works](#-how-it-works)
3. [File & Directory Structure](#-file--directory-structure)
4. [Automated Build System](#-automated-build-system)
5. [Local Testing (Emulator & USB Phone)](#-local-testing-emulator--usb-phone)
6. [Testing on a Physical Device Wirelessly](#-testing-on-a-physical-device-wirelessly)
7. [Remote Testing & Distribution (No Cables)](#-remote-testing--distribution-no-cables)
8. [Adding New Services, Screens & Assets](#-adding-new-services-screens--assets)

---

## Architecture Overview

Traditional React Native apps embed their compiled JavaScript bundle (`index.android.bundle`) directly inside the base APK assets. Updating any JavaScript or UI requires users to manually update the application from the app store.

This repository splits the application into two distinct layers:

1. **Base App Module (`:app`):** Contains native code, third-party libraries, and an initial fallback bundle so the app launches instantly on first install.
2. **Dynamic Asset Pack (`:js_assets`):** Configured as a `fast-follow` delivery module containing the latest Hermes-compiled JavaScript bundle (`pad_index.android.bundle`) and static assets (icons, images, JSON configs).

```
                      ┌────────────────────────────────────────┐
                      │          Android App Bundle            │
                      │          (app-release.aab)             │
                      └──────────────────┬─────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
      ┌──────────────────────┐                       ┌──────────────────────┐
      │      Base APK        │                       │ Fast-Follow Asset    │
      │       (:app)         │                       │ Pack (:js_assets)    │
      ├──────────────────────┤                       ├──────────────────────┤
      │ • Native Code / C++  │                       │ • pad_index.bundle   │
      │ • Fallback JS bundle │                       │ • icons / images     │
      │ • React Host Entry   │                       │ • content_version    │
      └──────────┬───────────┘                       └──────────┬───────────┘
                 │                                              │
                 │ App Launches                                 │ Background Download
                 ▼                                              ▼
      ┌─────────────────────────────────────────────────────────────────────┐
      │ MainApplication: getJSBundleFile()                                  │
      │ 1. Check if :js_assets is on device                                 │
      │ 2. If present -> Load pad_index.android.bundle                      │
      │ 3. If absent  -> Fallback to base APK bundle                        │
      └─────────────────────────────────────────────────────────────────────┘
```

---

## How It Works

### 1. Dynamic Bundle Loading

In `android/app/src/main/java/com/monel/newpad/MainApplication.kt`:

- `MainApplication` overrides `ReactNativeHost.getJSBundleFile()`.
- It calls `assetPackManager.getPackLocation("js_assets")`.
- If the pack is installed and contains `pad_index.android.bundle`, it loads that file path directly.
- If the pack is not yet ready, it returns `null`, causing React Native to load the fallback bundle packaged inside the base APK.

### 2. Silent Background Updates

In `MainApplication.kt`:

- An `AssetPackStateUpdateListener` is registered on startup.
- When Google Play (or `bundletool`) delivers an updated `js_assets` pack in the background, the listener receives `AssetPackStatus.COMPLETED`.
- The listener calls `restartApp()`, instantly rebooting the application to mount the newly downloaded bundle without the user needing to manually open the Play Store.

### 3. Avoiding Bundle Conflicts

In Google Play App Bundles, two modules cannot have identical file paths. To prevent `bundletool` collisions:

- The base APK contains `assets/index.android.bundle`.
- The asset pack contains `assets/pad_index.android.bundle`.

---

## File & Directory Structure

```
NewPad/
├── android/
│   ├── app/
│   │   ├── build.gradle              # Links assetPacks = [":js_assets"] & automated build hook
│   │   └── src/main/java/.../
│   │       ├── MainActivity.kt       # ReactActivity with New Architecture delegate
│   │       └── MainApplication.kt    # Intercepts bundle loading and handles PAD update events
│   ├── js_assets/                    # The Play Asset Delivery asset pack module
│   │   ├── build.gradle              # Sets dynamicDelivery { deliveryType = 'fast-follow' }
│   │   └── src/main/assets/          # Contains pad_index.android.bundle, icons, and hero.png
│   ├── settings.gradle               # Includes ':app' and ':js_assets'
│   └── gradle.properties             # Sets newArchEnabled=true & hermesEnabled=true
├── assets/                           # Source assets (icons, hero images, version json)
│   ├── content_version.json          # Version identifier loaded by HomeScreen
│   └── icons/                        # PNG/JPG icon assets
├── scripts/
│   ├── generate_bundle.sh            # Bundles Hermes JS and syncs assets into js_assets
│   └── build_and_install.sh          # Builds AAB and deploys locally via bundletool
├── src/
│   ├── components/                   # UI components (ServiceCard, etc.)
│   ├── screens/                      # Screens (HomeScreen, ServiceDetail)
│   ├── services.ts                   # Service data and models
│   └── theme.ts                      # Theme tokens and colors
└── app/                              # Expo Router routes (_layout.tsx, index.tsx, service/[id].tsx)
```

---

## Automated Build System

Bundle generation is **fully hooked into Gradle**. You do **not** need to run any manual script before building:

Whenever you run:

```bash
cd android && ./gradlew bundleRelease
```

Gradle automatically executes `generatePADBundle`, exports the Hermes bundle from React Native / Expo, syncs assets to `js_assets`, and packages the `.aab` in a single command.

---

## Local Testing (Emulator & USB Phone)

To test the full Play Asset Delivery pipeline locally without uploading to Google Play Console:

1. **Start an Android Emulator** or connect a physical phone via USB with **USB Debugging** enabled.
2. Run the build and install script:
   ```bash
   ./scripts/build_and_install.sh
   ```
3. What this script does:
   - Generates the Hermes bundle.
   - Compiles the Android App Bundle (`app-release.aab`).
   - Uses `bundletool --local-testing` to simulate Google Play delivery locally.
   - Deploys the APK splits and asset pack (`js_assets-master.apk`) to your device.

---

## Testing on a Physical Device Wirelessly

If your phone and development computer are on the same Wi-Fi network:

1. On your phone: Go to **Settings > Developer options > Wireless debugging** and toggle it ON.
2. Note the IP address and port (e.g. `192.168.1.50:41235`).
3. On your computer:
   ```bash
   adb pair 192.168.1.50:<pairing-port>
   adb connect 192.168.1.50:<port>
   ```
4. Run the install script:
   ```bash
   ./scripts/build_and_install.sh
   ```

---

## Remote Testing & Distribution (No Cables)

To distribute to testers or users on remote phones anywhere in the world:

### Option A: Google Play Internal App Sharing (Instant, No Review)

1. Build the production AAB:
   ```bash
   cd android && ./gradlew bundleRelease
   ```
2. In [Google Play Console](https://play.google.com/console):
   - Go to **Release > Internal app sharing**.
   - Upload `android/app/build/outputs/bundle/release/app-release.aab`.
   - Copy the shareable test link.
3. Send the link to any tester. The tester installs the app directly from Google Play.
4. When you upload a new AAB to the link, Google Play delivers the updated `fast-follow` asset pack to their phone over the internet.

### Option B: Google Play Internal Testing Track

- Upload the AAB to the **Internal testing** track for automated Play Store updates to your whitelisted email list.

---

## Adding New Services, Screens & Assets

To push a new feature or asset update:

1. **Add your new UI / Service:**
   - Edit `src/services.ts` to add new services or logic.
   - Add new screens under `app/` or `src/screens/`.
2. **Add New Assets (optional):**
   - Place any new images or icons in `assets/icons/`.
3. **Bump Version:**
   - In `assets/content_version.json`:
     ```json
     { "content": "v3" }
     ```
   - In `android/app/build.gradle`:
     ```groovy
     versionCode 3
     versionName "3.0.0"
     ```
4. **Deploy:**
   - **For Local Testing:** Run `./scripts/build_and_install.sh`.
   - **For Production:** Run `cd android && ./gradlew bundleRelease` and upload the resulting `.aab` to Google Play Console.
