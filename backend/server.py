from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import httpx
import os

app = FastAPI()

NEXTJS_URL = "http://localhost:3000"

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy(request: Request, path: str):
    """Proxy all API requests to the Next.js server."""
    target_url = f"{NEXTJS_URL}/api/{path}"
    
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("Host", None)
    
    body = await request.body()
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body,
            params=dict(request.query_params),
        )
    
    return StreamingResponse(
        iter([response.content]),
        status_code=response.status_code,
        headers=dict(response.headers),
    )
