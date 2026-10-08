# Deployment Guide

## Platform comparison
Before deployment, compare at least:
- Vercel: frontend/static hosting and CDN; verify current limits.
- Render: simple backend + managed database options; verify current free/paid availability.
- Railway: convenient containers/databases; verify current pricing/usage limits.
- Fly.io: flexible containers and regions; verify current pricing.

Record the date, plan, limits, expected monthly cost and reliability considerations in the final submission. Pricing changes, so do not copy old limits without checking the providers' current documentation.

## Production sequence
1. Create managed PostgreSQL.
2. Build/push backend.
3. Set `DATABASE_URL`, `NODE_ENV=production`, `FRONTEND_ORIGIN`.
4. Run `npx prisma migrate deploy`.
5. Deploy frontend.
6. Set frontend API base URL to the HTTPS backend URL.
7. Configure CORS to exactly match the frontend origin.
8. Verify HTTPS, health check, API docs and database queries.
9. Verify authentication cookie/token settings end-to-end.
10. Test search, filters, pagination and uploads.

## Secrets
Never place passwords, JWT secrets, database URLs, or private storage credentials in Git. Use platform secret/environment-variable settings.

## Health check
Configure the hosting platform to monitor:

`GET /health`

Expected status: HTTP 200.
