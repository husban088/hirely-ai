'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ScanLine } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-noise" />
      <motion.div
        className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold"
        >
          <ScanLine className="h-3.5 w-3.5" />
          AI-Powered Career Acceleration
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl"
        >
          Land your next role
          <br />
          <span className="gold-text">faster, smarter.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-ivory/60"
        >
          Upload your resume, get an instant AI score, optimize it for US, German or UK hiring
          conventions in one click, generate tailored cover letters, and track every application
          in one elegant dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/register">
            <Button className="px-8 py-4 text-base">
              Optimize My Resume <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="secondary" className="px-8 py-4 text-base">
              See how it works
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
