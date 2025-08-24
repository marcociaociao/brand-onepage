"use client";

import { useMemo } from "react";
import DotNav from "@/components/DotNav";
import Stage3D, { StageItem } from "@/components/Stage3D";
import HeroCylinder from "@/components/HeroCylinder";
import ScrubVideo from "@/components/ScrubVideo";
import CharReveal from "@/components/CharReveal";

const disableMedia = process.env.NEXT_PUBLIC_DISABLE_MEDIA === "1";

function makeParagraph(seed: string, lines = 20) {
  const arr: string[] = [];
  for (let i = 0; i < lines; i++) {
    arr.push(
      `${seed}. Riga ${String(i + 1).padStart(2, "0")} — il senso scorre con il gesto, i dettagli emergono e rientrano, senza interrompere la lettura.`
    );
  }
  // Uniamo in 3 paragrafi per blocco (≈20 righe totali con wrap naturale)
  const n = Math.ceil(arr.length / 3);
  return [arr.slice(0, n).join(" "), arr.slice(n, 2 * n).join(" "), arr.slice(2 * n).join(" ")];
}

export default function Page() {
  const items: StageItem[] = useMemo(() => {
    // Finestre custom b) su tutto lo scroll (0..1)
    // 8 tappe: Hero, V1, T1, V2, T2, V3, T3, Final
    const R = [
      [0.00, 0.12], // Hero
      [0.12, 0.25], // V1
      [0.25, 0.37], // T1
      [0.37, 0.50], // V2
      [0.50, 0.62], // T2
      [0.62, 0.75], // V3
      [0.75, 0.87], // T3
      [0.87, 1.00]  // Final
    ] as [number, number][];

    const hero: StageItem = {
      id: "hero",
      range: R[0],
      node: (
        <HeroCylinder
          rings={16}
          fontSize="clamp(2rem, 8vw, 5.5rem)"
          primary="#5c5fc4"
          accent="#c4c15c"
        />
      ),
    };

    const v1: StageItem = {
      id: "video-1",
      range: R[1],
      node: (
        <ScrubVideo
          src={disableMedia ? "" : "/media/chap-01.mp4"}
          poster={"/media/chap-01.webp"}
          start={R[1][0]}
          end={R[1][1]}
        />
      ),
    };

    const t1: StageItem = {
      id: "text-1",
      range: R[2],
      node: (
        <CharReveal
          title="Origine — Intento"
          paragraphs={makeParagraph("Origine e intenzione: un taglio di luce caldo che incide la scena")}
          range={R[2]}
        />
      ),
    };

    const v2: StageItem = {
      id: "video-2",
      range: R[3],
      node: (
        <ScrubVideo
          src={disableMedia ? "" : "/media/chap-02.mp4"}
          poster={"/media/chap-02.webp"}
          start={R[3][0]}
          end={R[3][1]}
        />
      ),
    };

    const t2: StageItem = {
      id: "text-2",
      range: R[4],
      node: (
        <CharReveal
          title="Materia — Texture"
          paragraphs={makeParagraph("Texture e granularità: finte transizioni, sensazioni vere")}
          range={R[4]}
        />
      ),
    };

    const v3: StageItem = {
      id: "video-3",
      range: R[5],
      node: (
        <ScrubVideo
          src={disableMedia ? "" : "/media/chap-03.mp4"}
          poster={"/media/chap-03.webp"}
          start={R[5][0]}
          end={R[5][1]}
        />
      ),
    };

    const t3: StageItem = {
      id: "text-3",
      range: R[6],
      node: (
        <CharReveal
          title="Forma — Sintesi"
          paragraphs={makeParagraph("Il racconto si alleggerisce, il bianco entra piano: la forma prende respiro")}
          range={R[6]}
        />
      ),
    };

    const fin: StageItem = {
      id: "final",
      range: R[7],
      node: (
        <div className="final-wrap">
          <h2 className="final-title">Finale — Gallery</h2>
          <p className="final-sub">Qui inseriremo una strip di immagini con transizioni morbide.</p>
        </div>
      ),
    };

    return [hero, v1, t1, v2, t2, v3, t3, fin];
  }, []);

  return (
    <main id="content" className="page-grad">
      <DotNav ids={["hero", "video-1", "text-1", "video-2", "text-2", "video-3", "text-3", "final"]} />
      <Stage3D items={items} />
    </main>
  );
}
