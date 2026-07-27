# Dockerfile for HolyHub
# Multi-stage build for minimal final image size
# ============================================================
# Build:  docker build -t holyhub .
# Run:    docker run -p 3000:3000 -e GEMINI_API_KEY=your_key holyhub
# ============================================================

# ─────────────────────────────────────────────────────────────
# Stage 1: Dependencies
# ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lock* yarn.lock* package-lock.json* ./
COPY prisma ./prisma

# Install dependencies (use npm for compatibility)
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# ─────────────────────────────────────────────────────────────
# Stage 2: Build
# ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the standalone Next.js app
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 3: Runner (minimal production image)
# ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Create data directory for SQLite
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
