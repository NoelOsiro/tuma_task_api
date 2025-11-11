import sys
import types
import importlib
import pytest

from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

# Create a lightweight fake config module before importing the application modules.
# This avoids importing pydantic BaseSettings in tests where the installed pydantic
# version may differ from the project's expectations.
config_mod = types.ModuleType("app.core.config")
config_mod.settings = types.SimpleNamespace(
    AUTH0_DOMAIN="test-domain",
    AUTH0_AUDIENCE="https://tuma.example.com/api",
    AUTH0_VERIFY_MODE="jwks",
    AUTH0_ISSUER=None,
)
sys.modules["app.core.config"] = config_mod

security_mod = importlib.import_module("app.core.security")


class DummyCreds(HTTPAuthorizationCredentials):
    def __init__(self, token: str = "dummy"):
        super().__init__(scheme="Bearer", credentials=token)


@pytest.mark.asyncio
async def test_get_current_user_valid(monkeypatch):
    # Arrange: mock JWKS fetch and jwt.get_unverified_header and jwt.decode
    async def fake_fetch_jwks():
        return {"keys": [{"kid": "testkid"}]}

    monkeypatch.setattr(security_mod, "_fetch_jwks", fake_fetch_jwks)
    monkeypatch.setattr(
        security_mod.jwt, "get_unverified_header", lambda token: {"kid": "testkid"}
    )
    monkeypatch.setattr(
        security_mod.jwt,
        "decode",
        lambda token, key, algorithms, audience, issuer: {
            "sub": "auth0|123",
            "email": "me@example.com",
        },
    )

    creds = DummyCreds("valid-token")

    # Act
    payload = await security_mod.get_current_user(creds)

    # Assert
    assert payload["sub"] == "auth0|123"
    assert payload["email"] == "me@example.com"


@pytest.mark.asyncio
async def test_get_current_user_invalid_header(monkeypatch):
    # Arrange: jwt.get_unverified_header raises JWTError
    from jose import JWTError

    async def fake_fetch_jwks():
        return {"keys": [{"kid": "testkid"}]}

    monkeypatch.setattr(security_mod, "_fetch_jwks", fake_fetch_jwks)

    def raise_err(token):
        raise JWTError("bad header")

    monkeypatch.setattr(security_mod.jwt, "get_unverified_header", raise_err)

    creds = DummyCreds("bad-token")

    # Act / Assert
    with pytest.raises(HTTPException) as excinfo:
        await security_mod.get_current_user(creds)

    assert excinfo.value.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user_with_real_jwt(monkeypatch):
    # This test generates a real RSA keypair, builds a JWKS with the public key and
    # signs a real RS256 token with the private key. The security module will fetch
    # the JWKS (mocked) and validate the token end-to-end.
    pytest.importorskip("cryptography")

    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.hazmat.primitives import serialization
    import base64

    # generate RSA keypair
    priv = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    priv_pem = priv.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode()

    pub = priv.public_key()
    nums = pub.public_numbers()
    n = nums.n
    e = nums.e

    def _b64u(data: bytes) -> str:
        return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")

    n_b = n.to_bytes((n.bit_length() + 7) // 8, "big")
    e_b = e.to_bytes((e.bit_length() + 7) // 8, "big")

    kid = "test-kid-real"
    jwks = {
        "keys": [
            {
                "kty": "RSA",
                "kid": kid,
                "use": "sig",
                "n": _b64u(n_b),
                "e": _b64u(e_b),
                "alg": "RS256",
            }
        ]
    }

    # create a token with required claims
    issuer = f"https://{security_mod.__dict__.get('settings').AUTH0_DOMAIN}/"
    audience = security_mod.__dict__.get("settings").AUTH0_AUDIENCE
    import time

    claims = {
        "sub": "auth0|real",
        "iss": issuer,
        "aud": audience,
        "exp": int(time.time()) + 300,
    }

    token = security_mod.jwt.encode(
        claims, priv_pem, algorithm="RS256", headers={"kid": kid}
    )

    async def fake_fetch_jwks():
        return jwks

    monkeypatch.setattr(security_mod, "_fetch_jwks", fake_fetch_jwks)

    creds = DummyCreds(token)

    payload = await security_mod.get_current_user(creds)

    assert payload.get("sub") == "auth0|real"
    assert payload.get("iss") == issuer


@pytest.mark.asyncio
async def test_get_current_user_decode_error(monkeypatch):
    # Arrange: valid header but decode raises JWTError
    from jose import JWTError

    async def fake_fetch_jwks():
        return {"keys": [{"kid": "testkid"}]}

    monkeypatch.setattr(security_mod, "_fetch_jwks", fake_fetch_jwks)
    monkeypatch.setattr(
        security_mod.jwt, "get_unverified_header", lambda token: {"kid": "testkid"}
    )

    def raise_err(token, key, algorithms, audience, issuer):
        raise JWTError("invalid token")

    monkeypatch.setattr(security_mod.jwt, "decode", raise_err)

    creds = DummyCreds("invalid-token")

    with pytest.raises(HTTPException) as excinfo:
        await security_mod.get_current_user(creds)

    assert excinfo.value.status_code == 401
