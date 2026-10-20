import base64
import io

from fastapi.testclient import TestClient
from PIL import Image

from src.trace_api import main

main.rembg_remove = None  # exercise the dependency-free path
client = TestClient(main.app)


def png(color, size=(4, 4)):
    buf = io.BytesIO()
    Image.new("RGB", size, color).save(buf, format="PNG")
    return buf.getvalue()


def test_white_becomes_transparent():
    res = client.post("/api/remove-bg", files={"file": ("a.png", png((255, 255, 255)), "image/png")})
    assert res.status_code == 200
    body = res.json()
    out = Image.open(io.BytesIO(base64.b64decode(body["png_base64"])))
    assert body["engine"] == "white-threshold"
    assert out.mode == "RGBA" and out.getpixel((0, 0))[3] == 0


def test_colored_pixels_stay_opaque():
    res = client.post("/api/remove-bg", files={"file": ("a.png", png((200, 10, 10)), "image/png")})
    out = Image.open(io.BytesIO(base64.b64decode(res.json()["png_base64"])))
    assert out.getpixel((1, 1))[3] == 255


def test_rejects_empty_and_non_image():
    assert client.post("/api/remove-bg", files={"file": ("a.png", b"", "image/png")}).status_code == 400
    assert client.post("/api/remove-bg", files={"file": ("a.txt", b"hello", "text/plain")}).status_code == 415


def test_rejects_oversize(monkeypatch):
    monkeypatch.setattr(main, "MAX_BYTES", 10)
    assert client.post("/api/remove-bg", files={"file": ("a.png", png((1, 2, 3)), "image/png")}).status_code == 413


def test_health():
    assert client.get("/healthz").json()["status"] == "ok"
