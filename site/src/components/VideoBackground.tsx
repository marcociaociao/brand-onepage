"use client";
import { useEffect, useRef } from "react";
type Props = { src: string; poster: string; className?: string; };

export default function VideoBackground({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.preload = "none"; el.muted = true; el.loop = true; el.playsInline = true;

    const prefersReduced = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { el.pause(); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) el.play().catch(()=>{}); else el.pause(); });
    }, { threshold: 0.25 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <video ref={ref} className={className} poster={poster} playsInline muted loop controls={false} preload="none" aria-hidden="true" tabIndex={-1}>
      <source src={src} type="video/mp4" />
    </video>
  );
}
