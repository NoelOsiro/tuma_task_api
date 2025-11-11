# 7. Detailed API endpoints

Use RESTful patterns and versioning (e.g., `/api/v1`). Below are core endpoints grouped by capability.

## Auth / user

- `GET  /api/v1/auth/me` — return profile (requires JWT)
- `POST /api/v1/users` — create internal profile (called on first login)
- `PATCH /api/v1/users/:id` — update profile (skills, radius)

## Tasks

- `POST   /api/v1/tasks` — create task (poster)
- `GET    /api/v1/tasks?lat=&lng=&radius=&category=` — search nearby tasks (worker)
- `GET    /api/v1/tasks/:id` — task detail
- `PATCH  /api/v1/tasks/:id` — update/cancel task
- `POST   /api/v1/tasks/:id/attachments` — upload photo

## Offers / Bids

- `POST /api/v1/tasks/:id/offers` — worker submits offer
- `GET  /api/v1/tasks/:id/offers` — poster views offers
- `POST /api/v1/offers/:id/accept` — poster accepts offer → creates assignment

## Assignments & lifecycle

- `POST /api/v1/assignments/:id/start` — worker starts
- `POST /api/v1/assignments/:id/complete` — worker marks complete
- `POST /api/v1/assignments/:id/confirm` — poster confirms completion (release payment)

## Payments

- `POST /api/v1/payments/initiate` — start STK push (poster pays)
- `POST /api/v1/payments/webhook` — M-Pesa webhook for confirmation (idempotent handler)
- `GET  /api/v1/wallet` — worker wallet balance & transactions
- `POST /api/v1/wallet/withdraw` — initiate B2C payout

## Messaging / Notifications

- `GET  /api/v1/tasks/:id/messages` — fetch chat messages
- `POST /api/v1/tasks/:id/messages` — send message (push + persist)

## Ratings & disputes

- `POST /api/v1/tasks/:id/rate` — rate other party
- `POST /api/v1/tasks/:id/dispute` — open dispute

## Admin

- `GET /api/v1/admin/users` — list users
- `POST /api/v1/admin/resolve-dispute` — admin action
