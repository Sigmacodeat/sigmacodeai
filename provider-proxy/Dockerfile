FROM node:20-alpine

WORKDIR /app

# Copy manifest files and prisma schema first for better layer caching
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Deterministic install (includes dev deps for build)
RUN npm ci

# Copy tsconfig and source
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Remove dev deps for runtime
RUN npm prune --omit=dev

ENV NODE_ENV=production
ENV PORT=8787
EXPOSE 8787

CMD ["node", "dist/server.js"]
