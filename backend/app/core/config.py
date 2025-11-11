from pydantic import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "TumaTask Backend"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str | None = None
    REDIS_URL: str | None = None
    AUTH0_DOMAIN: str | None = None
    AUTH0_AUDIENCE: str | None = None
    AUTH0_ISSUER: str | None = None
    # verify mode: 'jwks' (default) or 'userinfo' for dev/fallback
    AUTH0_VERIFY_MODE: str = "jwks"

    class Config:
        env_file = ".env"


settings = Settings()
