import { Injectable } from "@nestjs/common";
import { GoogleGenAI } from "@google/genai";

// Note: class/file name kept as "OpenAiService" / "openai" for the rest of the app,
// but internally this now calls Google's Gemini API via the @google/genai SDK.
// NOTE: gemini-2.5-flash has been shut down by Google — use a current stable model.
@Injectable()
export class OpenAiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  }

  private async generate(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });
      return response.text || "";
    } catch (err: any) {
      // Log the REAL reason (bad/expired key, wrong model, quota, network, etc.)
      // instead of letting it bubble up as a generic "Internal server error".
      console.error(
        "[OpenAiService] Gemini API call failed:",
        err?.message || err,
      );
      throw new Error(
        `AI analysis failed: ${err?.message || "unknown Gemini API error"}`,
      );
    }
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
