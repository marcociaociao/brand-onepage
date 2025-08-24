"use client";

import { useMemo } from "react";
import DotNav from "@/components/DotNav";
import Stage3D, { StageItem } from "@/components/Stage3D";
import HeroCylinder from "@/components/HeroCylinder";
import ScrubVideo from "@/components/ScrubVideo";
import CharReveal from "@/components/CharReveal";

const disableMedia = process.env.NEXT_PUBLIC_DISABLE_MEDIA === "1";

// test content ~20 righe (wrap naturale)
function makeParagraph(seed: string, lines = 21) {
  const arr: string[] = [];
  for (let i = 0; i < lines; i++) {
    arr.push(
      `${seed}. Riga ${String(i + 1).padStart(2, "0")} — il flusso continua e accompagna lo sguardo senza stacchi bruschi.`
    );
  }
  const n = Math.ceil(arr.length / 3);
  return [arr.slice(0, n).join(" "), arr.slice(n, 2 * n).join(" "), arr.slice(2 * n).join(" ")];
}

export default function Page() {
  // finestre larghe e regolari: 16% ciascuna, finale più corto
  const ranges: [number, number][] = [
    [0.00, 0.16], // V1  (scrub su tutta la finestra)
    [0.16, 0.32], // T1  (reveal su tutta la finestra)
    [0.32, 0.48], // V2
    [0.48, 0.64], // T2
    [0.64, 0.80], // V3
    [0.80, 0.96], // T3
    [0.96, 1.00], // Finale
  ];

  const items: StageItem[] = useMemo(() => {
    const v1: StageItem = {
      id: "video-1",
      range: ranges[0],
      node: (
        <ScrubVideo
          src={disableMedia ? "" : "/media/chap-01.mp4"}
          poster={"/media/chap-01.webp"}
          start={ranges[0][0]}
          end={ranges[0][1]}
        />
      ),
    };
    const t1: StageItem = {
      id: "text-1",
      range: ranges[1],
      node: (
        <CharReveal
          title="Origine — Intento"
          paragraphs={makeParagraph("Origine e intenzione, il tema si apre")}
          range={ranges[1]}
        />
      ),
    };
    const v2: StageItem = {
      id: "video-2",
      range: ranges[2],
      node: (
        <ScrubVideo
          src={disableMedia ? "" : "/media/chap-02.mp4"}
          poster={"/media/chap-02.webp"}
          start={ranges[2][0]}
          end={ranges[2][1]}
        />
      ),
    };
    const t2: StageItem = {
      id: "text-2",
      range: ranges[3],
      node: (
        <CharReveal
          title="Materia — Texture"
          paragraphs={makeParagraph("Materia e texture, transizioni finte ma tattili")}
          range={ranges[3]}
        />
      ),
    };
    const v3: StageItem = {
      id: "video-3",
      range: ranges[4],
      node: (
        <ScrubVideo
          src={disableMedia ? "" : "/media/chap-03.mp4"}
          poster={"/media/chap-03.webp"}
          start={ranges[4][0]}
          end={ranges[4][1]}
        />
      ),
    };
    const t3: StageItem = {
      id: "text-3",
      range: ranges[5],
      node: (
        <CharReveal
          title="Forma — Sintesi"
          paragraphs={makeParagraph("La forma alleggerisce, la narrazione prende respiro")}
          range={ranges[5]}
        />
      ),
    };
    const fin: StageItem = {
      id: "final",
      range: ranges[6],
      node: (
        <div className="final-wrap">
          <h2 className="final-title">Finale — Gallery</h2>
          <p className="final-sub">Strip di immagini in transizione (placeholder).</p>
        </div>
      ),
    };
    return [v1, t1, v2, t2, v3, t3, fin];
  }, [ranges]);

  return (
    <main id="content" className="page-grad">
      {/* HERO visibile subito */}
      <section id="hero-top" aria-label="Hero">
        <HeroCylinder
          rings={16}
          fontSize="clamp(1.6rem, 7.2vw, 4rem)"
          primary="#5c5fc4"
          accent="#c4c15c"
        />
      </section>

      {/* Sticky stage */}
      <DotNav ids={["hero-top","video-1","text-1","video-2","text-2","video-3","text-3","final"]} />
      <Stage3D items={items} />
    </main>
  );
}
