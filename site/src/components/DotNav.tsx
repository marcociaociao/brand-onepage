"use client";
import { useEffect, useState } from "react";
export default function DotNav({ ids }: { ids: string[] }) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (vis?.target) setActive((vis.target as HTMLElement).id);
    }, { threshold: [0.25, 0.5, 0.75] });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);
  return (
    <nav className="dotnav" aria-label="Sezioni">
      {ids.map(id => (
        <a key={id} href={`#${id}`} aria-label={`Vai a ${id}`} aria-current={active === id ? "true" : "false"} />
      ))}
    </nav>
  );
}
