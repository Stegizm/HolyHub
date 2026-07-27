#!/bin/bash
# ============================================================
# HolyHub — Standalone Build Script
# Cross-platform: produces a self-contained portable folder
# ============================================================
# Usage:
#   bash scripts/build-standalone.sh
#
# Output: dist/holyhub-portable/
# Run with: node dist/holyhub-portable/server.js
# ============================================================

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo "🔨 [1/4] Installing dependencies..."
bun install

echo "🏗️  [2/4] Building Next.js (standalone mode)..."
bun run build

echo "📦 [3/4] Assembling portable folder..."
DIST_DIR="$PROJECT_DIR/dist/holyhub-portable"
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Copy standalone server + static + public
cp -r .next/standalone/* "$DIST_DIR/"
mkdir -p "$DIST_DIR/.next"
cp -r .next/static "$DIST_DIR/.next/"
cp -r public "$DIST_DIR/"

# Copy env example & README
cp .env.example "$DIST_DIR/.env.local"
cp README.md "$DIST_DIR/"

# Create launcher scripts
cat > "$DIST_DIR/start-linux.sh" << 'EOF'
#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
echo "🌙 HolyHub starting..."
echo "📝 Edit .env.local to add your GEMINI_API_KEY"
echo "🌐 Open: http://localhost:3000"
node server.js
EOF
chmod +x "$DIST_DIR/start-linux.sh"

cat > "$DIST_DIR/start-windows.bat" << 'EOF'
@echo off
cd /d "%~dp0"
echo 🌙 HolyHub starting...
echo 📝 Edit .env.local to add your GEMINI_API_KEY
echo 🌐 Open: http://localhost:3000
node server.js
pause
EOF

# Calculate size
SIZE=$(du -sh "$DIST_DIR" | cut -f1)
echo "✅ [4/4] Build complete!"
echo ""
echo "📁 Output: $DIST_DIR"
echo "📊 Size: $SIZE"
echo ""
echo "To run:"
echo "  Linux/macOS:  bash $DIST_DIR/start-linux.sh"
echo "  Windows:      double-click $DIST_DIR/start-windows.bat"
echo ""
echo "⚠️  Users need Node.js 18+ installed on their system."
