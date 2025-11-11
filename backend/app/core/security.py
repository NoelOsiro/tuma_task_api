"""Auth helpers for validating Auth0-issued JWTs using JWKS or Auth0 /userinfo."""

from __future__ import annotations

import time
from typing import Any

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.core.config import settings

security = HTTPBearer()

# Simple in-memory cache for JWKS (TTL in seconds)
_JWKS_CACHE: dict | None = None
_JWKS_FETCHED_AT: float | None = None
_JWKS_TTL = 60 * 60  # 1 hour


async def _fetch_jwks() -> dict:
    """Fetch JWKS from Auth0 and cache it for a short period."""
    global _JWKS_CACHE, _JWKS_FETCHED_AT

    now = time.time()
    if _JWKS_CACHE and _JWKS_FETCHED_AT and now - _JWKS_FETCHED_AT < _JWKS_TTL:
        return _JWKS_CACHE

    if not settings.AUTH0_DOMAIN:
        raise HTTPException(status_code=500, detail="Auth0 domain not configured")

    url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)

    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch JWKS from Auth0")

    jwks = resp.json()
    _JWKS_CACHE = jwks
    _JWKS_FETCHED_AT = now
    return jwks


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict[str, Any]:
    """Validate and decode a JWT using either JWKS or Auth0 /userinfo depending on config.

    Mode selection is controlled by `settings.AUTH0_VERIFY_MODE` which can be:
      - 'jwks' (default) — verify signature locally using JWKS
      - 'userinfo'        — call Auth0 /userinfo to validate token
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

    verify_mode = getattr(settings, "AUTH0_VERIFY_MODE", "jwks")

    if verify_mode == "userinfo":
        # Pragmatic flow: validate token by calling Auth0 /userinfo endpoint
        if not settings.AUTH0_DOMAIN:
            raise HTTPException(status_code=500, detail="Auth0 domain not configured")

        url = f"https://{settings.AUTH0_DOMAIN}/userinfo"
        headers = {"Authorization": f"Bearer {token}"}

        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url, headers=headers)

        if resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        try:
            userinfo = resp.json()
        except Exception:
            raise HTTPException(
                status_code=500, detail="Failed to parse userinfo response"
            )

        return userinfo

    # Default: JWKS verification
    if not settings.AUTH0_AUDIENCE:
        raise HTTPException(status_code=500, detail="Auth0 audience not configured")

    jwks = await _fetch_jwks()

    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token header"
        )

    kid = unverified_header.get("kid")
    if not kid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing kid header"
        )

    rsa_key = {}
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            rsa_key = {
                "kty": key.get("kty"),
                "kid": key.get("kid"),
                "use": key.get("use"),
                "n": key.get("n"),
                "e": key.get("e"),
            }
            break

    if not rsa_key:
        # Try refreshing JWKS one more time in case of rotation
        jwks = await _fetch_jwks()
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                rsa_key = {
                    "kty": key.get("kty"),
                    "kid": key.get("kid"),
                    "use": key.get("use"),
                    "n": key.get("n"),
                    "e": key.get("e"),
                }
                break

    if not rsa_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Appropriate JWKS key not found",
        )

    issuer = settings.AUTH0_ISSUER or f"https://{settings.AUTH0_DOMAIN}/"
    try:
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=settings.AUTH0_AUDIENCE,
            issuer=issuer,
        )
    except JWTError as e:
        # More specific error handling (expired, invalid claims) could be added here
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation error: {str(e)}",
        )

    # Return the validated claims; services can map these to internal user models
    return payload
