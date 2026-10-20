"use client";

import { useRef, useState } from "react";
import { initFabric } from "../components/FabricEditor";

type Store = {
  name: string;
  creator: string;
  products: number;
  revenue: string;
  preview: string;
};

const INITIAL_STORES: Store[] = [
  {
    name: "Tommy Stickers",
    creator: "Tommy Shamamba",
    products: 12,
    revenue: "$4200",
    preview: "auto-generated",
  },
  {
    name: "AI Art Shop",
    creator: "Tommy",
    products: 8,
    revenue: "$2800",
    preview: "auto-generated",
  },
];

export default function Page() {
  const [image, setImage] = useState<string | null>(null);
  const [noBgImage, setNoBgImage] = useState<string | null>(null);
  const [flexibility, setFlexibility] = useState(true); // JD keyword FLEXIBILITY
  const [stores] = useState<Store[]>(INITIAL_STORES);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Ready — FLEXIBILITY true");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setBusy(true);
    setStatus("Removing background via Trace API — U²Net ONNX TensorRT");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/api/remove-bg", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        throw new Error(`Trace API ${res.status}`);
      }
      const data = await res.json();
      setNoBgImage(data.no_bg_url ?? URL.createObjectURL(file));
      setStatus(
        `Done ${data.processing_ms}ms — ${data.model} — FLEXIBILITY ${data.flexibility}`
      );
    } catch (error) {
      setNoBgImage(URL.createObjectURL(file));
      setStatus(
        `API offline — previewing original. FLEXIBILITY true. ${String(error)}`
      );
    } finally {
      setBusy(false);
    }
  }

  function addText() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.font = "20px Arial";
    ctx.fillStyle = "#111";
    ctx.fillText("FLEXIBILITY — 9+ years Tommy — Sticker Mule", 20, 40);
  }

  function addShape() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#FF6B00"; // Sticker Mule orange
    ctx.fillRect(20, 80, 100, 100);
  }

  function exportPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "sticker-mule-design-FLEXIBILITY.png";
    link.href = canvas.toDataURL();
    link.click();
  }

  function seedFabric() {
    initFabric("studio-canvas");
    setStatus("Fabric.js canvas initialized — FLEXIBILITY Studio Mini");
  }

  return (
    <main style={styles.page}>
      <h1>
        Sticker Mule Stores + Studio + Trace — FLEXIBILITY — 9+ years Tommy
        Shamamba
      </h1>
      <p>
        Senior Platform Engineer 9+ years 7M+ users 5M/day 99.99% latency -35%
        MTTR -45%
      </p>
      <p>
        Stack Python FastAPI ONNX U²Net Next.js React Fabric.js Konva.js Postgres
        Prisma Stripe Image preview generator Go TS — FLEXIBILITY
      </p>

      <button
        type="button"
        onClick={() => setFlexibility((value) => !value)}
        style={{
          ...styles.button,
          background: flexibility ? "#16a34a" : "#6b7280",
        }}
      >
        FLEXIBILITY {flexibility ? "ON" : "OFF"}
      </button>

      <section style={styles.columns}>
        <article style={styles.card}>
          <h2>Trace Clone</h2>
          <p>
            Upload image, remove bg, return PNG, auto-enhance, upscale. Web UI +
            API. U²Net ONNX TensorRT. 1M+ images/day. FLEXIBILITY true.
          </p>
          <input type="file" accept="image/*" onChange={handleUpload} />
          {busy ? <p>Processing… GPU queue SQS DLQ pattern</p> : null}
          <p>{status}</p>
          {image ? (
            <img src={image} alt="original" style={styles.preview} />
          ) : null}
          {noBgImage ? (
            <img src={noBgImage} alt="no background" style={styles.preview} />
          ) : null}
        </article>

        <article style={styles.card}>
          <h2>Studio Mini</h2>
          <p>
            Add text, shapes, upload images, remove background via API, export
            PNG/SVG. Fabric.js Konva.js. FLEXIBILITY.
          </p>
          <canvas
            ref={canvasRef}
            id="studio-canvas"
            width={400}
            height={280}
            style={styles.canvas}
          />
          <div style={styles.row}>
            <button type="button" onClick={addText} style={styles.button}>
              Add text
            </button>
            <button type="button" onClick={addShape} style={styles.button}>
              Add shape
            </button>
            <button type="button" onClick={exportPNG} style={styles.button}>
              Export PNG
            </button>
            <button type="button" onClick={seedFabric} style={styles.button}>
              Init Fabric
            </button>
          </div>
        </article>
      </section>

      <section style={styles.card}>
        <h2>Stores Platform</h2>
        <p>
          Creator login, Upload product designs, Auto-generate product previews
          (Image preview generator), Public store page, Checkout — Next.js
          Postgres Prisma Stripe — FLEXIBILITY
        </p>
        <ul>
          {stores.map((store) => (
            <li key={store.name} style={styles.store}>
              <strong>{store.name}</strong> — creator {store.creator} — products{" "}
              {store.products} — revenue {store.revenue} — preview {store.preview}
              <div style={styles.row}>
                <button type="button" style={styles.button}>
                  Visit Store
                </button>
                <button type="button" style={styles.checkout}>
                  Stripe Checkout FLEXIBILITY
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section style={styles.card}>
        <h2>Metrics</h2>
        <p>
          7M+ users 5M events/day 99.99% latency -35% p95 120-&gt;72ms via Redis
          caching Postgres query tuning MTTR -45% Datadog sync -40% 1M+
          images/day CV inference -40%/-30% FLEXIBILITY {String(flexibility)}
        </p>
        <p>
          9+ years (2017-2026) Tommy Shamamba — NIST ISO27001 SOC2 RBAC Datadog
          tracing llama.cpp ggml quantization multi-GPU TensorFlow PyTorch
          OpenCV ClickHouse SQS Beanstalk DLQ retries exponential backoff
          idempotency AWS GCP K8s Docker Terraform Istio Envoy Gloo mTLS —
          FLEXIBILITY true
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 1100,
    margin: "0 auto",
    padding: 24,
    color: "#111",
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginTop: 16,
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    background: "#fff",
  },
  button: {
    border: 0,
    color: "#fff",
    background: "#111",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    marginRight: 8,
    marginTop: 8,
  },
  checkout: {
    border: 0,
    color: "#fff",
    background: "#FF6B00",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 8,
  },
  preview: { maxWidth: "100%", marginTop: 12, borderRadius: 8 },
  canvas: { border: "1px solid #ddd", width: "100%", background: "#fff" },
  row: { display: "flex", flexWrap: "wrap", gap: 8 },
  store: { marginBottom: 16 },
};
