# v0.8.0-rc2

# Base node image
FROM node:22-alpine AS node

# Install jemalloc
RUN apk add --no-cache jemalloc
RUN apk add --no-cache python3 py3-pip uv

# Set environment variable to use jemalloc
ENV LD_PRELOAD=/usr/lib/libjemalloc.so.2
## Robustere npm-Defaults (kein globales Schreiben nötig)
ENV NPM_CONFIG_CACHE=/tmp/.npm \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=600000 \
    NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=15000

# Add `uv` for extended MCP support
COPY --from=ghcr.io/astral-sh/uv:0.6.13 /uv /uvx /bin/
RUN uv --version

RUN mkdir -p /app && chown node:node /app
WORKDIR /app

USER node

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node api/package.json ./api/package.json
COPY --chown=node:node packages/data-provider/package.json ./packages/data-provider/package.json
COPY --chown=node:node packages/data-schemas/package.json ./packages/data-schemas/package.json
COPY --chown=node:node packages/api/package.json ./packages/api/package.json

RUN \
    # Allow mounting of these files, which have no default
    touch .env ; \
    # Create directories for the volumes to inherit the correct permissions
    mkdir -p /app/client/public/images /app/api/logs ; \
    # Clean potentially corrupted caches (nutzt NPM_CONFIG_CACHE)
    npm cache clean --force ; \
    rm -rf /home/node/.npm || true ; \
    # Install deps (lockfile wird bei Bedarf aktualisiert)
    npm install --no-audit --prefer-online --legacy-peer-deps

COPY --chown=node:node . .

RUN \
    # React client build skipped in backend-only image
    echo "Skipping client build for backend-only deployment"; \
    npm prune --production; \
    npm cache clean --force

RUN mkdir -p /app/client/public/images /app/api/logs

# Node API setup
EXPOSE 3080
# Standard-ENV passend zu .env/.env.example und docker-compose
ENV PORT=3080
ENV HOST=0.0.0.0
CMD ["npm", "run", "backend"]
