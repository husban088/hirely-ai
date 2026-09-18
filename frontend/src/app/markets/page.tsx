import { Navbar } from "@/components/landing/Navbar";
import { Markets } from "@/components/landing/Markets";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Supported Markets — Hirely AI",
  description:
    "Hirely AI tailors your resume to hiring conventions across the US, Germany, and the UK.",
};

export default function MarketsPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-8">
        <Markets />
      </div>
      <CTA />
      <Footer />
    </main>
  );
}
