# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Node.js Express template demonstrating modern development practices with:
- **Express.js web framework** with PostgreSQL database integration
- **Prisma ORM** for database management and type-safe queries
- **npm dependency management** for reliable package handling
- **Docker containerization** with multi-stage builds
- **just task automation** for streamlined workflows  
- **Docker containerization** for production deployment
- **Comprehensive testing** with Jest and coverage
- **Quality assurance** with ESLint and Prettier

## Environment Setup

1. **Copy environment template**: `cp .env.example .env`
2. **Configure settings** in `.env` (required - fail-fast approach)
3. **Node.js version**: 22 LTS (specified in .nvmrc and package.json engines)

## Key Commands

### Development Workflow
```bash
just install          # Install dependencies using npm
just dev              # Start Express app + PostgreSQL (port 3000)
just req [path]       # Send HTTP request to running server
just browser          # Open development server in browser
```

### Quality Assurance
```bash
just test             # Run tests with Jest
just cov              # Run tests with coverage reporting  
just lint             # Run ESLint and Prettier
just check-all        # Run all quality checks (lint + coverage)
```

### Production & Deployment  
```bash
just prod             # Run production server locally
just prod-container   # Build and run production Docker container
just build-container  # Build multi-platform Docker image
```

### Lifecycle Management
```bash
just update           # Update npm dependencies
just fresh            # Clean install from scratch  
just clear            # Remove temporary files and caches
```

### Database Management
```bash
just db-migrate       # Run database migrations
just db-reset         # Reset database with fresh migrations
just db-seed          # Seed database with test data
just db-studio        # Open Prisma Studio
```

## Configuration

Required environment variables in `.env`:
- **SERVICE_NAME**: nodejs-webapp (application identifier)
- **PORT**: Application port (3000)
- **NODE_ENV**: development or production
- **DATABASE_URL**: Full PostgreSQL connection string
- **POSTGRES_USER/PASSWORD/DB/HOST/PORT**: Database connection settings
- **LOG_LEVEL**: Logging verbosity level

## Project Structure

```
.
├── src/
│   ├── app.js              # Main Express application
│   ├── server.js           # Server startup with graceful shutdown
│   ├── routes/
│   │   ├── index.js        # Main routes (/, /health, /echo)
│   │   └── api.js          # API endpoints (/api/users)
│   ├── middleware/
│   │   ├── logging.js      # Request logging to database
│   │   └── errorHandler.js # Global error handling
│   └── utils/
│       └── database.js     # Database connection utilities
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Generated migrations
│   └── seed.js             # Database seeding
├── tests/
│   ├── app.test.js         # Main app tests
│   ├── routes/
│   │   ├── index.test.js   # Route tests
│   │   └── api.test.js     # API endpoint tests
│   └── setup.js            # Test setup and teardown
├── config/
│   ├── database.js         # Database configuration
│   └── app.js              # Application configuration
├── .github/workflows/ci.yml# CI/CD pipeline
├── package.json            # Dependencies and scripts
├── package-lock.json       # Locked dependencies
├── justfile                # Task automation
├── .env.example            # Environment template
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── jest.config.js          # Jest test configuration
├── docker-entrypoint.sh    # Container startup script
├── compose.yml             # Docker Compose config
├── compose.prod.yml        # Production Docker config
├── Dockerfile              # Container definition
└── docker-entrypoint.sh    # Container entry point
```

## Express Application

The app (`src/app.js` and routes) demonstrates database integration:
- `/` - System info with request logging to PostgreSQL database
- `/health` - Health check endpoint  
- `/echo/:text` - Echo service with text reversal and length
- `/api/users` - Full CRUD operations for users

**Key Features:**
- **Database persistence** - All requests are logged to PostgreSQL via Prisma
- **Database migrations** - Schema managed via Prisma migrations
- **Error handling** - Graceful degradation if database unavailable
- **Request history** - Shows last 10 requests from database
- **Type safety** - Prisma provides type-safe database queries

## Testing

```bash
just test         # Run all tests
just cov          # Run tests with coverage report
just check-all    # Run all checks (lint, coverage)
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
- Runs on push/PR to main branch
- Uses Node.js 20 LTS
- Sets up PostgreSQL service for testing
- Executes `just check-all` for quality gates
- Builds and tests Docker container

## Common Issues

### Missing Environment Variables
```
Error: Environment variable `VARIABLE_NAME` is not defined
```
**Solution**: Ensure `.env` file exists with all required variables from `.env.example`

### Port Already in Use
```bash
PORT=8080 just dev  # Use alternative port via environment variable
```

### Database Connection Issues
```bash
# Restart database container
docker compose down
just dev  # Will restart PostgreSQL automatically

# Clear database volumes if needed
docker compose down -v
just dev  # Creates fresh database

# Reset database with migrations
just db-reset
just db-seed  # Add test data
```

### Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Run pending migrations
just db-migrate

# View database in browser
just db-studio
```

## Best Practices

1. **Always use `.env`**: No hardcoded configuration (fail-fast approach)
2. **Test locally first**: Use `just dev` for development
3. **Run checks**: Use `just check-all` before committing
4. **Database migrations**: Always use `just db-migrate` for schema changes
5. **CI/CD**: All PRs must pass `just check-all` to merge
6. **Production**: Use Docker containers for production deployment

## Docker

### Build and Run
```bash
just build-container                    # Build Docker image
docker run -p 3000:3000 -e PORT=3000 \
  -e NODE_ENV=production SERVICE_NAME:latest  # Run container
```

### Production Deployment
```bash
docker compose -f compose.prod.yml up   # Run with production config
just prod                               # Run production server locally
```

## Development Workflow

1. Make changes to code
2. Run `just test` to verify tests pass
3. Run `just check-all` to ensure code quality
4. Commit changes (CI will run automatically)

## Justfile Syntax Reference

**IMPORTANT**: Always use proper justfile syntax to avoid errors:

```just
# Variables (at top of file)
var := "value"
var := `command`
var := env_var("VAR_NAME")

# Simple recipe (single command)
target:
    command args

# Recipe with parameters
target param="default":
    command {{param}}

# Recipe with environment variable
target:
    VAR=value command

# Recipe with bash script (for complex logic)
target:
    #!/usr/bin/env bash
    if [ condition ]; then
        command
    fi
```

**Common Mistakes to Avoid:**
- ❌ `target: command` (missing indentation)
- ❌ `target: VAR=value command` (env var on same line)
- ❌ Single-line conditionals with `{{ if }}`
- ✅ Always indent recipe bodies with 4 spaces
- ✅ Put environment variables on separate line
- ✅ Use bash scripts for conditionals