from fastapi import FastAPI, Request
from fastapi.responses import Response
import httpx

app = FastAPI()

NEXTJS_URL = "http://localhost:3000"

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy(request: Request, path: str):
    """Proxy all requests to the Next.js server.
    Ingress sends /api/* to port 8001, so path already includes 'api/...'
    We forward as-is to Next.js which has routes at /api/admin/...
    """
    # The path already includes 'api/' prefix from ingress routing
    target_url = f"{NEXTJS_URL}/{path}"
    
    # Rebuild query string
    query_string = str(request.url.query) if request.url.query else ""
    if query_string:
        target_url = f"{target_url}?{query_string}"
    
    headers = {}
    for key, value in request.headers.items():
        lower = key.lower()
        if lower not in ("host", "transfer-encoding"):
            headers[key] = value
    
    body = await request.body()
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body,
        )
    
    # Filter out hop-by-hop headers
    excluded_headers = {"transfer-encoding", "content-encoding", "connection"}
    resp_headers = {
        k: v for k, v in response.headers.items()
        if k.lower() not in excluded_headers
    }
    
    return Response(
        content=response.content,
        status_code=response.status_code,
        headers=resp_headers,
    )
