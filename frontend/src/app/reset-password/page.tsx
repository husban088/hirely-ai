"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RESET_PASSWORD_MUTATION } from "@/lib/graphql/mutations";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!token) {
      toast.error(
        "This reset link is missing its token. Please request a new one.",
      );
      return;
    }
    try {
      await resetPassword({ variables: { input: { token, newPassword } } });
      setDone(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      toast.error(err.message || "That reset link is invalid or expired.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-gold-lg"
    >
      <div className="mb-8 flex justify-center">
        <Link href="/">
          <Logo size="lg" />
        </Link>
      </div>

      {done ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h1 className="mb-2 font-display text-2xl font-semibold">
            Password updated
          </h1>
          <p className="mb-8 text-sm text-ivory/50">
            You can now log in with your new password.
          </p>
          <Button fullWidth onClick={() => router.push("/login")}>
            Go to Log In <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <h1 className="mb-1 text-center font-display text-2xl font-semibold">
            Set a new password
          </h1>
          <p className="mb-8 text-center text-sm text-ivory/50">
            Choose a new password for your account.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-[42px] h-4 w-4 text-ivory/30" />
              <Input
                label="New password"
                type="password"
                required
                minLength={6}
                className="pl-11"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-[42px] h-4 w-4 text-ivory/30" />
              <Input
                label="Confirm new password"
                type="password"
                required
                minLength={6}
                className="pl-11"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                error={
                  confirmPassword && newPassword !== confirmPassword
                    ? "Passwords do not match."
                    : undefined
                }
              />
            </div>
            <Button type="submit" fullWidth loading={loading} className="mt-2">
              Reset Password <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-noise" />
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
