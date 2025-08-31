# Build stage
FROM node:22-alpine as builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma/ ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# Runtime stage
FROM node:22-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl dumb-init && \
    addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001

# Copy node_modules and generated Prisma client from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copy application code
COPY src/ ./src/
COPY config/ ./config/
COPY package*.json ./
COPY docker-entrypoint.sh ./

# Set correct permissions
RUN chmod +x docker-entrypoint.sh && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Run the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]