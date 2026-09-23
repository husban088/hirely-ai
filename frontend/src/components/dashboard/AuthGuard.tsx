"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Lazy-initialized: on a normal client-side navigation (going from
  // /dashboard to /profile, or landing here right after login/signup) this
  // runs synchronously the moment the component mounts, so an already
  // logged-in visit renders immediately — no spinner flash that used to
  // look like a "reload" every time you clicked a link.
  const [checked, setChecked] = useState(() =>
    typeof window !== "undefined" ? isAuthenticated() : false,
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else if (!checked) {
      setChecked(true);
    }
  }, [router, checked]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </div>
    );
  }

  return <>{children}</>;
}
