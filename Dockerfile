FROM python:3.12-slim
ARG WITH_MODEL=false
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt requirements-model.txt ./
RUN pip install --no-cache-dir -r requirements.txt \
 && if [ "$WITH_MODEL" = "true" ]; then pip install --no-cache-dir -r requirements-model.txt; fi
COPY src ./src
RUN useradd --create-home app
USER app
EXPOSE 8000
CMD ["uvicorn", "src.trace_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
