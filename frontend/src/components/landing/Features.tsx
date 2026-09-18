'use client';

import { ScanSearch, Wand2, FileText, KanbanSquare } from 'lucide-react';
import { Card } from '../ui/Card';

const features = [
  {
    icon: ScanSearch,
    title: 'Instant AI Scoring',
    desc: 'Upload your CV and get a 0-100 score in seconds, with strengths, weaknesses, and hidden ATS issues surfaced instantly.',
  },
  {
    icon: Wand2,
    title: 'Market-Aware Optimization',
    desc: 'One click rewrites your resume to match US, German (Lebenslauf) or UK hiring conventions — formatting, tone, and structure included.',
  },
  {
    icon: FileText,
    title: 'Tailored Cover Letters',
    desc: 'Generate a compelling, role-specific cover letter from your resume and the job description in under 10 seconds.',
  },
  {
    icon: KanbanSquare,
    title: 'Application Tracker',
    desc: 'A drag-and-drop board to track every application — Wishlist, Applied, Interview, Offer, or Rejected — never lose track again.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            Everything you need to <span className="gold-text">get hired</span>
          </h2>
          <p className="mt-4 text-ivory/60">
            Four tools, one workflow — built for job seekers who take their search seriously.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Card key={f.title} className="group">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient shadow-gold transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <f.icon className="h-6 w-6 text-obsidian" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-ivory/60">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
