import VideoBackground from "./VideoBackground";
type Props = { title: string; sub: string; videoSrc: string; posterSrc: string; ctaHref?: string; };

export default function ChapterSection({ title, sub, videoSrc, posterSrc, ctaHref }: Props) {
  return (
    <>
      <div className="absolute inset-0">
        <VideoBackground src={videoSrc} poster={posterSrc} className="h-full w-full object-cover" />
        <div className="section-overlay" />
      </div>
      <div className="section-inner" role="group" aria-roledescription="chapter">
        <h2 className="section-title">{title}</h2>
        <p className="section-sub">{sub}</p>
        {ctaHref && (<a className="cta" href={ctaHref} aria-label={`Vai a ${title}`}>Scopri di più</a>)}
      </div>
    </>
  );
}
