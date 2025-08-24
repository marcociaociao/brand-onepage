import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk, Inter } from "next/font/google";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});
const bodyf = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "HAZEIN THE BUILDING — Narrative One-Page",
  description:
    "One-page scura, guidata da video e testo scroll-linked. Hero glow per-lettera e capitoli con scrub video.",
  openGraph: {
    title: "HAZEIN THE BUILDING",
    description:
      "One-page scura, guidata da video e testo scroll-linked. Hero glow e scrub video.",
    type: "website",
    url: siteUrl,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "HAZEIN THE BUILDING" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${display.variable} ${bodyf.variable}`}>
        <a href="#content" className="skip-link">Salta al contenuto</a>
        {children}
      </body>
    </html>
  );
}
