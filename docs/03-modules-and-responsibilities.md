# 3. Main modules & responsibilities

## 3.1 Frontend (Next.js)

- Universal app (PWA) for Poster and Worker.
- Login via Auth0 (Universal Login). Tokens stored in secure HttpOnly cookies (web) or secure storage (mobile).
- Features:
  - Post task (title, description, location via map pin, price or open-to-bid)
  - Browse nearby tasks (map + list)
  - Receive offers / accept / start / complete
  - In-app chat (or phone) and notifications
  - Wallet (view balance), ratings, disputes
- Libraries: `@auth0/nextjs-auth0`, SWR/React Query, mapbox-gl or react-google-maps, Tailwind CSS.

## 3.2 Backend (FastAPI)

- Exposes REST (or GraphQL) endpoints consumed by Next.js.
- Responsibilities:
  - Verify Auth0 JWT on each request (use JWKS).
  - Core services: Task, Matching, Payment, Notification, Rating, Admin.
  - Use async workers (Celery / RQ / FastAPI background tasks) for long-running jobs (payment reconciliation, webhooks).
- Key tech: FastAPI, Uvicorn/Gunicorn, Prisma (Prisma Migrate for schema & migrations) — or SQLAlchemy/SQLModel if you prefer a Python-native ORM.

## 3.3 PostgreSQL

- Primary persistent storage for users, tasks, offers, assignments, payments, ratings, disputes, audit logs.
- Use PostGIS extension (or at least `earthdistance`/`cube`) or store simple lat/lon floats and index with GiST for geo queries.

## 3.4 Redis

- Fast ephemeral state: online worker locations, presence (online/offline), push queue for matching, rate-limiting, caching hot queries.
- Use Redis GEO commands for proximity lookup and streams/lists for dispatch queues.

## 3.5 Object Storage

- Store task photos/videos in S3 or Supabase Storage; store only URLs in Postgres.

## 3.6 External integrations

- Auth0 for auth & role claims.
- M-Pesa (Daraja): STK Push, B2C payouts.
- Mapbox / Google Maps: geocoding, tiles, routing.
- Firebase (FCM): push notifications; fallback to SMS via Twilio/Africa's Talking.
