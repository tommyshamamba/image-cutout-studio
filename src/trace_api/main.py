"""Background-removal API.

Accepts an image upload and returns a transparent PNG. When the optional ``rembg``
package is installed it runs the U²Net model through ONNX Runtime. Otherwise a simple
fallback makes near-white pixels transparent, so the service still works without the
model download.
"""

from __future__ import annotations

import base64
import io
import logging
import os
import time
import uuid

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel

try:  # optional heavy dependency
    from rembg import remove as rembg_remove
except Exception:  # pragma: no cover - depends on environment
    rembg_remove = None

log = logging.getLogger("trace_api")
MAX_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", str(10 * 1024 * 1024)))
WHITE_THRESHOLD = int(os.getenv("WHITE_THRESHOLD", "245"))

app = FastAPI(title="Background-removal API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class CutoutResult(BaseModel):
    id: str
    engine: str
    width: int
    height: int
    processing_ms: float
    png_base64: str


def white_to_alpha(image: Image.Image, threshold: int = WHITE_THRESHOLD) -> Image.Image:
    """Return a copy where pixels brighter than threshold on all channels are transparent."""
    rgba = image.convert("RGBA")
    data = [
        (r, g, b, 0) if r > threshold and g > threshold and b > threshold else (r, g, b, a)
        for (r, g, b, a) in rgba.getdata()
    ]
    rgba.putdata(data)
    return rgba


def remove_background(raw: bytes) -> tuple[Image.Image, str]:
    if rembg_remove is not None:
        out = rembg_remove(raw)
        return Image.open(io.BytesIO(out)).convert("RGBA"), "rembg-u2net"
    return white_to_alpha(Image.open(io.BytesIO(raw))), "white-threshold"


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "engine": "rembg-u2net" if rembg_remove else "white-threshold"}


@app.post("/api/remove-bg", response_model=CutoutResult)
async def remove_bg(file: UploadFile = File(...)) -> CutoutResult:
    raw = await file.read(MAX_BYTES + 1)
    if not raw:
        raise HTTPException(status_code=400, detail="empty upload")
    if len(raw) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="file too large")
    started = time.perf_counter()
    try:
        image, engine = remove_background(raw)
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=415, detail="not a supported image") from exc
    buf = io.BytesIO()
    image.save(buf, format="PNG")
    ms = round((time.perf_counter() - started) * 1000, 2)
    job_id = str(uuid.uuid4())
    log.info("cutout id=%s engine=%s ms=%s", job_id, engine, ms)
    return CutoutResult(id=job_id, engine=engine, width=image.width, height=image.height,
                        processing_ms=ms, png_base64=base64.b64encode(buf.getvalue()).decode())
