"use client";

import { useMemo } from "react";
import DotNav from "@/components/DotNav";
import Stage3D, { StageItem } from "@/components/Stage3D";
import ScrubVideo from "@/components/ScrubVideo";
import CharReveal from "@/components/CharReveal";

const disableMedia = process.env.NEXT_PUBLIC_DISABLE_MEDIA === "1";

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
  /**
   * Finestre:
   * - Video: 22% ciascuno (più tempo allo scrub)
   * - Testi: 10% ciascuno (restano fluidi, ma più rapidi)
   * - Finale: 4%
   * Totale: 22+10+22+10+22+10+4 = 100%
   */
  const ranges: [number, number][] = [
    [0.00, 0.22], // V1
    [0.22, 0.32], // T1
    [0.32, 0.54], // V2
    [0.54, 0.64], // T2
    [0.64, 0.86], // V3
    [0.86, 0.96], // T3
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
          centerStart
          centerDeadzone={0.05}
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
          centerStart
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
          centerStart
          centerDeadzone={0.05}
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
          centerStart
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
          centerStart
          centerDeadzone={0.05}
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
          centerStart
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
  }, [ranges, disableMedia]);

  return (
    <main id="content" className="page-grad">
      <DotNav ids={["video-1","text-1","video-2","text-2","video-3","text-3","final"]} />
      <Stage3D items={items} />
    </main>
  );
}
