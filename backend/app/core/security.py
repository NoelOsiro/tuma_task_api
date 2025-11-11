from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException, status
import httpx

from app.core.config import settings

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Validate the access token using Auth0's /userinfo endpoint and return user info.

    This approach calls Auth0 to validate the token and returns the user profile claims.
    It's a pragmatic alternative to full JWKS signature validation for initial integration.
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

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
        raise HTTPException(status_code=500, detail="Failed to parse userinfo response")

    # Map or normalize claims as needed here; return the raw claims for now
    return userinfo
