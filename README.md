# Image Cutout Studio

[![CI](https://github.com/tommyshamamba/trace-stores-combo/actions/workflows/ci.yml/badge.svg)](https://github.com/tommyshamamba/trace-stores-combo/actions/workflows/ci.yml)

A FastAPI background-removal service with a Next.js front end. Upload an image and get back a
transparent PNG to preview and download.

> Portfolio project, run locally. It claims no production traffic or throughput figures.
> A more complete version with storefront and browser tests lives in
> [SONOFGOD./trace-stores](https://github.com/tommyshamamba/SONOFGOD./tree/main/trace-stores).

## What it does

- `POST /api/remove-bg` accepts a PNG or JPEG of up to 10 MB (`MAX_UPLOAD_BYTES`) and returns JSON with
  the engine used, the dimensions, the processing time and the PNG as base64.
- **Engines:** if the optional `rembg` package is installed, the U²Net model runs through ONNX Runtime.
  Otherwise a dependency-free fallback makes near-white pixels (all channels > `WHITE_THRESHOLD`,
  default 245) transparent. `GET /healthz` reports which engine is active.
- **Errors:** `400` for an empty upload, `413` for an oversized file, `415` for a non-image.
- CORS is limited to `CORS_ORIGINS` (default `http://localhost:3000`).

## Architecture

```
web/ (Next.js 14, client component) ──multipart──► src/trace_api (FastAPI)
                                                       ├─ rembg + ONNX Runtime (optional)
                                                       └─ Pillow white-threshold fallback
```

## Run

```sh
pip install -r requirements.txt                 # add -r requirements-model.txt for U²Net
uvicorn src.trace_api.main:app --reload         # API on :8000
cd web && npm install && npm run dev            # UI on :3000
# or
docker compose up --build
```

## Tests

```sh
pip install -r requirements.txt -r requirements-dev.txt
ruff check . && pytest -q
```

The tests cover transparency output, opaque-pixel preservation, empty, non-image and oversize
uploads, and the health check. CI runs lint, tests, a Docker build and `next build`.

## License

MIT
