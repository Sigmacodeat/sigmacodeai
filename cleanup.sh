#!/bin/bash

# Koyeb-spezifische Dateien
rm -f .koyeb.yaml
rm -f .koyeb/
rm -f .github/workflows/koyeb-*.yml

# Unnötige Docker-Compose-Dateien
rm -f docker-compose.proxy-dev.yml
rm -f docker-compose.override.yml

# Temporäre Dateien
rm -rf node_modules/
rm -f package-lock.json
yarn.lock
pnpm-lock.yaml

# Logs
rm -rf logs/

# Build-Ordner
rm -rf build/
rm -rf dist/

# Environment-Dateien (außer .env.example)
find . -name ".env*" ! -name ".env.example" -type f -delete

echo "Cleanup abgeschlossen!"
