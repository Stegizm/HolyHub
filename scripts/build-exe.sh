#!/bin/bash
# ============================================================
# HolyHub — Single Executable Build (PKG)
# Produces a SINGLE .exe (Windows) or single binary (Linux/macOS)
# that runs without Node.js installed.
# ============================================================
# Prerequisites:
#   - Run scripts/build-standalone.sh first
#   - npm install -g @yao-pkg/pkg  (or: yarn global add @yao-pkg/pkg)
#
# Usage:
#   bash scripts/build-exe.sh
#
# Output:
#   dist/holyhub-win.exe     (Windows)
#   dist/holyhub-linux       (Linux)
#   dist/holyhub-macos       (macOS)
# ============================================================

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

DIST_DIR="$PROJECT_DIR/dist"
PORTABLE_DIR="$DIST_DIR/holyhub-portable"

# Ensure standalone build exists
if [ ! -d "$PORTABLE_DIR" ]; then
  echo "❌ Portable build not found. Run scripts/build-standalone.sh first."
  exit 1
fi

# Ensure PKG is installed
if ! command -v pkg &> /dev/null; then
  echo "📦 Installing @yao-pkg/pkg..."
  npm install -g @yao-pkg/pkg
fi

echo "🔨 Building single executable with PKG..."

# Prepare a wrapper entry that loads the standalone server
cat > "$PROJECT_DIR/build-exe-entry.js" << 'EOF'
// PKG entry point — bundles Node.js + Next.js standalone server
// into a single .exe / binary
process.chdir(__dirname);
require('./server.js');
EOF

# Build for all platforms (you can target just one with -t node18-win-x64)
# Targets:
#   node18-win-x64   → Windows .exe
#   node18-linux-x64 → Linux binary
#   node18-macos-x64 → macOS binary
# To build only one: pkg build-exe-entry.js -t node18-win-x64 -o dist/holyhub-win.exe

pkg "$PROJECT_DIR/build-exe-entry.js" \
  --targets node18-win-x64,node18-linux-x64 \
  --output "$DIST_DIR/holyhub" \
  --compress GZip

# PKG appends .exe for Windows automatically; rename for clarity
[ -f "$DIST_DIR/holyhub-win.exe" ] || mv "$DIST_DIR/holyhub.exe" "$DIST_DIR/holyhub-win.exe" 2>/dev/null || true
[ -f "$DIST_DIR/holyhub-linux" ] || mv "$DIST_DIR/holyhub" "$DIST_DIR/holyhub-linux" 2>/dev/null || true

# Clean up
rm -f "$PROJECT_DIR/build-exe-entry.js"

# We need to bundle static + public alongside (PKG can't bundle them inside .exe easily)
# So we create a "release" folder containing the .exe + assets
for PLATFORM in win linux; do
  RELEASE_DIR="$DIST_DIR/holyhub-release-$PLATFORM"
  rm -rf "$RELEASE_DIR"
  mkdir -p "$RELEASE_DIR/.next"

  if [ "$PLATFORM" = "win" ]; then
    cp "$DIST_DIR/holyhub-win.exe" "$RELEASE_DIR/holyhub.exe"
  else
    cp "$DIST_DIR/holyhub-linux" "$RELEASE_DIR/holyhub"
    chmod +x "$RELEASE_DIR/holyhub"
  fi

  # Bundle static + public (these can't be embedded in the binary)
  cp -r .next/static "$RELEASE_DIR/.next/"
  cp -r public "$RELEASE_DIR/"
  cp .env.example "$RELEASE_DIR/.env.local"
  cp README.md "$RELEASE_DIR/"

  # Launcher
  if [ "$PLATFORM" = "win" ]; then
    cat > "$RELEASE_DIR/run.bat" << 'EOF'
@echo off
cd /d "%~dp0"
echo 🌙 HolyHub starting...
echo 📝 Edit .env.local to add your GEMINI_API_KEY
echo 🌐 Open: http://localhost:3000
holyhub.exe
pause
EOF
  else
    cat > "$RELEASE_DIR/run.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
echo "🌙 HolyHub starting..."
echo "📝 Edit .env.local to add your GEMINI_API_KEY"
echo "🌐 Open: http://localhost:3000"
./holyhub
EOF
    chmod +x "$RELEASE_DIR/run.sh"
  fi

  # Zip it
  cd "$DIST_DIR"
  if [ "$PLATFORM" = "win" ]; then
    zip -r "holyhub-windows.zip" "holyhub-release-win" > /dev/null
  else
    tar -czf "holyhub-linux.tar.gz" "holyhub-release-linux" > /dev/null
  fi
  cd "$PROJECT_DIR"
done

echo ""
echo "✅ Single-executable builds complete!"
echo ""
echo "📦 Releases:"
ls -lh "$DIST_DIR"/holyhub-*.zip "$DIST_DIR"/holyhub-*.tar.gz 2>/dev/null
echo ""
echo "⚠️  Note: The .exe still needs .next/static and public/ folders"
echo "    next to it. We've zipped them together for distribution."
