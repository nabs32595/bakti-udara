# FE/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 5173

# --host 0.0.0.0 makes Vite reachable from outside the container (Docker port mapping)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
