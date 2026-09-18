"use client";

import { motion } from "framer-motion";
import { UploadCloud, Gauge, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: UploadCloud,
    title: "Upload your resume",
    desc: "Drop your PDF or DOCX — we extract and analyze it instantly.",
  },
  {
    n: "02",
    icon: Gauge,
    title: "Get your AI score",
    desc: "See exactly where you stand, and what recruiters and ATS bots will flag.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Optimize & apply",
    desc: "One click to optimize for your target market, generate a cover letter, and track the application.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            Three steps. <span className="gold-text">That's it.</span>
          </h2>
          <p className="mt-4 text-ivory/60">
            No clutter, no guesswork — just a clear path from resume to offer.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connecting shimmer line across all three cards on desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-[4.25rem] hidden h-px shimmer-line md:block" />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="step-card group relative z-10 rounded-2xl p-8 text-center"
            >
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                <div className="step-number-glow animate-glow-pulse" />
                <span className="gold-text relative font-display text-5xl font-extrabold">
                  {s.n}
                </span>
              </div>

              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <s.icon className="h-6 w-6 text-obsidian" />
              </div>

              <h3 className="mb-2 font-display text-xl font-semibold">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-ivory/60">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
