# Cloudflare full-stack architecture

## Request path

1. Browser loads React SPA from Cloudflare Workers Static Assets.
2. Client-side route chunks are lazy loaded and cached at Cloudflare edge.
3. Public requests never need auth: home, services, about/blog, quote, guest tracking.
4. `/api/*` is routed to the Worker first by `run_worker_first`.
5. Hono validates JSON with Zod and queries D1 using parameterized statements.
6. Private dashboard/order routes verify the HttpOnly session cookie in D1.
7. R2 stores binary image assets; D1 stores metadata only.

## Data boundaries

Guest tracking matches `orders.code` + `orders.email`, then returns only:

- order code/status/progress
- ETA/destination
- SKU/supplier/unit counts
- sanitized milestone timeline

Guest tracking never returns supplier names, unit costs, invoices or private QC documents.

## Runtime services

Only these Cloudflare runtime services are used:

- Workers
- Static Assets
- D1
- R2

No third-party database, storage, hosting or image-transformation runtime is required.
