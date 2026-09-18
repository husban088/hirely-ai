"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Briefcase,
  Globe2,
  LogOut,
  Trash2,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ME_QUERY } from "@/lib/graphql/queries";
import {
  UPDATE_PROFILE_MUTATION,
  DELETE_ACCOUNT_MUTATION,
} from "@/lib/graphql/mutations";
import { getUser, updateStoredUser, clearSession } from "@/lib/auth";

const MARKETS = ["US", "Germany", "UK"];

export default function ProfilePage() {
  const router = useRouter();
  const cachedUser = getUser();
  const { data, loading: loadingMe } = useQuery(ME_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const me = data?.me || cachedUser;

  const [fullName, setFullName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetMarket, setTargetMarket] = useState("US");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [updateProfile, { loading: saving }] = useMutation(
    UPDATE_PROFILE_MUTATION,
  );
  const [deleteAccount, { loading: deleting }] = useMutation(
    DELETE_ACCOUNT_MUTATION,
  );

  useEffect(() => {
    if (me) {
      setFullName(me.fullName || "");
      setTargetRole(me.targetRole || "");
      setTargetMarket(me.targetMarket || "US");
    }
  }, [me?.fullName, me?.targetRole, me?.targetMarket]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await updateProfile({
        variables: { input: { fullName, targetRole, targetMarket } },
      });
      updateStoredUser(data.updateProfile);
      toast.success("Profile updated.");
    } catch (err: any) {
      toast.error(err.message || "Could not update profile.");
    }
  }

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  async function handleConfirmDelete() {
    try {
      await deleteAccount();
      clearSession();
      toast.success("Your account has been deleted.");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Could not delete your account.");
      setShowDeleteModal(false);
    }
  }

  const initials = (me?.fullName || "U")
    .trim()
    .split(/\s+/)
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const memberSince = me?.createdAt
    ? new Date(me.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Your <span className="gold-text">Profile</span>
          </h1>
          <p className="mt-1 text-sm text-ivory/50 sm:text-base">
            Manage your account details and preferences.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Identity card */}
          <Card className="flex flex-col items-center text-center lg:col-span-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-gold-gradient text-3xl font-semibold text-obsidian shadow-gold-lg"
            >
              {initials}
            </motion.div>
            <h2 className="mt-4 font-display text-xl font-semibold">
              {me?.fullName || "User"}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ivory/50">
              <Mail className="h-3.5 w-3.5" /> {me?.email}
            </p>
            {memberSince && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-ivory/30">
                <CalendarDays className="h-3.5 w-3.5" /> Member since{" "}
                {memberSince}
              </p>
            )}

            <div className="mt-6 w-full space-y-2">
              <Button variant="secondary" fullWidth onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Log out
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4" /> Delete account
              </Button>
            </div>
          </Card>

          {/* Editable details */}
          <Card className="lg:col-span-2">
            <h3 className="font-display text-lg font-semibold">
              Account details
            </h3>
            <p className="mt-1 text-sm text-ivory/50">
              Keep your target role and market current — it's used to tailor
              your AI resume scoring.
            </p>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-[42px] h-4 w-4 text-ivory/30" />
                <Input
                  label="Full name"
                  className="pl-11"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-[42px] h-4 w-4 text-ivory/30" />
                <Input
                  label="Email"
                  className="pl-11 opacity-60"
                  value={me?.email || ""}
                  disabled
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <Briefcase className="absolute left-4 top-[42px] h-4 w-4 text-ivory/30" />
                  <Input
                    label="Target role"
                    className="pl-11"
                    placeholder="Frontend Developer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ivory/70">
                    Target market
                  </label>
                  <div className="relative">
                    <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory/30" />
                    <select
                      value={targetMarket}
                      onChange={(e) => setTargetMarket(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-ivory outline-none transition-all duration-200 focus:border-gold/60 focus:bg-white/[0.04] focus:shadow-gold"
                    >
                      {MARKETS.map((m) => (
                        <option key={m} value={m} className="bg-charcoal">
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                loading={saving || loadingMe}
                className="mt-2"
              >
                Save Changes
              </Button>
            </form>
          </Card>
        </div>
      </div>

      <Footer />

      {/* Delete-account confirmation modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
            onClick={() => !deleting && setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel w-full max-w-sm rounded-2xl p-6 shadow-gold-lg"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-center font-display text-lg font-semibold">
                Delete your account?
              </h3>
              <p className="mt-2 text-center text-sm text-ivory/50">
                This permanently deletes your account, resumes and job
                applications from our database. This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={handleConfirmDelete}
                  loading={deleting}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
