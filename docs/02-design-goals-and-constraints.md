# 2. Design goals & constraints

- Real-time proximity matching like Uber — low-latency discovery.
- Secure, fast auth using Auth0 (phone/email/passwordless).
- Kenya-first integrations: M-Pesa (Daraja) for payments & payouts, Africa’s Talking/Twilio for SMS.
- Start in one city (Nairobi) — single-region deployment is OK initially.
- Ability to scale: stateless FastAPI services, Redis for ephemeral / real-time state.

These goals drive choices such as Redis for location/proximity lookups, Auth0 for robust identity and sessions, and a managed Postgres for durable data.
