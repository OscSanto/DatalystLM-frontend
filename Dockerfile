# ── Stage 1: Build ────────────────────────────────────────────────────────────
# Node is only needed to install dependencies and run the Vite build.
# It never makes it into the final image — this entire stage is thrown away.
FROM node:20-alpine AS build
WORKDIR /app

# Copy lock files first, before source code.
# Docker caches this layer separately — npm ci only re-runs when package*.json changes.
# Without this, every source code change would trigger a full dependency re-download.
COPY package*.json ./

# npm ci (not npm install):
# - Uses package-lock.json exactly — no version resolution, fully deterministic
# - Faster than npm install
# - Fails if lock file is missing or out of sync — catches drift early
# Always use npm ci in Docker and CI pipelines.
RUN npm ci

# Now copy source. This layer invalidates on any src change,
# but dependency layer above stays cached.
COPY . .

# Vite builds the React app into /app/dist.
# Output: optimised, minified JS/CSS bundles ready to serve as static files.
RUN npm run build

# ── Stage 2: Run ──────────────────────────────────────────────────────────────
# Tiny nginx image — no Node, no npm, no source code, no build tools.
# Final image is just nginx + the compiled React bundle (~30MB total).
FROM nginx:alpine

# Replace nginx's default config with ours.
# Our config adds: SPA routing fix, /api/ proxy to backend, gzip, rate limiting.
COPY nginx.conf /etc/nginx/nginx.conf

# Pull only the built static files from Stage 1.
# Everything else (node_modules, source, build tools) is discarded.
COPY --from=build /app/dist /usr/share/nginx/html

# Document that nginx listens on port 80 inside the container.
# Actual port binding (host → container) is handled in docker-compose or K8s.
EXPOSE 80

# nginx forks to background by default and exits — Docker would think the container died.
# "daemon off" keeps nginx in the foreground as PID 1 so Docker can manage it.
# CMD (not ENTRYPOINT) because we don't need to pass runtime arguments to nginx.
CMD ["nginx", "-g", "daemon off;"]
