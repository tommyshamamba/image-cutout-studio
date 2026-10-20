"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Result = { engine: string; width: number; height: number; processing_ms: number; png_base64: string };

export default function Page() {
  const [original, setOriginal] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [status, setStatus] = useState("Choose an image to start.");

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setOriginal(URL.createObjectURL(file));
    setResult(null);
    setStatus("Processing...");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${API}/api/remove-bg`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? `HTTP ${res.status}`);
      setResult(data);
      setStatus(`Done in ${data.processing_ms} ms using ${data.engine}.`);
    } catch (err) {
      setStatus(`Could not process image: ${String(err)}`);
    }
  }

  const cutout = result ? `data:image/png;base64,${result.png_base64}` : null;
  const checker = "repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 16px 16px";

  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Image Cutout Studio</h1>
      <p>Upload a PNG or JPEG. The API returns the same image with its background removed.</p>
      <input type="file" accept="image/png,image/jpeg" onChange={handleUpload} />
      <p role="status">{status}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {original && <figure><img src={original} alt="Original" style={{ maxWidth: "100%" }} /><figcaption>Original</figcaption></figure>}
        {cutout && (
          <figure>
            <img src={cutout} alt="Cutout" style={{ maxWidth: "100%", background: checker }} />
            <figcaption>
              Cutout ({result!.width}×{result!.height}) · <a href={cutout} download="cutout.png">Download PNG</a>
            </figcaption>
          </figure>
        )}
      </div>
    </main>
  );
}
