'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { FileText, KanbanSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MY_RESUMES_QUERY, MY_JOBS_QUERY } from '@/lib/graphql/queries';
import { getUser } from '@/lib/auth';

export default function OverviewPage() {
  const user = getUser();
  const { data: resumeData } = useQuery(MY_RESUMES_QUERY, { fetchPolicy: 'cache-and-network' });
  const { data: jobsData } = useQuery(MY_JOBS_QUERY, { fetchPolicy: 'cache-and-network' });

  const resumes = resumeData?.myResumes || [];
  const jobs = jobsData?.myJobs || [];
  const latestScore = resumes[0]?.analysis?.score;
  const activeApplications = jobs.filter((j: any) => j.status !== 'REJECTED').length;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-bold">
          Welcome back, <span className="gold-text">{user?.fullName?.split(' ')[0] || 'there'}</span>
        </h1>
        <p className="mt-1 text-ivory/50">Here's where your job search stands today.</p>
      </motion.div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
            <TrendingUp className="h-5 w-5 text-gold" />
          </div>
          <p className="text-sm text-ivory/50">Latest Resume Score</p>
          <p className="mt-1 font-display text-3xl font-bold">{latestScore ?? '—'}{latestScore ? '/100' : ''}</p>
        </Card>
        <Card>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
            <FileText className="h-5 w-5 text-gold" />
          </div>
          <p className="text-sm text-ivory/50">Resumes Uploaded</p>
          <p className="mt-1 font-display text-3xl font-bold">{resumes.length}</p>
        </Card>
        <Card>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
            <KanbanSquare className="h-5 w-5 text-gold" />
          </div>
          <p className="text-sm text-ivory/50">Active Applications</p>
          <p className="mt-1 font-display text-3xl font-bold">{activeApplications}</p>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Score your resume</h3>
            <p className="mt-1 text-sm text-ivory/50">Upload a CV and get instant AI feedback.</p>
          </div>
          <Link href="/dashboard/resume" className="mt-6">
            <Button fullWidth variant="secondary">Go to Resume AI <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Track applications</h3>
            <p className="mt-1 text-sm text-ivory/50">Manage every application from a single board.</p>
          </div>
          <Link href="/dashboard/jobs" className="mt-6">
            <Button fullWidth variant="secondary">Open Job Tracker <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
