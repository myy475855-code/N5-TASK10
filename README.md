# Internship Catalog — Production Deployment Project

## Overview
A full-stack internship catalog demonstrating server-side search/filter/sort/pagination, Prisma/PostgreSQL optimization, secure uploads, Docker Compose, structured logs, health checks, Swagger, and production deployment readiness.

## Architecture
Browser → Nginx frontend → Express API → Prisma → PostgreSQL.
Uploads are stored outside the database and referenced by controlled server-generated filenames.

## Run locally
Prerequisite: Docker Desktop.

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:8080
- API: http://localhost:3000
- Health: http://localhost:3000/health
- Swagger: http://localhost:3000/api-docs

Seed the database:
```bash
docker compose exec backend npm run seed
```

## Environment variables
Copy `backend/.env.example` to `backend/.env` when running the backend outside Compose. Never commit production secrets.

## Performance work
The API uses server-side Prisma filtering and pagination instead of loading all rows into memory. A composite `(location, createdAt)` index is included for common filtered/newest queries. Run the SQL in `docs/PERFORMANCE.md` with PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` and record real before/after execution times.

## Frontend performance
Search is debounced by 350ms and responses are rendered only for the current page. Use Chrome Lighthouse/DevTools to record a baseline and after-optimization score in `docs/PERFORMANCE.md`.

## Production deployment
Recommended workflow:
1. Choose a frontend host such as Vercel and a backend host such as Render/Railway/Fly.io after checking their current pricing/limits.
2. Provision managed PostgreSQL.
3. Set production `DATABASE_URL`, `FRONTEND_ORIGIN`, `NODE_ENV=production`, and upload/storage settings in the platform dashboard.
4. Run `prisma migrate deploy` during the backend release step.
5. Configure HTTPS, CORS and authentication cookies/tokens for the final domains.
6. Verify `/health`, Swagger, frontend API calls, uploads and database access.
7. Put the final public URLs below.

## Live URLs
Frontend: TO BE FILLED AFTER DEPLOYMENT
API/Swagger: TO BE FILLED AFTER DEPLOYMENT

## Security
- Server-side upload allowlisting and size limits.
- Random filenames prevent path traversal and filename collisions.
- Owner-only upload authorization.
- Helmet and restrictive JSON request limits.
- Production should use private object storage and signed URLs where appropriate.

## Known limitations
The included authentication middleware is a demo adapter using headers so the project can run standalone. Replace it with the project's real JWT/session authentication before production. Actual deployment URLs and performance numbers must be measured rather than fabricated.
