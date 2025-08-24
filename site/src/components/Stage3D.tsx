"use client";

import { useEffect, useRef } from "react";

/**
 * Stage3D
 * - sticky viewport con perspective
 * - 8 layer (hero, v1, t1, v2, t2, v3, t3, final)
 * - ogni layer ha una "window" di attivazione (start..end in 0..1)
 * - JavaScript calcola translateZ/opacity per un look fedele al CodePen #1
 */
export type StageItem = {
  id: string;
  node: React.ReactNode;
  range: [number, number]; // 0..1
};

export default function Stage3D({ items }: { items: StageItem[] }) {
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;

      items.forEach((it, idx) => {
        const layer = layersRef.current[idx];
        if (!layer) return;
        const [s, e] = it.range;
        // progress locale
        const t = (p - s) / (e - s);
        const clamped = Math.max(0, Math.min(1, t));

        // mappatura fedele a Pen: da -1000px → +1000px su Z
        const z = -1000 + clamped * 2000; // [-1000..+1000]
        // opacità: dinamica, solo in finestra
        const fade = clamped <= 0 ? 0 : clamped >= 1 ? 0 : 1 - Math.abs(0.5 - clamped) * 2;

        layer.style.transform = `translateZ(${z}px)`;
        layer.style.opacity = (fade * 1).toFixed(3);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <section className="scene" aria-label="Scroll 3D">
      <div className="scene-spacer" />
      <div ref={stickyRef} className="scene-sticky">
        <div className="scene-layers">
          {items.map((it, idx) => (
            <div
              key={it.id}
              className="layer"
              ref={(el) => (layersRef.current[idx] = el)}
            >
              <div className="layer-inner">{it.node}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
