"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/**
 * CharReveal: divide le righe in caratteri e rivela con stagger
 * durante la finestra di scroll assegnata. 3 blocchi per capitolo.
 */
export default function CharReveal({
  title,
  paragraphs,
  range = [0.25, 0.375] // finestra di scroll globale di default (25%..37.5%)
}: {
  title: string;
  paragraphs: string[]; // 3 paragrafi, ciascuno ~20 righe (wrap naturale)
  range?: [number, number]; // 0..1 nello scroll totale
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const text = useMemo(() => {
    return paragraphs.map((p) => p.replace(/\s+/g, " ").trim());
  }, [paragraphs]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Split in caratteri
    const lines = Array.from(root.querySelectorAll<HTMLElement>(".text-line"));
    const charSpans: HTMLElement[] = [];
    lines.forEach((line) => {
      const txt = line.textContent || "";
      line.textContent = "";
      for (const ch of txt) {
        const span = document.createElement("span");
        span.textContent = ch;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(8px)";
        line.appendChild(span);
        charSpans.push(span);
      }
    });

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const [start, end] = range;

    const update = () => {
      const p = max > 0 ? window.scrollY / max : 0;
      const local = (p - start) / (end - start);
      const clamped = Math.max(0, Math.min(1, local));

      // linee: attiviamo gradualmente (riga per riga)
      lines.forEach((line, i) => {
        const lineP = i / Math.max(1, lines.length - 1);
        const visible = clamped >= lineP * 0.98; // soglia progressiva
        line.style.opacity = visible ? "1" : "0.2";
      });
    };

    // Timeline GSAP per i caratteri (stagger progressivo con ScrollTrigger)
    const tl = gsap.timeline({
      scrollTrigger: {
        start: `${Math.round(start * 100)}% top`,
        end: `${Math.round(end * 100)}% top`,
        scrub: 1
      }
    });
    tl.to(charSpans, {
      opacity: 1,
      y: 0,
      duration: 0.2,
      ease: "power2.out",
      stagger: { amount: 1.2 }
    });

    const onScroll = () => update();
    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [range]);

  return (
    <div className="text-wrap">
      <h3 className="text-title">{title}</h3>
      <div className="text-lines">
        {text.map((p, idx) => (
          <p key={idx} className="text-line">{p}</p>
        ))}
      </div>
    </div>
  );
}
