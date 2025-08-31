# Node.js Express Template with Prisma & Docker

A production-ready Node.js web application template demonstrating modern JavaScript development practices with containerization, database integration, and comprehensive testing.

## Template Overview

- **Express.js web framework** with PostgreSQL database integration
- **Prisma ORM** for database management and type-safe queries
- **Docker containerization** with multi-stage builds for production deployment
- **just task automation** for streamlined development workflows
- **Docker containerization** for production deployment and scaling
- **Quality assurance tools** including ESLint, Prettier, and Jest testing
- **GitHub Actions CI/CD** pipeline ready for deployment

## Architecture Components

### Core Application (`src/`)
- **`app.js`** - Main Express application with middleware and route configuration
- **`server.js`** - Server startup with graceful shutdown handling
- **`routes/`** - API route handlers (index.js, api.js)
- **`middleware/`** - Request logging and error handling middleware
- **`utils/`** - Database utilities and connection management

### Database Layer (`prisma/`)
- **`schema.prisma`** - Database schema with models and relationships
- **`migrations/`** - Database migration files (auto-generated)
- **`seed.js`** - Database seeding script for test data

### Development Infrastructure
- **`justfile`** - Task automation (like npm scripts but more powerful)
- **`package.json`** - Node.js dependencies and npm scripts
- **`jest.config.js`** - Testing configuration with coverage
- **`compose.yml`** - PostgreSQL database for local development

### Production Infrastructure  
- **`Dockerfile`** - Multi-stage build optimized for production
- **`compose.prod.yml`** - Production container orchestration
- **`docker-entrypoint.sh`** - Container startup script
- **`docker-entrypoint.sh`** - Container startup script

### Quality Assurance
- **`.eslintrc.js`** - JavaScript linting configuration
- **`.prettierrc`** - Code formatting configuration
- **`tests/`** - Comprehensive test suite with coverage reporting

## Prerequisites

