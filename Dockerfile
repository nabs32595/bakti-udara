# Dockerfile (repo root) — VitePress docs service
FROM node:20-alpine

# VitePress shells out to `git` for lastUpdated / contributors metadata,
# so we install it here (node:alpine ships without it).
RUN apk add --no-cache git

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the repo (docs/ lives here)
COPY . .

EXPOSE 5174

# VitePress default port is 5173; use 5174 to avoid clashing with the FE service.
# --host 0.0.0.0 makes it reachable from outside the container.
CMD ["npm", "run", "docs:dev", "--", "--host", "0.0.0.0", "--port", "5174"]
