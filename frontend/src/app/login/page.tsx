"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LOGIN_MUTATION } from "@/lib/graphql/mutations";
import { saveSession, isAuthenticated } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  // Already logged in (e.g. came back from the home page)? Go straight to the dashboard
  // instead of showing the login form again.
  useEffect(() => {
    if (isAuthenticated()) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { input: { email, password } },
      });
      saveSession(data.login.accessToken, data.login.user);
      toast.success(`Welcome back, ${data.login.user.fullName.split(" ")[0]}!`);
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed.");
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
                Members Access
              </span>
              <h2 className="font-display text-3xl font-semibold leading-tight text-[#ffffff] md:text-4xl">
                Welcome back to a<br />
                <em className="italic text-gold-light">smarter</em> job search.
              </h2>
              <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-[#ffffff]/60">
                Sign in to score, optimize and track your resumes with AI.
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
              Sign In
            </span>
            <h1 className="mb-1 font-display text-2xl font-semibold md:text-3xl">
              Login to your account
            </h1>
            <p className="mb-8 text-sm text-ivory/50">
              Enter your details to continue your job search.
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
              <div className="relative">
                <Lock className="absolute left-4 top-[42px] h-4 w-4 text-ivory/30" />
                <Input
                  label="Password"
                  type="password"
                  required
                  className="pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="-mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-ivory/50 hover:text-gold"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                fullWidth
                loading={loading}
                className="mt-2"
              >
                Log In <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ivory/50">
              Just here to read?{" "}
              <Link href="/" className="font-medium text-gold hover:underline">
                Continue to Hirely AI
              </Link>
            </p>

            <div className="mt-4 border-t border-white/10 pt-4 text-center text-sm text-ivory/50">
              New here?{" "}
              <Link
                href="/register"
                className="font-medium text-gold hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
