"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client";
import {
  LayoutDashboard,
  FileText,
  KanbanSquare,
  UserCircle,
  LogOut,
} from "lucide-react";
import { Logo } from "../ui/Logo";
import { clearSession, getUser, updateStoredUser } from "@/lib/auth";
import { ME_QUERY } from "@/lib/graphql/queries";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/resume", label: "Resume AI", icon: FileText },
  { href: "/dashboard/jobs", label: "Job Tracker", icon: KanbanSquare },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const cachedUser = getUser();

  // Always confirm the name/email against the server instead of trusting
  // whatever was cached at signup — fixes the sidebar ever showing a
  // generic "User" fallback, and keeps it accurate if the name is later
  // changed on the Profile page. Falls back to the cached copy while this
  // is still loading so nothing flashes empty.
  const { data } = useQuery(ME_QUERY, { fetchPolicy: "cache-and-network" });
  const user = data?.me || cachedUser;

  if (data?.me) {
    updateStoredUser(data.me);
  }

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/5 bg-charcoal/60 backdrop-blur-xl md:flex">
      <div className="p-6">
        <Link href="/">
          <Logo size="sm" />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className="relative block">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gold-gradient shadow-gold"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span
                className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active ? "text-obsidian" : "text-ivory/60 hover:text-ivory"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/5 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-sm font-semibold text-obsidian">
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </div>
          <Link href="/profile" className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user?.fullName || "User"}
            </p>
            <p className="truncate text-xs text-ivory/40">{user?.email}</p>
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-ivory/50 transition-colors hover:bg-red-500/10 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </aside>
  );
}
