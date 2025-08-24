import VideoBackground from "./VideoBackground";

type Props = {
  title: string;
  sub: string;
  videoSrc: string;
  posterSrc: string;
  ctaHref?: string;
  disableMedia?: boolean;
};

export default function ChapterSection({
  title,
  sub,
  videoSrc,
  posterSrc,
  ctaHref,
  disableMedia = false
}: Props) {
  return (
    <>
      <div className="absolute inset-0">
        {disableMedia ? (
          <div className="h-full w-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800" />
        ) : (
          <VideoBackground
            src={videoSrc}
            poster={posterSrc}
            className="h-full w-full object-cover"
          />
        )}
        <div className="section-overlay" />
      </div>

      <div className="section-inner" role="group" aria-roledescription="chapter">
        <h2 className="section-title">{title}</h2>
        <p className="section-sub">{sub}</p>
        {ctaHref && (
          <a className="cta" href={ctaHref} aria-label={`Vai a ${title}`}>
            Scopri di più
          </a>
        )}
      </div>
    </>
  );
}
