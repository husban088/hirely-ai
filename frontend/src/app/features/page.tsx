import { Navbar } from "@/components/landing/Navbar";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Features — Hirely AI",
  description:
    "AI-powered resume scoring, market-tailored optimization, cover letter generation, and job application tracking.",
};

export default function FeaturesPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-8">
        <Features />
      </div>
      <CTA />
      <Footer />
    </main>
  );
}
