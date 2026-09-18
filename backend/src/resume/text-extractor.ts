import pdfParse = require("pdf-parse");
import * as mammoth from "mammoth";

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
