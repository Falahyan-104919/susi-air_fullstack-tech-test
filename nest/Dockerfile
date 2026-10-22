# Multi-stage Dockerfile for Susi Air Pilot API (NestJS)
FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

# Install monorepo dependencies
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY nest/package.json ./nest/
COPY nuxt/package.json ./nuxt/

RUN pnpm install --frozen-lockfile

# Copy Nest source code and build
COPY nest/ ./nest/
RUN pnpm --filter nest build

# Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY nest/package.json ./nest/
COPY nuxt/package.json ./nuxt/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/nest/dist ./nest/dist
COPY nest/data ./nest/data

# Configurable runtime environment variables
ENV PORT=3001
ENV APP_TODAY=2026-05-15

EXPOSE ${PORT}

CMD ["node", "nest/dist/main"]
