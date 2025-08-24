"use client";

import { motion, useReducedMotion } from "framer-motion";
import ChapterSection from "@/components/ChapterSection";
import DotNav from "@/components/DotNav";

const chapters = [
  {
    id: "chapter-01",
    title: "Capitolo 01 — Origine",
    sub: "Inizio del racconto: luce, ritmo, intenzione.",
    video: "/media/chapter-01.mp4",
    poster: "/media/chapter-01.webp",
    cta: "#"
  },
  {
    id: "chapter-02",
    title: "Capitolo 02 — Materia",
    sub: "Texture, profondità, esplorazione.",
    video: "/media/chapter-02.mp4",
    poster: "/media/chapter-02.webp",
    cta: "#"
  },
  {
    id: "chapter-03",
    title: "Capitolo 03 — Forma",
    sub: "Sintesi finale e call-to-action.",
    video: "/media/chapter-03.mp4",
    poster: "/media/chapter-03.webp",
    cta: "#"
  }
];

export default function Page() {
  const prefersReduced = useReducedMotion();
  const disableMedia =
    process.env.NEXT_PUBLIC_DISABLE_MEDIA === "1" ? true : false;

  return (
    <main id="content">
      <DotNav ids={chapters.map((c) => c.id)} />
      {chapters.map((c) => (
        <motion.section
          key={c.id}
          id={c.id}
          className="section"
          aria-label={c.title}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: prefersReduced ? 0 : 0.8,
            ease: "easeOut"
          }}
        >
          <ChapterSection
            title={c.title}
            sub={c.sub}
            videoSrc={c.video}
            posterSrc={c.poster}
            ctaHref={c.cta}
            disableMedia={disableMedia}
          />
        </motion.section>
      ))}
    </main>
  );
}
