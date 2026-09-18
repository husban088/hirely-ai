import * as mammoth from "mammoth";

// Import the parser's inner file directly. The package's index.js contains a debug block that
// tries to read a sample PDF from disk when it thinks it runs standalone — which happens once the
// code is bundled for Vercel and causes "ENOENT ... test/data/05-versions-space.pdf".
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
