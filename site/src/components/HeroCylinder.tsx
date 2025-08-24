"use client";

type Props = {
  primary?: string;
  accent?: string;
  rings?: number;
  fontSize?: string;
};

export default function HeroCylinder({
  primary = "#5c5fc4",
  accent = "#c4c15c",
  rings = 16,
  fontSize = "clamp(2rem, 8vw, 5rem)"
}: Props) {
  const spans = Array.from({ length: rings }, (_, i) => i + 1);
  return (
    <div
      className="hero-cyl"
      style={
        {
          ["--cyl-primary" as any]: primary,
          ["--cyl-accent" as any]: accent,
          ["--cyl-font" as any]: fontSize
        } as React.CSSProperties
      }
    >
      <div className="cyl-container">
        <div className="cyl-box">
          {spans.map((idx) => (
            <span key={idx} style={{ ["--i" as any]: idx } as React.CSSProperties}>
              <i>HAZE</i> IN THE <i>BUILDING</i>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
