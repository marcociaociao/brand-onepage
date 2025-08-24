"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScrubVideo: mappa lo scroll globale (0..1) dentro una finestra [start,end]
 * al currentTime del video. Quando lo scroll non cambia, il video è fermo.
 * L'elemento video resta "immobile" (contenitore sticky).
 */
export default function ScrubVideo({
  src,
  poster,
  start = 0.125,
  end = 0.25
}: {
  src: string;
  poster: string;
  start?: number; // 0..1 in scroll totale
  end?: number;   // 0..1
}) {
  const vref = useRef<HTMLVideoElement | null>(null);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (!vref.current || dur <= 0) return;

      // progress locale della finestra
      const local = (p - start) / (end - start);
      const clamped = Math.max(0, Math.min(1, local));
      const t = clamped * dur;

      if (local >= 0 && local <= 1) {
        try {
          vref.current.currentTime = t;
        } catch {}
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [start, end, dur]);

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
