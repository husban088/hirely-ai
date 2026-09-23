import { Injectable } from "@nestjs/common";
import { GoogleGenAI } from "@google/genai";

// Note: class/file name kept as "OpenAiService" / "openai" for the rest of the app,
// but internally this now calls Google's Gemini API via the @google/genai SDK.
@Injectable()
export class OpenAiService {
  private ai: GoogleGenAI;

  // Primary model first, then a lighter/higher-throughput fallback.
  // On the free tier, gemini-3.6-flash can return 503 "high demand" during
  // spikes — falling back to gemini-3.1-flash-lite keeps requests succeeding.
  private readonly MODELS = ["gemini-3.6-flash", "gemini-3.1-flash-lite"];
  private readonly MAX_RETRIES_PER_MODEL = 2;
  // Cap how long a single Gemini call is allowed to hang before we treat it
  // as a transient failure and move on — this is what used to leave the
  // upload sitting at 90-95% with no feedback for a long time.
  private readonly PER_ATTEMPT_TIMEOUT_MS = 12000;
  private readonly BACKOFF_BASE_MS = 500;
  private readonly BACKOFF_CAP_MS = 2500;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Races a Gemini call against a timeout so one slow/hung request can't block everything. */
  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error("Gemini request timed out (UNAVAILABLE)")),
        ms,
      );
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timer!);
    }
  }

  /** True for transient errors worth retrying (overload/quota/timeout), false for real errors (bad key, bad request). */
  private isRetryable(err: any): boolean {
    let code = err?.status ?? err?.code;
    let status = err?.status;
    const rawMsg = String(err?.message || err || "");

    // The SDK often throws with the raw Gemini error JSON as the message,
    // e.g. {"error":{"code":503,"status":"UNAVAILABLE",...}} — parse it if present.
    try {
      const parsed = JSON.parse(rawMsg);
      code = parsed?.error?.code ?? code;
      status = parsed?.error?.status ?? status;
    } catch {
      // not JSON — fall through to string matching below
    }

    const lower = rawMsg.toLowerCase();
    return (
      code === 503 ||
      code === 429 ||
      status === "UNAVAILABLE" ||
      status === "RESOURCE_EXHAUSTED" ||
      lower.includes("high demand") ||
      lower.includes("overloaded") ||
      lower.includes("unavailable") ||
      lower.includes("resource_exhausted") ||
      lower.includes("timed out")
    );
  }

  private async generate(prompt: string): Promise<string> {
    let lastErr: any;

    for (const model of this.MODELS) {
      for (let attempt = 0; attempt < this.MAX_RETRIES_PER_MODEL; attempt++) {
        try {
          const response = await this.withTimeout(
            this.ai.models.generateContent({ model, contents: prompt }),
            this.PER_ATTEMPT_TIMEOUT_MS,
          );
          return response.text || "";
        } catch (err: any) {
          lastErr = err;
          console.error(
            `[OpenAiService] Gemini call failed (model=${model}, attempt=${attempt + 1}):`,
            err?.message || err,
          );

          if (!this.isRetryable(err)) {
            // Real error (bad/expired key, malformed request, etc.) — no point retrying.
            throw new Error(
              `AI analysis failed: ${err?.message || "unknown Gemini API error"}`,
            );
          }

          const isLastAttemptForModel =
            attempt === this.MAX_RETRIES_PER_MODEL - 1;
          // Only sleep if we're actually going to retry — sleeping after the
          // final attempt for a model just delayed falling back for no reason.
          if (!isLastAttemptForModel) {
            const backoffMs =
              Math.min(
                this.BACKOFF_CAP_MS,
                this.BACKOFF_BASE_MS * Math.pow(2, attempt),
              ) +
              Math.random() * 200;
            await this.sleep(backoffMs);
          }
        }
      }
    }

    throw new Error(
      `AI analysis failed: Gemini is currently overloaded, please try again in a moment. (${lastErr?.message || "unknown Gemini API error"})`,
    );
  }

  /** Scores a resume 0-100 against a target role/market and returns structured feedback. */
  async scoreResume(
    resumeText: string,
    targetRole: string,
    targetMarket: string,
  ) {
    const prompt = `You are a senior technical recruiter and ATS (Applicant Tracking System) expert hiring for "${targetRole}" positions in ${targetMarket}.

Analyze the following resume text and respond ONLY with valid JSON (no markdown, no backticks) in this exact shape:
{
  "score": <integer 0-100>,
  "summary": "<2-3 sentence overall verdict>",
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "atsIssues": ["...", "..."],
  "keywordGaps": ["...", "..."]
}

Resume:
"""
${resumeText}
"""`;

    const text = await this.generate(prompt);
    return this.safeParseJson(text);
  }

  /** Rewrites/optimizes a resume for a target market's conventions (US, Germany, UK, etc). */
  async optimizeResume(
    resumeText: string,
    targetRole: string,
    targetMarket: string,
  ) {
    const styleNotes: Record<string, string> = {
      Germany:
        "Follow German (Lebenslauf) conventions: tabular, reverse-chronological, formal tone, no first-person pronouns, include a professional photo placeholder note, precise dates (MM/YYYY), and quantifiable achievements. Avoid American-style buzzwords.",
      US: "Follow US conventions: 1-page where possible, strong action verbs, quantifiable achievements, no photo, no personal details like age/marital status, ATS-friendly formatting.",
      UK: "Follow UK CV conventions: 2-page acceptable, personal profile/summary at top, no photo, British English spelling, reverse-chronological.",
    };

    const prompt = `You are an expert resume writer specializing in ${targetMarket} hiring conventions for "${targetRole}" roles.
${styleNotes[targetMarket] || "Follow best-practice international resume conventions."}

Rewrite and optimize the resume below. Respond ONLY with valid JSON (no markdown, no backticks) in this shape:
{
  "optimizedText": "<full rewritten resume as plain text, ready to paste, using clear section headers>",
  "changesMade": ["...", "..."]
}

Original resume:
"""
${resumeText}
"""`;

    const text = await this.generate(prompt);
    return this.safeParseJson(text);
  }

  /** Generates a tailored cover letter. */
  async generateCoverLetter(
    resumeText: string,
    jobTitle: string,
    companyName: string,
    jobDescription: string,
    targetMarket: string,
  ) {
    const prompt = `Write a compelling, concise cover letter (max 350 words) for the "${jobTitle}" role at "${companyName}", tailored to ${targetMarket} hiring norms. Base it on the candidate's resume and the job description below. Return ONLY the cover letter text, no JSON, no markdown fences.

Resume:
"""
${resumeText}
"""

Job description:
"""
${jobDescription}
"""`;

    const text = await this.generate(prompt);
    return text.trim();
  }

  private safeParseJson(text: string) {
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return { raw: text };
    }
  }
}
