import * as mammoth from "mammoth";

// IMPORTANT: import the inner file, NOT "pdf-parse" itself. The package's index.js runs a
// "debug mode" check at load time that tries to read a local test PDF — this crashes on
// serverless platforms like Vercel (ENOENT ./test/data/05-versions-space.pdf).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse: (
  buffer: Buffer,
) => Promise<{ text: string }> = require("pdf-parse/lib/pdf-parse.js");

/** Extracts plain text from a PDF or DOCX buffer based on mimetype/extension. */
export async function extractTextFromBuffer(
  buffer: Buffer,
  fileName: string,
): Promise<string> {
  const lower = fileName.toLowerCase();

  if (lower.endsWith(".pdf")) {
    const data = await pdfParse(buffer);
    return data.text.trim();
  }

  if (lower.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value.trim();
  }

  // Fallback: assume plain text
  return buffer.toString("utf-8").trim();
}
