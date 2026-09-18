"use client";

import { useState, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useMutation, useQuery } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  UploadCloud,
  FileText,
  Wand2,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/dashboard/ScoreRing";
import { MY_RESUMES_QUERY } from "@/lib/graphql/queries";
import {
  OPTIMIZE_RESUME_MUTATION,
  DELETE_RESUME_MUTATION,
  GENERATE_COVER_LETTER_MUTATION,
} from "@/lib/graphql/mutations";
import { useRouter } from "next/navigation";
import { getToken, clearSession } from "@/lib/auth";

const MARKETS = ["US", "Germany", "UK"];
// Vercel Functions reject request bodies larger than 4.5MB, so keep uploads safely below that.
const MAX_FILE_MB = 4;

export default function ResumePage() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [targetMarket, setTargetMarket] = useState("US");
  const [uploading, setUploading] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [coverForm, setCoverForm] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
  });
  const [coverLetterResult, setCoverLetterResult] = useState("");

  const { data, refetch } = useQuery(MY_RESUMES_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const resumes = data?.myResumes || [];
  const active =
    resumes.find((r: any) => r.id === activeResumeId) || resumes[0];

  const [optimizeResume, { loading: optimizing }] = useMutation(
    OPTIMIZE_RESUME_MUTATION,
  );
  const [deleteResume] = useMutation(DELETE_RESUME_MUTATION);
  const [generateCoverLetter, { loading: generatingLetter }] = useMutation(
    GENERATE_COVER_LETTER_MUTATION,
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const token = getToken();
      if (!token) {
        toast.error("Please log in first.");
        router.push("/login");
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetRole", targetRole);
      formData.append("targetMarket", targetMarket);

      const uploadUrl =
        process.env.NEXT_PUBLIC_UPLOAD_URL ||
        "http://localhost:4000/api/resume/upload";

      try {
        let res: Response;
        try {
          res = await fetch(uploadUrl, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
        } catch {
          // fetch() itself failed => server not reachable / wrong URL / CORS
          throw new Error(
            "Cannot reach the server. Make sure the backend is running on port 4000 and NEXT_PUBLIC_UPLOAD_URL is correct.",
          );
        }

        if (res.status === 401) {
          // Token is stale/expired or was signed with an old secret — force a clean re-login
          // instead of surfacing the raw "invalid signature" error to the user.
          clearSession();
          toast.error("Your session expired. Please log in again.");
          router.push("/login");
          return;
        }

        if (res.status === 413) {
          throw new Error(
            `File is too large. Please upload a file under ${MAX_FILE_MB}MB.`,
          );
        }

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const msg = Array.isArray(body?.message)
            ? body.message.join(", ")
            : body?.message;
          throw new Error(msg || `Upload failed (${res.status}).`);
        }

        const resume = await res.json();
        toast.success("Resume analyzed!");
        setActiveResumeId(resume.id);
        refetch();
      } catch (err: any) {
        toast.error(err.message || "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [targetRole, targetMarket, refetch, router],
  );

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    const code = rejections[0]?.errors[0]?.code;
    if (code === "file-too-large")
      toast.error(`File is larger than ${MAX_FILE_MB}MB.`);
    else if (code === "file-invalid-type")
      toast.error("Only PDF or DOCX files are supported.");
    else toast.error("That file could not be accepted.");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_MB * 1024 * 1024,
  });

  async function handleOptimize() {
    if (!active) return;
    try {
      await optimizeResume({ variables: { resumeId: active.id } });
      toast.success("Resume optimized for " + active.targetMarket + "!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Optimization failed.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteResume({ variables: { resumeId: id } });
      toast.success("Resume deleted.");
      setActiveResumeId(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleGenerateCoverLetter(e: React.FormEvent) {
    e.preventDefault();
    if (!active) return;
    try {
      const { data } = await generateCoverLetter({
        variables: { input: { resumeId: active.id, ...coverForm } },
      });
      setCoverLetterResult(data.generateCoverLetter);
      toast.success("Cover letter generated!");
    } catch (err: any) {
      toast.error(err.message || "Generation failed.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">
        Resume <span className="gold-text">AI</span>
      </h1>
      <p className="mt-1 text-ivory/50">
        Upload, score, and optimize your resume for any market.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[380px,1fr]">
        {/* Upload column */}
        <div className="space-y-6">
          <Card>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs text-ivory/50">
                  Target Role
                </label>
                <input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold/60"
                  placeholder="e.g. Frontend Developer"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-ivory/50">
                  Target Market
                </label>
                <select
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold/60"
                >
                  {MARKETS.map((m) => (
                    <option key={m} value={m} className="bg-charcoal">
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              {...getRootProps()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
                isDragActive
                  ? "border-gold bg-gold/5"
                  : "border-white/10 hover:border-gold/40 hover:bg-white/[0.02]"
              }`}
            >
              <input {...getInputProps()} />
              <motion.div animate={{ y: isDragActive ? -6 : 0 }}>
                <UploadCloud className="mx-auto mb-3 h-10 w-10 text-gold" />
              </motion.div>
              <p className="text-sm font-medium">
                {uploading ? "Analyzing..." : "Drop your resume here"}
              </p>
              <p className="mt-1 text-xs text-ivory/40">
                PDF or DOCX, up to {MAX_FILE_MB}MB
              </p>
            </div>
          </Card>

          <Card>
            <h4 className="mb-3 text-sm font-semibold text-ivory/70">
              Your Resumes
            </h4>
            <div className="space-y-2">
              {resumes.length === 0 && (
                <p className="text-sm text-ivory/40">
                  No resumes uploaded yet.
                </p>
              )}
              {resumes.map((r: any) => (
                <button
                  key={r.id}
                  onClick={() => setActiveResumeId(r.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                    active?.id === r.id
                      ? "border-gold/50 bg-gold/5"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 flex-shrink-0 text-gold" />
                    <span className="truncate">{r.fileName}</span>
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(r.id);
                    }}
                    className="ml-2 flex-shrink-0 text-ivory/30 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Analysis column */}
        <div className="space-y-6">
          {!active && (
            <Card className="flex h-64 items-center justify-center text-center text-ivory/40">
              Upload a resume to see your AI analysis here.
            </Card>
          )}

          {active && (
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <Card className="flex flex-col items-center gap-6 sm:flex-row">
                  <ScoreRing score={active.analysis?.score ?? 0} />
                  <div className="flex-1 text-center sm:text-left">
                    <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <Badge>{active.targetRole}</Badge>
                      <Badge tone="blue">{active.targetMarket}</Badge>
                    </div>
                    <p className="text-sm text-ivory/70">
                      {active.analysis?.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                      <Button onClick={handleOptimize} loading={optimizing}>
                        <Wand2 className="h-4 w-4" /> Optimize for{" "}
                        {active.targetMarket}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setCoverLetterOpen(!coverLetterOpen)}
                      >
                        <Mail className="h-4 w-4" /> Cover Letter
                      </Button>
                    </div>
                  </div>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Strengths
                    </h4>
                    <ul className="space-y-2 text-sm text-ivory/70">
                      {(active.analysis?.strengths || []).map(
                        (s: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-emerald-600">•</span>
                            {s}
                          </li>
                        ),
                      )}
                    </ul>
                  </Card>
                  <Card>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-600">
                      <AlertTriangle className="h-4 w-4" /> Weaknesses
                    </h4>
                    <ul className="space-y-2 text-sm text-ivory/70">
                      {(active.analysis?.weaknesses || []).map(
                        (s: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-red-600">•</span>
                            {s}
                          </li>
                        ),
                      )}
                    </ul>
                  </Card>
                  <Card>
                    <h4 className="mb-3 text-sm font-semibold text-gold">
                      ATS Issues
                    </h4>
                    <ul className="space-y-2 text-sm text-ivory/70">
                      {(active.analysis?.atsIssues || []).map(
                        (s: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-gold">•</span>
                            {s}
                          </li>
                        ),
                      )}
                    </ul>
                  </Card>
                  <Card>
                    <h4 className="mb-3 text-sm font-semibold text-gold">
                      Keyword Gaps
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(active.analysis?.keywordGaps || []).map(
                        (s: string, i: number) => (
                          <Badge key={i} tone="slate">
                            {s}
                          </Badge>
                        ),
                      )}
                    </div>
                  </Card>
                </div>

                {active.optimizedText && (
                  <Card>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gold">
                      <Sparkles className="h-4 w-4" /> Optimized Resume (
                      {active.targetMarket})
                    </h4>
                    <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-gold-gradient p-4 text-xs leading-relaxed text-zinc-100">
                      {active.optimizedText}
                    </pre>
                  </Card>
                )}

                <AnimatePresence>
                  {coverLetterOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card>
                        <h4 className="mb-4 text-sm font-semibold text-gold">
                          Generate Cover Letter
                        </h4>
                        <form
                          onSubmit={handleGenerateCoverLetter}
                          className="grid gap-3 sm:grid-cols-2"
                        >
                          <input
                            required
                            placeholder="Job title"
                            value={coverForm.jobTitle}
                            onChange={(e) =>
                              setCoverForm({
                                ...coverForm,
                                jobTitle: e.target.value,
                              })
                            }
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold/60"
                          />
                          <input
                            required
                            placeholder="Company name"
                            value={coverForm.companyName}
                            onChange={(e) =>
                              setCoverForm({
                                ...coverForm,
                                companyName: e.target.value,
                              })
                            }
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold/60"
                          />
                          <textarea
                            required
                            placeholder="Paste job description..."
                            rows={4}
                            value={coverForm.jobDescription}
                            onChange={(e) =>
                              setCoverForm({
                                ...coverForm,
                                jobDescription: e.target.value,
                              })
                            }
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold/60 sm:col-span-2"
                          />
                          <Button
                            type="submit"
                            loading={generatingLetter}
                            className="sm:col-span-2"
                          >
                            Generate <Sparkles className="h-4 w-4" />
                          </Button>
                        </form>
                        {coverLetterResult && (
                          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-gold-gradient p-4 text-xs leading-relaxed text-zinc-100">
                            {coverLetterResult}
                          </pre>
                        )}
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
