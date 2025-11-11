# 12. Development checklist & MVP roadmap

## Phase 0 — Foundation

- Auth0 tenant + apps configured (dev/prod)
- Dev Postgres + Redis + object storage
- Next.js skeleton + Auth0 integration
- FastAPI skeleton + JWT verify
- Basic Postgres models + migrations

## Phase 1 — Core MVP (4–6 weeks)

- Task create/list/detail flows (poster, worker)
- Worker presence & geo (Redis GEO)
- Matching + accept flow (lock & assignment)
- M-Pesa sandbox STK flow (initiate + simulate webhook)
- Basic notifications (push + SMS fallback)
- Postgres persistence, admin basic views

## Phase 2 — Polish & pilot (4 weeks)

- Rating & dispute flows
- Wallet & payout (Daraja B2C)
- Admin dashboard
- Analytics + KPIs + heatmap
- QA & small pilot in Nairobi
