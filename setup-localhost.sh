#!/usr/bin/env bash
# LTE Frontend — localhost setup script
# Spins up the Vite dev server with mock API routing
# Usage: bash setup-localhost.sh

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$ROOT/.env"
BACKEND_DIR="$ROOT/../backend-office"

echo "=== LTE localhost setup ==="

# 1. Create .env if missing (mock values so Vite starts without errors)
if [ ! -f "$ENV_FILE" ]; then
  echo "Creating .env with mock/dev defaults..."
  cat > "$ENV_FILE" << 'ENV'
VITE_API_URL=http://localhost:5000/api
VITE_TURNSTILE_SITE_KEY=
VITE_GOOGLE_MAPS_API_KEY=
VITE_GOOGLE_MAPS_MAP_ID=
ENV
  echo ".env created."
else
  echo ".env already exists — skipping creation."
fi

# 2. Install frontend dependencies
echo "Installing frontend dependencies..."
npm install --prefix "$ROOT"

# 3. Optionally start the backend (if backend-office exists and has package.json)
if [ -f "$BACKEND_DIR/package.json" ]; then
  echo "Starting backend on port 5000..."
  npm install --prefix "$BACKEND_DIR"
  npm start --prefix "$BACKEND_DIR" &
  BACKEND_PID=$!
  echo "Backend PID: $BACKEND_PID"
  sleep 2
else
  echo "No backend found at $BACKEND_DIR — frontend will run in API-less mode."
  echo "Product catalog and contact form submissions require the backend."
fi

# 4. Start Vite dev server
echo ""
echo "Starting Vite dev server..."
echo "Open: http://localhost:5173"
echo ""
npm run dev --prefix "$ROOT"
