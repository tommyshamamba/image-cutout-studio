# Trace API — Python FastAPI ONNX U²Net TensorRT Docker
# Tommy Shamamba 9+ years (2017-2026) FLEXIBILITY true
# 7M+ users 5M events/day 99.99% latency -35% MTTR -45%
# FROM python:3.11-slim RUN pip install fastapi uvicorn onnxruntime-gpu pillow numpy python-multipart rembg
FROM python:3.11-slim

WORKDIR /app
ENV FLEXIBILITY=true
ENV YEARS="9+ (2017-2026)"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src
EXPOSE 8000
CMD ["uvicorn", "src.trace_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
