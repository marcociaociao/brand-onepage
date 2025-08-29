"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScrubVideo — scroll-time su <video> in plateau [activeStart, activeEnd] (0..1 scena).
 * - Prime automatico (play→pause) al primo ingresso nel plateau
 * - Seek affidabile: currentTime → attesa di frame (RVFC o 'seeked')
 * - Freeze ultimo frame fuori dal plateau
 */

type RVFC = ((
  cb: (now: number, meta: VideoFrameCallbackMetadata) => void
) => number) | undefined;

export default function ScrubVideo({
  src,
  poster,
  activeStart,
  activeEnd,
  freezeOutside = true,
  debug = true,
}: {
  src: string;
  poster?: string;
  activeStart: number;
  activeEnd: number;
  freezeOutside?: boolean;
  debug?: boolean;
}) {
  const vref = useRef<HTMLVideoElement | null>(null);

  const [ready, setReady] = useState(false);
  const [dur, setDur] = useState(0);
  const [sceneP, setSceneP] = useState(0);
  const [cur, setCur] = useState(0);

  const rafRef = useRef(0);
  const rvfcIdRef = useRef(0);
  const seekingRef = useRef(false);
  const primedRef = useRef(false);
  const enteredRef = useRef(false);
  const lastTargetRef = useRef(0);

  const s0 = Math.min(activeStart, activeEnd);
  const s1 = Math.max(activeStart, activeEnd);

  const getSceneProgress = () => {
    const el = vref.current;
    if (!el) return 0;
    const scene = el.closest(".scene") as HTMLElement | null;
    if (!scene) return 0;

    const vh = window.innerHeight;
    const rect = scene.getBoundingClientRect();
    const scrollable = Math.max(1, scene.offsetHeight - vh);

    if (rect.top >= 0) return 0;
    if (rect.bottom <= vh) return 1;
    return Math.max(0, Math.min(1, -rect.top / scrollable));
  };

  const primeVideo = async (v: HTMLVideoElement) => {
    if (primedRef.current) return;
    try {
      v.muted = true;
      await v.play();
      await v.pause();
      primedRef.current = true;
    } catch {
      // Se fallisce per qualsiasi motivo, proseguiamo: i seek funzioneranno comunque.
    }
  };

  const seekTo = (v: HTMLVideoElement, t: number) => {
    // Evita di martellare lo stesso target
    if (Math.abs(t - lastTargetRef.current) < 0.0005) return;
    lastTargetRef.current = t;
    seekingRef.current = true;
    v.currentTime = t;

    const rvfc = (v as any).requestVideoFrameCallback as RVFC;
    if (rvfc) {
      if (rvfcIdRef.current) (v as any).cancelVideoFrameCallback?.(rvfcIdRef.current);
      rvfcIdRef.current = rvfc(() => {
        seekingRef.current = false;
        setCur(v.currentTime);
      });
    } else {
      const onSeeked = () => {
        v.removeEventListener("seeked", onSeeked);
        seekingRef.current = false;
        setCur(v.currentTime);
      };
      v.addEventListener("seeked", onSeeked, { once: true });
    }
  };

  const loop = () => {
    const v = vref.current;
    if (v) {
      const p = getSceneProgress();
      setSceneP(p);

      const d = dur || v.duration || 0;
      if (ready && d > 0) {
        if (p <= s0) {
          const t = enteredRef.current && freezeOutside ? lastTargetRef.current : 0.001;
          if (!seekingRef.current) seekTo(v, t);
        } else if (p >= s1) {
          const t = Math.max(0.001, d);
          if (!seekingRef.current) seekTo(v, t);
          enteredRef.current = true;
        } else {
          // dentro plateau → mappa lineare
          const t01 = (p - s0) / (s1 - s0);
          const t = Math.max(0.001, t01 * d);
          // prime al primo ingresso
          if (!primedRef.current) primeVideo(v);
          if (!seekingRef.current) seekTo(v, t);
          enteredRef.current = true;
        }
      }
    }

    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const v = vref.current;

    const onLoadedMetadata = () => {
      if (!v) return;
      if (v.duration > 0) setDur(v.duration);
      if (v.readyState >= 2) setReady(true);
    };
    const onCanPlay = () => {
      if (!v) return;
      if (v.duration > 0) setDur(v.duration);
      setReady(true);
    };

    if (v) {
      v.preload = "auto";
      v.muted = true;
      v.playsInline = true;
      v.pause();
      if (v.readyState >= 2 && v.duration > 0) onCanPlay();
      else if (v.readyState >= 1 && v.duration > 0) onLoadedMetadata();

      v.addEventListener("loadedmetadata", onLoadedMetadata);
      v.addEventListener("canplay", onCanPlay);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (v) {
        v.removeEventListener("loadedmetadata", onLoadedMetadata);
        v.removeEventListener("canplay", onCanPlay);
        const rvfc = (v as any).requestVideoFrameCallback as RVFC;
        if (rvfc && rvfcIdRef.current) {
          (v as any).cancelVideoFrameCallback?.(rvfcIdRef.current);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, s0, s1, freezeOutside]);

  return (
    <div className="video-frame relative">
      <video
        ref={vref}
        className="w-full h-full object-cover"
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
      />
      {debug && (
        <div className="absolute left-2 bottom-2 text-[12px] leading-[1.1] bg-black/60 px-2 py-1 rounded">
          <div>ready: {String(ready)}</div>
          <div>dur: {dur.toFixed(2)}s</div>
          <div>scene: {(sceneP * 100).toFixed(1)}%</div>
          <div>time: {cur.toFixed(2)}s</div>
          <div>
            plateau: {(s0 * 100).toFixed(1)}% → {(s1 * 100).toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
}
