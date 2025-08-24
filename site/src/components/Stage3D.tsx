"use client";

import { useEffect, useRef } from "react";

/**
 * Stage3D (transizione continua)
 * - progresso locale alla sezione (0..1)
 * - per item: Z da -1000→+1000 su tutta la finestra [start,end]
 * - opacità a “campana” (entra→pieno→esce), nessun plateau/blocco
 */
export type StageItem = {
  id: string;
  node: React.ReactNode;
  range: [number, number]; // 0..1, start<end
};

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export default function Stage3D({ items }: { items: StageItem[] }) {
  const sceneRef = useRef<HTMLElement | null>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      const scene = sceneRef.current;
      if (!scene) return;

      const vh = window.innerHeight;
      const rect = scene.getBoundingClientRect();
      const sceneHeight = Math.max(1, scene.offsetHeight - vh);

      let local = 0;
      if (rect.top >= 0) local = 0;
      else if (rect.bottom <= vh) local = 1;
      else local = clamp01(-rect.top / sceneHeight);

      items.forEach((it, idx) => {
        const layer = layersRef.current[idx];
        if (!layer) return;

        const [s, e] = it.range;
        const w = Math.max(1e-6, e - s);
        const t = clamp01((local - s) / w);        // 0..1 nella finestra
        const z = -1000 + t * 2000;                // -1000 → +1000
        const fade = 1 - Math.abs(0.5 - t) * 2;    // campana (0→1→0)

        layer.style.transform = `translateZ(${z}px)`;
        layer.style.opacity = fade.toFixed(3);
      });
    };

    const onResize = () => onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [items]);

  return (
    <section ref={sceneRef} className="scene" aria-label="Scroll 3D">
      {/* Sticky prima */}
      <div className="scene-sticky">
        <div className="scene-layers">
          {items.map((it, idx) => (
            <div
              key={it.id}
              id={it.id}
              className="layer"
              ref={(el) => (layersRef.current[idx] = el)}
            >
              <div className="layer-inner">{it.node}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Spacer dopo: determina “quanto” si viaggia */}
      <div className="scene-spacer" />
    </section>
  );
}
