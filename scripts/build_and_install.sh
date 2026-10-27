#!/bin/bash
# Build AAB and create installable APKs with bundletool for local testing
# Usage: ./scripts/build_and_install.sh

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$PROJECT_ROOT/android"
BUNDLETOOL_VERSION="1.17.0"
BUNDLETOOL_JAR="$HOME/.bundletool/bundletool-all-${BUNDLETOOL_VERSION}.jar"

echo "🔨 Building AAB with asset pack..."

cd "$ANDROID_DIR"

# Build release AAB (Gradle automatically triggers bundle generation)
./gradlew bundleRelease

AAB_PATH="$ANDROID_DIR/app/build/outputs/bundle/release/app-release.aab"
echo "✅ AAB built: $AAB_PATH"

# Download bundletool if not present
if [ ! -f "$BUNDLETOOL_JAR" ]; then
    echo "📥 Downloading bundletool..."
    mkdir -p "$(dirname "$BUNDLETOOL_JAR")"
    curl -L "https://github.com/google/bundletool/releases/download/${BUNDLETOOL_VERSION}/bundletool-all-${BUNDLETOOL_VERSION}.jar" -o "$BUNDLETOOL_JAR"
fi

# Build APKs with local testing
echo "📱 Building APKs with bundletool (local testing)..."
APKS_OUTPUT="$ANDROID_DIR/test.apks"

java -jar "$BUNDLETOOL_JAR" build-apks \
    --bundle="$AAB_PATH" \
    --output="$APKS_OUTPUT" \
    --local-testing \
    --connected-device \
    --overwrite

echo "✅ APKs built: $APKS_OUTPUT"

# Install on connected device
echo "📲 Installing on connected device..."
if ! java -jar "$BUNDLETOOL_JAR" install-apks --apks="$APKS_OUTPUT" --allow-downgrade; then
    echo "⚠️ Install failed (signature mismatch). Uninstalling existing package and retrying..."
    adb uninstall com.monel.newpad 2>/dev/null || true
    java -jar "$BUNDLETOOL_JAR" install-apks --apks="$APKS_OUTPUT" --allow-downgrade
fi

echo "🎉 Done! App installed on device/emulator."
echo ""
echo "To test updates:"
echo "  1. Modify assets in assets/ (e.g., change content_version.json to v2)"
echo "  2. Run: ./scripts/generate_bundle.sh"
echo "  3. Bump versionCode in android/app/build.gradle"
echo "  4. Run: ./scripts/build_and_install.sh"