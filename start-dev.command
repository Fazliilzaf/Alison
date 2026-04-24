#!/bin/bash
# Dubbelklicka på den här filen för att starta Alison-sajten lokalt.
# Den installerar dependencies (om de saknas) och öppnar sedan http://localhost:3000 i Safari.

set -e
cd "$(dirname "$0")"

echo "→ Kontrollerar pnpm…"
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm saknas. Installerar via Corepack…"
  corepack enable
  corepack prepare pnpm@latest --activate
fi

if [ ! -d "node_modules" ]; then
  echo "→ Installerar dependencies (första gången tar ~1 minut)…"
  pnpm install
fi

echo "→ Startar dev-server på http://localhost:3000"
# Öppna Safari efter 4 sekunder (så servern hinner starta)
( sleep 4 && open -a Safari http://localhost:3000 ) &

pnpm dev
