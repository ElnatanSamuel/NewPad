#!/bin/bash
# Generate Hermes bundle and copy assets to js_assets pack
# Usage: ./scripts/generate_bundle.sh

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$PROJECT_ROOT/android"
JS_ASSETS_DIR="$ANDROID_DIR/js_assets/src/main/assets"

echo "📦 Generating Hermes bundle for PAD..."

# Create js_assets directory structure
mkdir -p "$JS_ASSETS_DIR/icons"
mkdir -p /tmp/expo-export

# Generate the bundle using Expo CLI
cd "$PROJECT_ROOT"
npx expo export:embed \
    --platform android \
    --dev false \
    --minify true \
    --bundle-output /tmp/expo-export/index.android.bundle \
    --assets-dest /tmp/expo-export/assets \
    --unstable-transform-profile hermes

# Copy the generated bundle to js_assets
echo "📁 Copying bundle to js_assets..."
rm -f "$JS_ASSETS_DIR/index.android.bundle"
cp /tmp/expo-export/index.android.bundle "$JS_ASSETS_DIR/pad_index.android.bundle"

# Copy assets (icons, hero, content_version.json)
echo "🎨 Copying assets to js_assets..."
cp -r "$PROJECT_ROOT/assets/icons/"* "$JS_ASSETS_DIR/icons/"
cp "$PROJECT_ROOT/assets/hero.png" "$JS_ASSETS_DIR/"
cp "$PROJECT_ROOT/assets/content_version.json" "$JS_ASSETS_DIR/"

echo "✅ Bundle and assets copied to js_assets pack"
echo "   Bundle: $JS_ASSETS_DIR/index.android.bundle"
echo "   Assets: $JS_ASSETS_DIR/icons/, hero.png, content_version.json"

# Verify
ls -la "$JS_ASSETS_DIR/"