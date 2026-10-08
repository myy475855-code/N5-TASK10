# Architecture

```text
                         ┌──────────────────────┐
                         │      Browser         │
                         │ Search / Filters UI  │
                         └──────────┬───────────┘
                                    │ HTTPS
                         ┌──────────▼───────────┐
                         │ Nginx / Frontend     │
                         │ Static HTML/CSS/JS    │
                         └──────────┬───────────┘
                                    │ API
                         ┌──────────▼───────────┐
                         │ Express Backend       │
                         │ logging + CORS + auth │
                         └──────────┬───────────┘
                                    │ Prisma
                         ┌──────────▼───────────┐
                         │ PostgreSQL            │
                         │ indexes + migrations   │
                         └───────────────────────┘
```

## Request flow
1. Browser sends debounced search/filter query.
2. Express validates query parameters.
3. Prisma creates a database-side WHERE/ORDER BY query.
4. PostgreSQL returns only the requested page.
5. API sends compact JSON including pagination metadata.
6. Frontend renders the current page.

## Performance strategy
- Never fetch all internships to filter in JavaScript.
- Use `skip/take` with a bounded `limit`.
- Select only fields required by the UI.
- Index common filter/sort columns.
- Measure queries with `EXPLAIN (ANALYZE, BUFFERS)`.

## Deployment separation
Local Compose uses PostgreSQL as a service. Production uses a managed PostgreSQL instance, HTTPS, platform environment variables, and `prisma migrate deploy` as an explicit release step.
