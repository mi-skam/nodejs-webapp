# justfile for nodejs-webapp project

# Load environment variables from .env file if it exists
set dotenv-load := true

SERVICE_NAME := env_var("SERVICE_NAME")
PORT := env_var("PORT")

# Show available commands
@_:
    @just --list --unsorted

# Install dependencies
[group('lifecycle')]
install:
    npm install

# Run development server with hot reload
[group('run')]
dev:
    #!/usr/bin/env bash
    # Start Docker Compose services if compose.yml exists
    if [ -f compose.yml ]; then
        echo "Starting Docker Compose services..."
        docker compose -f compose.yml up --remove-orphans -d postgres
        echo "Waiting for services to be ready..."
        sleep 3
    fi
    
    # Run database migrations
    npx prisma migrate dev --name init || echo "⚠️ Migration failed or already exists"
    
    # Start the development server
    npm run dev

# Run production server with PM2
[group('run')]
prod:
    #!/usr/bin/env bash
    if [ -f compose.yml ]; then
        echo "Starting Docker Compose services..."
        docker compose -f compose.yml up --remove-orphans -d postgres
        echo "Waiting for services to be ready..."
        sleep 3
    fi
    
    # Create logs directory
    mkdir -p logs
    
    # Run database migrations
    npx prisma migrate deploy
    
    # Start production server
    npm run prod

# Build and run production Docker container
[group('run')]
prod-container: build-container
    docker compose -f compose.prod.yml up --remove-orphans --build

# Send HTTP request to development server
[group('run')]
req path="" *args:
    curl -s {{ args }} http://127.0.0.1:{{ PORT }}/{{ path }} | jq .

# Open development server in web browser
[group('run')]
browser:
    #!/usr/bin/env bash
    if command -v open >/dev/null 2>&1; then
        open http://127.0.0.1:{{ PORT }}
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open http://127.0.0.1:{{ PORT }}
    else
        echo "http://127.0.0.1:{{ PORT }}"
    fi

# Run tests with Jest
[group('qa')]
test *args:
    npm test {{ args }}

# Run tests with coverage reporting
[group('qa')]
cov:
    npm run test:coverage

# Run ESLint and Prettier
[group('qa')]
lint:
    npm run lint

# Perform all quality checks
[group('qa')]
check-all: lint cov

# Update npm dependencies
[group('lifecycle')]
update:
    npm update
    npm audit fix

# Remove temporary files and caches
[group('lifecycle')]
clear:
    rm -rf node_modules coverage logs .jest
    npm cache clean --force

# Clean install from scratch
[group('lifecycle')]
fresh: clear install

# Reset database with fresh migrations
[group('db')]
db-reset:
    npx prisma migrate reset --force

# Run database migrations
[group('db')]
db-migrate:
    npx prisma migrate dev

# Seed database with test data
[group('db')]
db-seed:
    npx prisma db seed

# Open Prisma Studio for database management
[group('db')]
db-studio:
    npx prisma studio

# Build Docker image for multiple platforms
[group('lifecycle')]
build-container:
    docker buildx build --platform linux/amd64,linux/arm64 -t {{SERVICE_NAME}}:latest .