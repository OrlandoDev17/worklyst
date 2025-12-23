# Build stage
FROM node:20-alpine AS builder

# Install build dependencies for sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json ./

# Install dependencies using npm to ensure standard node_modules structure
# We ignore pnpm-lock.yaml for the build to avoid compatibility issues in Docker
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package.json ./

# Install only production dependencies
# We also need build tools here if we want to rebuild sqlite3, but usually better to copy from builder if possible.
# However, for simplicity and reliability with native modules, we'll install dependencies afresh.
# To allow sqlite3 to run, we might need python/make if it decides to rebuild, but usually prebuilds work or we copy from builder (advanced).
# For now, let's keep it simple: install prod deps. If it fails, we add tools.
RUN npm install --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
# Copy bootstrap.yml as it is required by the config loader
COPY bootstrap.yml ./

# Create data directory for SQLite
RUN mkdir -p data

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
