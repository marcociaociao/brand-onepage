"use client";

import { useMemo } from "react";
import Stage3D, { StageItem } from "@/components/Stage3D";
import ScrubVideo from "@/components/ScrubVideo";

const disableMedia = process.env.NEXT_PUBLIC_DISABLE_MEDIA === "1";
const disablePosters = process.env.NEXT_PUBLIC_DISABLE_POSTERS === "1";
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function Para(seed: string, lines = 20) {
  const arr = Array.from({ length: lines }, (_, i) =>
    `${seed}. Riga ${String(i + 1).padStart(2, "0")} — il flusso accompagna lo sguardo senza stacchi bruschi.`
  );
  return (
    <div className="text-wrap">
      <h2 className="text-title">Sezione — {seed}</h2>
      <div className="space-y-4 text-lg text-white/85">
        {arr.map((t, i) => (
          <p key={i}>{t}</p>
          ))}
      </div>
    </div>
  );
}

export default function Page() {
  // Timeline (0..1) della scena — più spazio ai video
  const ranges: [number, number][] = [
    [0.0, 0.14], // intro
    [0.14, 0.42], // video 1
    [0.42, 0.54], // testo 1
    [0.54, 0.82], // video 2
    [0.82, 0.92], // testo 2
    [0.92, 1.0], // video 3
  ];

  // Plateau locale largo per lo scrub (quasi tutto l'intervallo item)
  const plateauLocal: [number, number] = [0.05, 0.95];

  const items: StageItem[] = useMemo(() => {
    const [iS, iE] = ranges[0];
    const [v1S, v1E] = ranges[1];
    const [t1S, t1E] = ranges[2];
    const [v2S, v2E] = ranges[3];
    const [t2S, t2E] = ranges[4];
    const [v3S, v3E] = ranges[5];

    const proj = (s: number, e: number, t: number) => lerp(s, e, t);

    const intro: StageItem = {
      id: "intro",
      range: [iS, iE],
      node: (
        <div style={{ textAlign: "center" }}>
          <h1
            className="text-[clamp(2rem,8vw,6rem)] font-black tracking-tight"
            style={{ letterSpacing: ".02em" }}
          >
            HAZE IN THE BUILDING
          </h1>
          <p className="mt-4 text-white/70">Scroll per entrare</p>
        </div>
      ),
    };

    // Video 1
    const v1PlateauScene: [number, number] = [
      proj(v1S, v1E, plateauLocal[0]),
      proj(v1S, v1E, plateauLocal[1]),
    ];
    const video1: StageItem = {
      id: "video-1",
      range: [v1S, v1E],
      plateau: plateauLocal,
      zPlateau: 0,
      node: (
        <ScrubVideo
          src={disableMedia ? "" : "/media/chap-01.mp4"}
          poster={disablePosters ? undefined : "/media/chap-01.webp"}
          activeStart={v1PlateauScene[0]}
          activeEnd={v1PlateauScene[1]}
          freezeOutside
          debug={true}
        />
      ),
    };

    const text1: StageItem = {
      id: "text-1",
      range: [t1S, t1E],
      node: Para("Origine — Intento"),
    };

    // Video 2
    const v2PlateauScene: [number, number] = [
      proj(v2S, v2E, plateauLocal[0]),
      proj(v2S, v2E, plateauLocal[1]),
    ];
    const video2: StageItem = {
      id: "video-2",
      range: [v2S, v2E],
      plateau: plateauLocal,
      zPlateau: 0,
      node: (
        <ScrubVideo
          src={disableMedia ? "" : "/media/chap-02.mp4"}
          poster={disablePosters ? undefined : "/media/chap-02.webp"}
          activeStart={v2PlateauScene[0]}
          activeEnd={v2PlateauScene[1]}
          freezeOutside
          debug={true}
        />
      ),
    };

    const text2: StageItem = {
      id: "text-2",
      range: [t2S, t2E],
      node: Para("Materia — Texture"),
    };

    // Video 3
    const v3PlateauScene: [number, number] = [
      proj(v3S, v3E, plateauLocal[0]),
      proj(v3S, v3E, plateauLocal[1]),
    ];
    const video3: StageItem = {
      id: "video-3",
      range: [v3S, v3E],
      plateau: plateauLocal,
      zPlateau: 0,
      node: (
        <ScrubVideo
          src={disableMedia ? "" : "/media/chap-03.mp4"}
          poster={disablePosters ? undefined : "/media/chap-03.webp"}
          activeStart={v3PlateauScene[0]}
          activeEnd={v3PlateauScene[1]}
          freezeOutside
          debug={true}
        />
      ),
    };

    return [intro, video1, text1, video2, text2, video3];
  }, [ranges, disableMedia, disablePosters]);

  return (
    <main id="content" className="page-grad">
      <Stage3D items={items} />
    </main>
  );
}
