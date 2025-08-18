import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brand One-Page — Demo Chapters",
  description: "One-page scura, narrativa, con capitoli e video background. Demo chapters 01/02/03.",
  openGraph: {
    title: "Brand One-Page — Demo",
    description: "Sito one-page scuro con capitoli e video bg. Demo.",
    type: "website",
    url: "https://example.com",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Brand One-Page" }]
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <a href="#content" className="skip-link">Salta al contenuto</a>
        {children}
      </body>
    </html>
  );
}
