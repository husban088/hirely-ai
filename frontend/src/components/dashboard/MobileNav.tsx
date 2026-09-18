"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  KanbanSquare,
  UserCircle,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/resume", label: "Resume", icon: FileText },
  { href: "/dashboard/jobs", label: "Jobs", icon: KanbanSquare },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-white/10 bg-charcoal/90 py-2 backdrop-blur-xl md:hidden">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 text-xs transition-colors ${active ? "text-gold" : "text-ivory/50"}`}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
