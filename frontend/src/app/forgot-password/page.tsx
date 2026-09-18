"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { Mail, ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FORGOT_PASSWORD_MUTATION } from "@/lib/graphql/mutations";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await forgotPassword({ variables: { input: { email } } });
      setSent(true);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-noise" />
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

        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
              <MailCheck className="h-6 w-6" />
            </div>
            <h1 className="mb-2 font-display text-2xl font-semibold">
              Check your inbox
            </h1>
            <p className="mb-8 text-sm text-ivory/50">
              If an account exists for{" "}
              <span className="font-medium text-ivory">{email}</span>, a
              password reset link is on its way. It expires in 30 minutes.
            </p>
            <Link href="/login">
              <Button variant="secondary" fullWidth>
                <ArrowLeft className="h-4 w-4" /> Back to log in
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-center font-display text-2xl font-semibold">
              Forgot your password?
            </h1>
            <p className="mb-8 text-center text-sm text-ivory/50">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-[42px] h-4 w-4 text-ivory/30" />
                <Input
                  label="Email"
                  type="email"
                  required
                  className="pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <Button
                type="submit"
                fullWidth
                loading={loading}
                className="mt-2"
              >
                Send Reset Link <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-ivory/50">
              Remembered it?{" "}
              <Link
                href="/login"
                className="font-medium text-gold hover:underline"
              >
                Log in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </main>
  );
}