- Node.js 20 LTS
- Docker
- [just](https://github.com/casey/just) task runner

## Quick Start

### 1. Setup Environment
```bash
cp .env.example .env
# Edit .env with your preferred settings
```

### 2. Start Development
```bash
just install  # Install dependencies
just dev      # Start app + database (http://localhost:3000)
```

### 3. Verify Everything Works
```bash
just test     # Run test suite
just req      # Test API endpoint
just browser  # Open in browser
```

## Available Commands

### Development Workflow
| Command | Description |
|---------|-------------|
| `just install` | Install dependencies using npm |
| `just dev` | Start development server + PostgreSQL |
| `just req [path]` | Send HTTP request to running server |
| `just browser` | Open development server in browser |

### Quality Assurance  
| Command | Description |
|---------|-------------|
| `just test` | Run test suite with Jest |
| `just cov` | Run tests with coverage reporting |
| `just lint` | Run ESLint and Prettier |
| `just check-all` | Run all quality checks (lint + coverage) |

### Production & Deployment
| Command | Description |
|---------|-------------|
| `just prod` | Run production server locally |
| `just prod-container` | Build and run production Docker container |
| `just build-container` | Build multi-platform Docker image |

### Database Management
| Command | Description |
|---------|-------------|
| `just db-migrate` | Run database migrations |
| `just db-reset` | Reset database with fresh migrations |
| `just db-seed` | Seed database with test data |
| `just db-studio` | Open Prisma Studio for database management |

### Lifecycle Management
| Command | Description |
|---------|-------------|
| `just update` | Update npm dependencies |
| `just fresh` | Clean install from scratch |
| `just clear` | Remove temporary files and caches |

## Configuration

Required environment variables in `.env`:

```bash
# Application Settings
NODE_ENV=development
PORT=3000
SERVICE_NAME=nodejs-webapp

# Database Configuration  
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nodejs_webapp_db"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=nodejs_webapp_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Logging
LOG_LEVEL=info
```

## Building Your Application

### 1. Add Your Routes
Start by modifying `src/routes/api.js`:

```javascript
router.get('/products', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const products = await prisma.product.findMany();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
```

### 2. Create Database Models  
Add new models to `prisma/schema.prisma`:

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(100)
  description String?  @db.Text
  price       Decimal  @db.Decimal(10, 2)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("products")
}
```

Then run: `just db-migrate`

### 3. Add Dependencies
Add new packages using npm:

```bash
npm install your-package-name
npm install --save-dev your-dev-package
```

### 4. Write Tests
Add tests to `tests/routes/api.test.js`:

```javascript
describe('GET /api/products', () => {
  it('should return products list', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);

    expect(response.body).toHaveProperty('products');
    expect(Array.isArray(response.body.products)).toBe(true);
  });
});
```

### 5. Configure Production
Update `compose.prod.yml` for your deployment needs:
- Environment variables
- Volume mounts  
- Resource limits
- Health checks

## API Endpoints (Demo Application)

The template includes a demo Express app with database integration:

- **`GET /`** - System info with request logging to database
- **`GET /health`** - Health check endpoint  
- **`GET /echo/:text`** - Echo service with text reversal and length
- **`GET /api/users`** - List users with pagination
- **`POST /api/users`** - Create new user
- **`GET /api/users/:id`** - Get user by ID
- **`PUT /api/users/:id`** - Update user
- **`DELETE /api/users/:id`** - Delete user

**Example response from `/`:**
```json
{
  "debug_mode": "true",
  "express_version": "4.18.2",
  "node_version": "v20.9.0",
  "environment": "development",
  "service_name": "nodejs-webapp",
  "port": "3000",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "recent_requests": [
    {
      "id": 1,
      "timestamp": "2024-01-01T11:59:55.123Z",
      "method": "GET",
      "path": "/",
      "status_code": 200,
      "environment": "development",
      "express_version": "4.18.2"
    }
  ]
}
```

## Testing Strategy

```bash
just test      # Run Jest test suite
just cov       # Generate coverage report  
just check-all # Run all quality checks
```

**Test coverage includes:**
- All Express endpoints (success & error cases)
- Database operations with Prisma
- Middleware functionality
- Error handling and edge cases
- API response validation
- CRUD operations for users

## Deployment Patterns

### Local Development
```bash
just dev        # App + PostgreSQL with live reload
just req        # Test API quickly  
just check-all  # Verify code quality
```

### Production Container
```bash
just build-container     # Build optimized image
just prod-container      # Test production build locally
```

### Production Server
```bash
just prod               # Start production server locally
just prod-container     # Run in Docker container
docker logs <container> # View container logs
```

## Troubleshooting

### Environment Issues
**Missing `.env` file:**
```bash
cp .env.example .env
# Edit .env with your settings
```

**Port conflicts:**
```bash
# Change PORT in .env file
PORT=8080 just dev
```

### Database Issues  
**PostgreSQL connection failed:**
```bash
# Restart database container
docker compose down
just dev  # Will restart PostgreSQL automatically
```

**Prisma client out of sync:**
```bash
npx prisma generate  # Regenerate Prisma client
just db-migrate      # Run pending migrations
```

**Database schema errors:**
```bash
# Reset database completely
just db-reset        # Resets with fresh migrations
just db-seed         # Add test data
```

### Docker Issues
**Build failures:**
```bash
# Clear Docker cache
docker builder prune
just build-container
```

**Container won't start:**
```bash
# Check logs
docker logs <container-name>
# Debug with shell access
docker run -it --entrypoint /bin/sh <image-name>
```

### Node.js Issues
**Dependencies out of date:**
```bash
just update          # Update all packages
npm audit fix        # Fix security issues
```

**Memory issues:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

## Template Customization

### Change Application Name
1. Update `SERVICE_NAME` in `.env`
2. Update `name` in `package.json`
3. Update Docker image tags and container names
4. Update Docker image tags

### Add New Services
Add to `compose.yml`:
```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  app:
    # ... existing config
    depends_on:
      - postgres
      - redis
```

### Custom justfile Tasks
Add to `justfile`:
```just
# Deploy to staging
deploy-staging:
    docker build -t myapp:staging .
    docker push registry.example.com/myapp:staging
    
# Run performance tests
perf-test:
    npx autocannon -c 10 -d 30 http://localhost:3000
```

### Environment-Specific Configuration
Create additional environment files:
- `.env.staging`
- `.env.production`

Load with: `just dev --env-file .env.staging`

## Performance Optimization

### Production Optimizations
- Multi-stage Docker builds minimize image size
- Docker container orchestration for scaling
- Connection pooling with Prisma
- Helmet.js for security headers
- Graceful shutdown handling

### Monitoring
```bash
# Health checks
just req health

# Container logs
docker logs <container-name>

# Database performance
npx prisma studio
```

### Scaling Considerations
- Horizontal scaling with Docker Swarm or Kubernetes
- Multiple container instances behind load balancer
- Database read replicas with Prisma
- Redis caching layer for session storage

## Security Features

- Helmet.js security headers
- CORS configuration
- Input validation and sanitization
- SQL injection prevention with Prisma
- Environment variable validation
- Non-root Docker containers
- Dependency vulnerability scanning

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `just check-all` to ensure quality
5. Submit a pull request

## License

MIT License - see LICENSE file for details