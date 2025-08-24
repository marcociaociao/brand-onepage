"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  brand?: string;
  glowSeconds?: number; // durata accensione globale dopo hover/tap
};

export default function HeroGlow({
  brand = "HAZEIN THE BUILDING",
  glowSeconds = 2.6
}: Props) {
  const wrapRef = useRef<HTMLHeadingElement | null>(null);
  const [lit, setLit] = useState(false);
  const baseGlowRef = useRef(0); // 0..1, decresce dopo hover/tap
  const decayId = useRef<number | null>(null);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const chars = useMemo(() => Array.from(brand), [brand]);

  useEffect(() => () => {
    if (decayId.current) cancelAnimationFrame(decayId.current);
  }, []);

  function ignite() {
    setLit(true);
    baseGlowRef.current = prefersReduced ? 0.45 : 0.9;
    const started = performance.now();
    const dur = glowSeconds * 1000;

    const step = (now: number) => {
      const t = Math.min(1, (now - started) / dur);
      // curva di decadimento dolce
      const g = (1 - t) ** 1.8 * (prefersReduced ? 0.45 : 0.9);
      baseGlowRef.current = g;
      applyGlow(); // aggiorna le lettere anche senza muovere il mouse
      if (t < 1) {
        decayId.current = requestAnimationFrame(step);
      } else {
        setLit(false);
      }
    };
    decayId.current = requestAnimationFrame(step);
  }

  function applyGlow(e?: React.PointerEvent) {
    const root = wrapRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const mx = e ? e.clientX - rect.left : rect.width / 2;
    const my = e ? e.clientY - rect.top : rect.height / 2;

    // raggio di influenza per-lettera
    const radius = Math.max(120, Math.min(rect.width, rect.height) * 0.35);

    root.querySelectorAll<HTMLElement>(".glyph").forEach((el) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - rect.left;
      const cy = r.top + r.height / 2 - rect.top;
      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.hypot(dx, dy);

      // intensità da mouse (gaussiana) + baseGlow (decadimento)
      const mouseGlow = Math.exp(-(dist * dist) / (2 * radius * radius));
      const g = Math.max(0, Math.min(1, mouseGlow + baseGlowRef.current));

      el.style.setProperty("--g", g.toFixed(3));
      el.style.setProperty("--mx", `${mx}px`);
      el.style.setProperty("--my", `${my}px`);
    });
  }

  return (
    <section className="hero-wrap page-grad" aria-label="Hero brand">
      <h1
        ref={wrapRef}
        className={`hero-title ${lit ? "lit" : ""}`}
        onPointerMove={applyGlow}
        onPointerEnter={(e) => {
          ignite();
          applyGlow(e);
        }}
        onPointerDown={(e) => {
          ignite();
          applyGlow(e);
        }}
      >
        {chars.map((ch, i) => (
          <span
            key={i}
            className="glyph"
            data-ch={ch === " " ? "\u00A0" : ch}
            aria-hidden="true"
          >
            {ch}
          </span>
        ))}
      </h1>
    </section>
  );
}
