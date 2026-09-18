"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, UserCircle, LayoutDashboard } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { isAuthenticated } from "@/lib/auth";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/markets", label: "Markets" },
];

export function Navbar() {
  // Read auth state on mount so the navbar shows "Dashboard" instead of
  // "Log in" when the person already has a valid session — navigating
  // here from the dashboard should never look like being logged out.
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  // Lock body scroll while the mobile sidebar is open, and let Escape
  // close it — small touches that make the overlay feel native.
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // If the viewport grows into the desktop (md) breakpoint while the
  // mobile sidebar is still open — e.g. someone forgot to close it and
  // then resized the window or rotated a tablet — force it closed so it
  // never gets stuck open behind the desktop layout.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setMenuOpen(false);
    };
    handleChange(mql);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ transform: "none" }}
        className="sticky top-0 z-50 border-b border-white/5 bg-obsidian/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline text-sm text-ivory/70 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right-side actions */}
          <div className="hidden items-center gap-3 md:flex">
            {loggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-ivory/70 transition-all duration-200 hover:border-gold/50 hover:text-gold"
                  aria-label="Profile"
                >
                  <UserCircle className="h-5 w-5" />
                </Link>
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile / tablet: hamburger menu icon, right side only */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-ivory/70 transition-colors hover:border-gold/50 hover:text-gold md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      {/* Mobile / tablet sidebar — rendered as a SIBLING of the header, not
          nested inside it, so it is never trapped inside a transformed
          ancestor's stacking context and always sits above every page's
          content (including other fixed elements like a dashboard sidebar).
          A `transform` on an ancestor turns it into the containing block for
          any `position: fixed` descendant — that's what was silently
          breaking this sidebar's fixed positioning/z-index on some pages
          when it lived inside the animated <motion.header>. */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop — clicking here (i.e. outside the sidebar) closes it */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm md:hidden"
            />

            {/* Sidebar panel — clicks inside never close it */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-[1000] flex w-[78%] max-w-xs flex-col border-l border-white/10 bg-obsidian px-6 py-6 shadow-gold-lg md:hidden"
            >
              <div className="flex items-center justify-between">
                <Logo size="sm" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 text-ivory/70 transition-colors hover:border-gold/50 hover:text-gold"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-10 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-ivory/80 transition-colors hover:bg-white/5 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-6">
                {loggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-ivory/80 transition-colors hover:bg-white/5 hover:text-gold"
                    >
                      <UserCircle className="h-5 w-5" /> Profile
                    </Link>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                      <Button fullWidth>
                        <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                      <Button variant="secondary" fullWidth>
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMenuOpen(false)}>
                      <Button fullWidth>Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
