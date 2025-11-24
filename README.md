# Express + TypeScript + Prisma 7 + PostgreSQL + Docker CRUD API

A clean, modern, fully working, production-ready backend with full CRUD for tasks.

## Features
- Express.js + TypeScript
- Prisma 7 + PostgreSQL driver adapter (`PrismaPg`)
- Docker Compose (PostgreSQL + API with hot reload)
- Input validation with Zod
- RESTful routes under `/api`
- Jest + Supertest unit tests (fully mocked – instant)
- Local & Docker development support
- Ready for JWT auth, Swagger, CI/CD

## Project Structure
.
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── schemas/
│   ├── prisma.ts
│   └── server.ts
├── __tests__/                  ← Jest tests (mocked)
├── prisma.config.ts            ← Prisma 7 config
├── docker-compose.yml
├── Dockerfile
├── .env
├── jest.config.ts
└── README.md

## Quick Start (Docker – recommended)

```bash
# 1. Install dependencies
npm install

# 2. Start everything (PostgreSQL + API)
docker compose up --build -d

# 3. Run migration once
docker compose exec api npx prisma migrate dev --name init

# 4. API is live!
# http://localhost:3000
# Endpoints: http://localhost:3000/api/tasks
```

## Local Development (with Docker DB)
# Start only PostgreSQL
docker compose up postgres -d

# Run API locally (hot reload)
npm run dev

## API Endpoints
Method,URL,Description,Body / Query
POST,/api/tasks,Create task,"{ title, description? }"
GET,/api/tasks,List tasks,?completed=true&search=...
GET,/api/tasks/:id,Get task,—
PATCH,/api/tasks/:id,Update task,"{ title?, description?, completed? }"
DELETE,/api/tasks/:id,Delete task,—

## Scripts
npm run dev               # Local dev (uses localhost DB)
npm run docker:up         # Full Docker stack
npm run test              # Run Jest tests (mocked – super fast)
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
docker compose exec api npx prisma migrate dev   # Future migrations
docker compose exec api npx prisma studio        # Browse DB

## .env (required)
# Local development
DATABASE_URL=postgresql://postgres:password@localhost:5432/tasksdb?schema=public

# Docker (automatically passed by docker-compose.yml)
DATABASE_URL_DOCKER=postgresql://postgres:password@postgres:5432/tasksdb?schema=public

PORT=3000

## Testing
npm run test
# → 5 passing tests in ~100ms

# More scripts are available in package.json