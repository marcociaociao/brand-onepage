"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScrubVideo (center-start, scroll-locked)
 * - La finestra globale dell'item è [start, end] in 0..1 (progresso documento).
 * - Il video resta fermo finché non attraversi il "centro" della finestra.
 * - Da (centro - deadzone) fino a end, lo scroll mappa linearmente 0..dur.
 * - Se risali, va indietro; se torni prima del centro-deadzone, torna a 0.
 */
export default function ScrubVideo({
  src,
  poster,
  start = 0,
  end = 1,
  centerStart = true,
  centerDeadzone = 0.05, // ±5% della finestra
}: {
  src: string;
  poster?: string;
  start?: number;        // 0..1
  end?: number;          // 0..1
  centerStart?: boolean; // true = parte al centro
  centerDeadzone?: number; // 0..0.2 circa
}) {
  const vref = useRef<HTMLVideoElement | null>(null);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const v = vref.current;
      if (!v || dur <= 0) return;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0; // 0..1 globale

      // Fuori finestra → clamp (0 o dur)
      if (p <= start) { v.currentTime = 0; return; }
      if (p >= end)   { v.currentTime = dur; return; }

      // Start effettivo: centro - deadzone (se centerStart) oppure start
      const mid = start + (end - start) * (centerStart ? 0.5 : 0.0);
      const sEff = centerStart ? Math.max(start, mid - (end - start) * centerDeadzone) : start;

      if (p <= sEff) {
        v.currentTime = 0; // fermo fino al centro (con deadzone)
        return;
      }

      // Mappo linearmente sEff..end -> 0..dur
      const local = (p - sEff) / (end - sEff); // 0..1
      v.currentTime = local * dur;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [start, end, dur, centerStart, centerDeadzone]);

  return (
    <div className="video-frame">
      <video
        ref={vref}
        className="w-full h-full object-cover"
        src={src}
        poster={poster}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={() => {
          if (vref.current) setDur(vref.current.duration || 0);
        }}
      />
      {!src && <span className="video-label">Video Placeholder</span>}
    </div>
  );
}
