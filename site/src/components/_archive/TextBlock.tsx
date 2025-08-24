"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

type Props = {
  title: string;
  lines: string[];      // molte righe (≥20)
  variant?: "dark" | "mid" | "light";
};

export default function TextBlock({ title, lines, variant = "mid" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>(".text-line");

    // reveal progressivo con scrub: la posizione nello schermo governa visibilità
    items.forEach((line, idx) => {
      gsap.fromTo(
        line,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: line,
            start: "top 80%",
            end: "top 45%",
            scrub: 0.4, // legato allo scroll (no pop-in)
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const bg = variant === "dark" ? "bg-black" : variant === "light" ? "bg-neutral-50 text-neutral-900" : "";
  return (
    <section className={`text-block ${bg}`} aria-label="Testo descrittivo">
      <div ref={ref} className="text-inner">
        <h3 className="text-head">{title}</h3>
        <div className="text-lines">
          {lines.map((p, i) => (
            <p key={i} className="text-line">{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
