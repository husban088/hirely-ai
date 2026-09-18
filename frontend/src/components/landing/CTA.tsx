'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function CTA() {
  return (
    <section className="px-6 pb-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-charcoal to-obsidian p-12 text-center shadow-gold-lg"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 animate-float rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 animate-float rounded-full bg-gold/10 blur-3xl" style={{ animationDelay: '2s' }} />
        <h2 className="relative font-display text-3xl font-bold md:text-4xl">
          Ready to stand out?
        </h2>
        <p className="relative mx-auto mt-3 max-w-md text-ivory/60">
          Join job seekers using AI to move faster than the competition.
        </p>
        <Link href="/register" className="relative mt-8 inline-block">
          <Button className="px-8 py-4 text-base">
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
