"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function CharReveal({
  title,
  paragraphs,
  range = [0.0, 1.0]
}: {
  title: string;
  paragraphs: string[];
  range?: [number, number]; // 0..1 globale
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const text = useMemo(
    () => paragraphs.map((p) => p.replace(/\s+/g, " ").trim()),
    [paragraphs]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lines = Array.from(root.querySelectorAll<HTMLElement>(".text-line"));
    const chars: HTMLElement[] = [];
    lines.forEach((line) => {
      const t = line.textContent || "";
      line.textContent = "";
      for (const ch of t) {
        const s = document.createElement("span");
        s.textContent = ch;
        s.style.display = "inline-block";
        s.style.opacity = "0";
        s.style.transform = "translateY(8px)";
        line.appendChild(s);
        chars.push(s);
      }
    });

    const [start, end] = range;
    const sPct = `${Math.round(start * 100)}% top`;
    const ePct = `${Math.round(end * 100)}% top`;

    const tl = gsap.timeline({
      scrollTrigger: { start: sPct, end: ePct, scrub: 1 }
    });

    tl.to(lines, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power2.out",
      stagger: { amount: 0.8 }
    }).to(
      chars,
      {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out",
        stagger: { amount: 1.0 }
      },
      "<"
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [range]);

  return (
    <div ref={rootRef} className="text-wrap">
      <h3 className="text-title">{title}</h3>
      <div className="text-lines">
        {text.map((p, i) => (
          <p key={i} className="text-line">{p}</p>
        ))}
      </div>
    </div>
  );
}
