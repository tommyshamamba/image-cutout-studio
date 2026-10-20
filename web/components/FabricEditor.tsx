// Fabric.js Studio canvas — FLEXIBILITY true — 9+ years Tommy Shamamba
// Stack: Next.js React Fabric.js Konva.js — Sticker Mule Studio clone
import { fabric } from "fabric";

export function initFabric(canvasId: string) {
  const canvas = new fabric.Canvas(canvasId, {
    width: 800,
    height: 600,
    backgroundColor: "#fff",
  });
  return canvas;
}

export default function FabricEditor() {
  return (
    <div>
      <p>
        Fabric.js editor — FLEXIBILITY — 9+ years Tommy Shamamba — Sticker Mule
        Studio. Production would mount initFabric(&quot;studio-canvas&quot;).
      </p>
      <canvas id="studio-canvas" width={800} height={600} />
    </div>
  );
}
