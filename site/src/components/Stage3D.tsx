"use client";

import { useEffect, useRef } from "react";

/**
 * Stage3D
 * - Sezione sticky con perspective.
 * - Avanzamento calcolato LOCALMENTE alla sezione (0..1).
 * - 8 layer (o quanti vuoi) con finestre [start, end] in 0..1.
 * - Z da -1000 → +1000, opacità a campana dentro la finestra.
 */
export type StageItem = {
  id: string;
  node: React.ReactNode;
  range: [number, number]; // 0..1, start < end
};

export default function Stage3D({ items }: { items: StageItem[] }) {
  const sceneRef = useRef<HTMLElement | null>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      const scene = sceneRef.current;
      if (!scene) return;

      const vh = window.innerHeight;
      const rect = scene.getBoundingClientRect();
      // Altezza “scrollabile” della scena: sticky (100vh) + spacer - viewport = spacer
      // ma in generale prendiamo altezza totale - vh per sicurezza
      const sceneHeight = Math.max(1, scene.offsetHeight - vh);

      // Progress locale: 0 quando il top della scena tocca il top viewport,
      // 1 quando il bottom della scena tocca il bottom viewport.
      let local = 0;
      if (rect.top >= 0) {
        local = 0;
      } else if (rect.bottom <= vh) {
        local = 1;
      } else {
        // rect.top va da 0 a -sceneHeight
        local = Math.min(1, Math.max(0, -rect.top / sceneHeight));
      }

      items.forEach((it, idx) => {
        const layer = layersRef.current[idx];
        if (!layer) return;

        const [s, e] = it.range;
        const width = Math.max(1e-6, e - s);
        const t = (local - s) / width; // progress finestra
        const clamped = Math.max(0, Math.min(1, t));

        // Mappatura Z: [-1000 .. +1000]
        const z = -1000 + clamped * 2000;

        // Opacità a “campana” dentro la finestra (0→1→0)
        let fade = 0;
        if (local >= s && local <= e) {
          fade = 1 - Math.abs(0.5 - clamped) * 2;
        } else {
          fade = 0;
        }

        layer.style.transform = `translateZ(${z}px)`;
        layer.style.opacity = fade.toFixed(3);
      });
    };

    const onResize = () => onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // inizializza
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [items]);

  return (
    <section ref={sceneRef} className="scene" aria-label="Scroll 3D">
      {/* Sticky PRIMA */}
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

      {/* Spacer DOPO: determina quanto si “viaggia” nella scena */}
      <div className="scene-spacer" />
    </section>
  );
}
