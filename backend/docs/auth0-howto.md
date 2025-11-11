# Auth0 HOWTO — get a test access token and verify /api/v1/auth/me

This short HOWTO shows developers how to obtain a test access token for the dev tenant and call the backend protected endpoint `/api/v1/auth/me`.

Warning: For local testing we show a Resource Owner Password Grant (ROPG) style example which is suitable only for development and test accounts. Do not use ROPG for public production apps. Prefer the Authorization Code flow (PKCE) for SPAs and Auth Code for server-side apps.

Prerequisites

- A dev Auth0 tenant with an API (`AUTH0_AUDIENCE`) and a SPA application configured (callback/logout URLs include `http://localhost:3000`).
- A test user created in the dev tenant (email/password).
- `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, and `AUTH0_DEV_SPA_CLIENT_ID` configured locally in `backend/.env` (copy from `.env.example`).

1) Create a test user (if you haven't already)

- In Auth0 Dashboard (dev tenant) > Authentication > Database > Create user (email/password)

Obtain a test access token (dev) — example using password grant (dev only)
Replace the placeholders below with your dev tenant values and a test user's credentials.

```bash
# Example: use Auth0's token endpoint (dev tenant)
curl --request POST \
  --url https://${AUTH0_DOMAIN}/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "grant_type":"password",
    "username":"testuser@example.com",
    "password":"test-password",
    "audience":"${AUTH0_AUDIENCE}",
    "scope":"openid profile email",
    "client_id":"${AUTH0_DEV_SPA_CLIENT_ID}"
  }'
```

The response will include an `access_token` (JWT if your API configuration issues JWTs).

Call the backend protected endpoint

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:8000/api/v1/auth/me
```

Expected: a JSON body with validated claims (sub, email, name) if the token is valid.
If JWKS verification is active but you're debugging or want to use the Auth0 /userinfo endpoint instead, set in `backend/.env`:

```bash
AUTH0_VERIFY_MODE=userinfo
```

Then repeat step (3) — the backend will call Auth0 `/userinfo` to validate the token instead of verifying the signature locally.

Notes and alternatives

- Prefer the Authorization Code + PKCE flow for SPAs in dev. Use the browser-based login for a realistic auth flow.
- Automate tenant and app creation with Terraform or the Auth0 Management API for reproducible infra.

If you want, I can add a small local script `backend/scripts/get_test_token.py` to request a test token and print it out.
