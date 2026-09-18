"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const markets = [
  {
    code: "us",
    name: "United States",
    note: "ATS-optimized, action-verb-driven, 1-page format",
    image:
      "https://images.unsplash.com/photo-1503179008861-d1e2b41f8bec?q=80&w=1400&auto=format&fit=crop",
  },
  {
    code: "de",
    name: "Germany",
    note: "Formal Lebenslauf structure, tabular, precise dates",
    image:
      "https://images.unsplash.com/photo-1651925106420-5c659aab3f4f?q=80&w=1400&auto=format&fit=crop",
  },
  {
    code: "gb",
    name: "United Kingdom",
    note: "British English, personal profile, 2-page acceptable",
    image:
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=1400&auto=format&fit=crop",
  },
];

export function Markets() {
  return (
    <section id="markets" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            Built for <span className="gold-text">every market</span>
          </h2>
          <p className="mt-4 text-ivory/60">
            Hiring conventions differ by country. Hirely AI knows the
            difference.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {markets.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
              whileHover={{ y: -8 }}
              className="country-card shine-sweep group relative h-80 rounded-2xl"
            >
              {/* HD background photo, slow Ken Burns zoom on hover */}
              <img
                src={m.image}
                alt={`${m.name} — famous landmark`}
                loading="lazy"
                className="country-card-img absolute inset-0 h-full w-full object-cover"
              />
              {/* Legibility scrim */}
              <div className="country-card-scrim absolute inset-0" />
              {/* Glowing gradient ring on hover */}
              <div className="country-card-ring rounded-2xl" />

              <div className="relative z-10 flex h-full flex-col justify-between p-6">
                {/* Flag badge — real flag image (not emoji) in a glowing glass roundel */}
                <div className="relative flex h-14 w-14 items-center justify-center">
                  <div className="step-number-glow animate-glow-pulse" />
                  <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#ffffff]/40 bg-[#ffffff]/90 shadow-[0_0_0_1px_rgba(0,79,142,0.15)] backdrop-blur-sm">
                    <img
                      src={`https://flagcdn.com/${m.code}.svg`}
                      alt={`${m.name} flag`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-[#ffffff]">
                      {m.name}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 -translate-x-1 translate-y-1 text-[#ffffff]/0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#2E86C8]" />
                  </div>
                  <p className="text-sm leading-relaxed text-[#ffffff]/75">
                    {m.note}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
