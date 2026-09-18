import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Fraunces: a soft, high-contrast editorial serif with real character —
// reads far more "boutique luxury" than a generic Playfair Display.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

// Plus Jakarta Sans: a distinctive, premium geometric sans with a warmer,
// more designed feel than the more commonly used Manrope/Inter.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Hirely AI — Land Your Next Role, Faster",
  description:
    "AI-powered resume scoring, market-tailored optimization, cover letter generation, and job application tracking — built for serious job seekers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
