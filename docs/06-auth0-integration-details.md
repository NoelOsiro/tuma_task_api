# 6. Auth0 integration details

- App types: Single Page App (Next.js), Native (mobile later), Machine-to-Machine (backend).
- Use `@auth0/nextjs-auth0` for Next.js session handling; for API calls include the `Authorization: Bearer <access_token>` header.
- On registration/login:
  - Auth0 issues JWT access token containing `sub` (auth0 id) and a custom claim (e.g., `https://tumatask.com/roles`) for role(s).
  - On first login, backend checks if `auth0_id` exists in `users` table — create `User` row with default role `poster` (or depending on signup flow).
- FastAPI: validate JWT via JWKS (cache JWKs), check `audience` and `issuer`. Cache JWKs to avoid network overhead.

## FastAPI verify example (summary)

- Use `python-jose` to decode & verify token.
- Extract `sub` → map to internal user.
