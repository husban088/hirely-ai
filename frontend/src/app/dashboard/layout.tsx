import { AuthGuard } from '@/components/dashboard/AuthGuard';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/dashboard/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Sidebar />
        <main className="pb-24 pt-8 md:ml-64 md:pb-8">
          <div className="mx-auto max-w-6xl px-6">{children}</div>
        </main>
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
