
# FastAPI skeleton + JWT verify (task)

Description

- Create FastAPI project skeleton
- Implement middleware or dependency to validate Auth0 JWT via JWKS
- Expose a protected `/api/v1/auth/me` endpoint returning the mapped user

Acceptance criteria

- FastAPI starts locally and validates a test JWT
- `/api/v1/auth/me` returns expected data for a valid token
