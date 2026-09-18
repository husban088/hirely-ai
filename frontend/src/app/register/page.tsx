"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { User, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { REGISTER_MUTATION } from "@/lib/graphql/mutations";
import { saveSession, isAuthenticated } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [register, { loading }] = useMutation(REGISTER_MUTATION);

  // Already logged in? Skip the form entirely instead of asking to log in again.
  useEffect(() => {
    if (isAuthenticated()) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const { data } = await register({
        variables: { input: { fullName, email, password } },
      });
      saveSession(data.register.accessToken, data.register.user);
      toast.success("Account created — let's get you hired!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Registration failed.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <div className="relative flex flex-1 items-center justify-center px-6 py-16">
        <div className="pointer-events-none absolute inset-0 bg-noise" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-gold/15 shadow-gold-lg md:grid-cols-[0.9fr_1.1fr]"
        >
          {/* ---------- Left brand panel ---------- */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-gold-dark via-[#001a2e] to-black p-10 text-ivory md:flex">
            <div className="pointer-events-none absolute inset-3 rounded-2xl border border-gold-light/20" />
            <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-gold-light/25 blur-3xl" />

            <div className="relative z-10 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-gradient">
                <Sparkles className="h-4 w-4 text-[#ffffff]" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-[#ffffff]">
                Hirely <span className="text-gold-light">AI</span>
              </span>
            </div>

            <div className="relative z-10 mt-8">
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">
                Join Hirely AI
              </span>
              <h2 className="font-display text-3xl font-semibold leading-tight text-[#ffffff] md:text-4xl">
                Start landing
                <br />
                <em className="italic text-gold-light">interviews</em>, faster.
              </h2>
              <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-[#ffffff]/60">
                Score, optimize and tailor your resume with AI in minutes.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 text-xs tracking-wide text-[#ffffff]/40">
              <span className="h-px w-6 bg-gold-light/70" />
              Crafted for serious job seekers
            </div>
          </div>

          {/* ---------- Right form panel ---------- */}
          <div className="glass-panel flex flex-col justify-center p-8 md:p-12">
            <div className="mb-8 flex justify-center md:hidden">
              <Link href="/">
                <Logo size="lg" />
              </Link>
            </div>

            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-gold">
              Sign Up
            </span>
            <h1 className="mb-1 font-display text-2xl font-semibold md:text-3xl">
              Create your account
            </h1>
            <p className="mb-8 text-sm text-ivory/50">
              Start optimizing your resume in minutes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-[42px] h-4 w-4 text-ivory/30" />
                <Input
                  label="Full name"
                  required
                  className="pl-11"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ahsan Khan"
                />
              </div>
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
              <div className="relative">
                <Lock className="absolute left-4 top-[42px] h-4 w-4 text-ivory/30" />
                <Input
                  label="Password"
                  type="password"
                  required
                  minLength={6}
                  className="pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-[42px] h-4 w-4 text-ivory/30" />
                <Input
                  label="Confirm password"
                  type="password"
                  required
                  minLength={6}
                  className="pl-11"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  error={
                    confirmPassword && password !== confirmPassword
                      ? "Passwords do not match."
                      : undefined
                  }
                />
              </div>
              <Button
                type="submit"
                fullWidth
                loading={loading}
                className="mt-2"
              >
                Create Account <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ivory/50">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-gold hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
