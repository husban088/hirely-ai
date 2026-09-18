import { Navbar } from "@/components/landing/Navbar";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "How It Works — Hirely AI",
  description:
    "Upload your resume, get an instant AI score, then optimize and apply — see how Hirely AI takes you from resume to interview.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-8">
        <HowItWorks />
      </div>
      <CTA />
      <Footer />
    </main>
  );
}
