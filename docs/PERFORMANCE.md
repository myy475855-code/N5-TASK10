# Performance Evidence

## Backend baseline
Measure the unoptimized query using PostgreSQL:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT i.*, c.name
FROM "Internship" i
JOIN "Company" c ON c.id = i."companyId"
WHERE i.location = 'Lahore'
ORDER BY i."createdAt" DESC
LIMIT 12;
```

Record:
- Before execution time: ______ ms
- Before query plan: attach screenshot

## Optimization
The schema includes:

```sql
CREATE INDEX "Internship_location_createdAt_idx"
ON "Internship" ("location", "createdAt");
```

Run the same EXPLAIN after migration and record:
- After execution time: ______ ms
- After query plan: attach screenshot

## Frontend baseline/after
Use Chrome DevTools Lighthouse in an Incognito window.

Record:
- Baseline Performance score: ______
- Optimized Performance score: ______
- Baseline JS transfer: ______ KB
- Optimized JS transfer: ______ KB

Frontend improvements included:
- 350ms debounced search
- server-side pagination
- only current-page data is rendered
- minimal vanilla JavaScript bundle
- deferred application script

## Important
Do not invent benchmark values. The final report must contain measurements from the deployed/local application and screenshots from DevTools and PostgreSQL.
