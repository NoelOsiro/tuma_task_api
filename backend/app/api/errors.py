from fastapi import Request
from fastapi.responses import JSONResponse


async def http_error_handler(request: Request, exc):
    return JSONResponse({"detail": str(exc)}, status_code=getattr(exc, "status_code", 500))
