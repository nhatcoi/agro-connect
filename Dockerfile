# Multi-stage build: deps -> build -> runtime

# 1) Base with pnpm
FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate
WORKDIR /app

# 2) Dependencies layer
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 3) Builder: build client and server
FROM deps AS build
COPY . .
RUN pnpm build

# 4) Runtime image
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate
WORKDIR /app

# Only copy runtime artifacts
COPY --from=build /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

# App listens on 3007 (server/node-build.ts)
ENV PORT=3007
EXPOSE 3007

CMD ["node", "dist/server/node-build.mjs"]


