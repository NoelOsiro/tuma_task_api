# 1. High-level system overview

This document describes the high-level architecture and data flow for TumaTask.

```bash
[Mobile / Web UI (Next.js PWA / React Native later)]
        ⇩ HTTPS
     [Auth0 (Universal Login)]
        ⇩ JWT
     [API Gateway / FastAPI Backend]
        ├─ Task Service
        ├─ Matching Engine
        ├─ Payment Service
        ├─ Notification Service
        ├─ Rating/Dispute Service
        └─ Admin Service
        ⇩
  ┌──────────────┬───────────────┬──────────────┐
  │ PostgreSQL   │   Redis       │ Object Store │
  │ (persistent) │ (cache/queue) │ (S3/Supabase)│
  └──────────────┴───────────────┴──────────────┘
        ⇩
  External Integrations: Auth0, M-Pesa Daraja, Mapbox, Firebase, Twilio/Africa's Talking
```

This layout indicates a secure frontend using Auth0 for identity, a stateless FastAPI backend broken into specialized services, and persistent + ephemeral storage via PostgreSQL and Redis. Object storage (S3/Supabase) holds media.
