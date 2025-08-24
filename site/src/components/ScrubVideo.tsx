"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScrubVideo
 * - mappa lo scroll documento 0..1 dentro [start,end] → currentTime (0..dur)
 * - fuori finestra: clamp al primo/ultimo frame
 * - nessun plateau: tutta la finestra è “tempo del video”
 */
export default function ScrubVideo({
  src,
  poster,
  start = 0,
  end = 1
}: {
  src: string;
  poster?: string;
  start?: number;
  end?: number;
}) {
  const vref = useRef<HTMLVideoElement | null>(null);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const v = vref.current;
      if (!v || dur <= 0) return;

      if (p <= start) { v.currentTime = 0; return; }
      if (p >= end)   { v.currentTime = dur; return; }

      const local = (p - start) / (end - start); // 0..1 finestra
      v.currentTime = local * dur;
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
        onLoadedMetadata={() => { if (vref.current) setDur(vref.current.duration || 0); }}
      />
      {!src && <span className="video-label">Video Placeholder</span>}
    </div>
  );
}
