
# Auth0 tenant + apps configured (task)

## Description

-----------

- Provision and configure Auth0 for both development and production usage.
- Create an API (audience + scopes) that represents the backend.
- Create applications for the frontend (SPA / Next.js) and any machine-to-machine needs.
- Define initial roles and map them into tokens or custom claims for the backend to consume.

## Detailed steps

-----------

Create Auth0 API (Backend)

- Name: tuma-task-api
- Identifier (audience): e.g. <https://tuma.example.com/api>
- Define scopes: openid, profile, email, tasks:read, tasks:write, admin

Create Applications

- Frontend (SPA) — Type: Single Page Application
  - Allowed Callback URLs (dev): <http://localhost:3000/api/auth/callback>
  - Allowed Logout URLs (dev): <http://localhost:3000>
  - Allowed Web Origins: <http://localhost:3000>
- Backend / CI (if needed) — Type: Machine to Machine Application
  - Grant this app access to the API and select the scopes it needs

Roles and Claims

- Create roles: poster, worker, admin
- Option A: Enable RBAC and "Add Permissions in the Access Token" so scopes/permissions are in tokens
- Option B: Create an Action (or Rule) to add a custom claim (e.g., `https://tuma.example.com/roles`) containing the user's roles

 Security & CORS

- Ensure Allowed Web Origins and CORS are set for dev and production domains
- Keep client secrets in a secure store (do not commit to git)

Test user

- Create at least one test user in the dev tenant (email/password) to validate flows

Environment variables (suggested)

-----------

- Backend (FastAPI):
  - AUTH0_DOMAIN=your-tenant.us.auth0.com
  - AUTH0_AUDIENCE=<https://tuma.example.com/api>
  - AUTH0_ISSUER=<https://your-tenant.us.auth0.com/>
  - AUTH0_MGMT_CLIENT_ID (optional, for automation)
  - AUTH0_MGMT_CLIENT_SECRET (optional, for automation)

- Frontend (Next.js / SPA):
  - NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.us.auth0.com
  - NEXT_PUBLIC_AUTH0_CLIENT_ID=your-spa-client-id
  - NEXT_PUBLIC_AUTH0_AUDIENCE=<https://tuma.example.com/api>

Quick verification (manual)

-----------

1. From the frontend, sign in and confirm the browser receives an ID token and an access token targeted to `AUTH0_AUDIENCE`.
2. Call the backend protected endpoint `/api/v1/auth/me` with the access token in the Authorization header: `Authorization: Bearer <access_token>`.

- Expected: backend returns user claims (sub, email, name) and accepts the token.

Use Auth0 Dashboard or the Management API to inspect tokens and verify configured scopes/claims.

Acceptance criteria (done)

-----------

- Dev tenant exists and has:
  - API with audience and scopes
  - SPA app with dev callback/logout URLs
  - At least one test user and roles defined
  - Dev env variables recorded in `backend/.env.example` (client IDs, domain, audience)
- Prod tenant/apps configured with production domains and secrets stored in the secrets manager.
- Backend can validate tokens (current approach: `/userinfo` check works; next step: implement JWKS signature verification).
- A short HOWTO in the repo explains how to get a test token and verify `/api/v1/auth/me` locally.

## Notes / next steps

-----------

- Short-term pragmatic approach: verify tokens by calling Auth0 `/userinfo` during initial setup.
- Recommended production improvement: implement JWKS-based JWT verification (cache JWKS keys and validate signatures locally) for better performance and resilience.
- Automate tenant/app creation with Auth0 Management API or Terraform when ready.
