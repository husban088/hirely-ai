import { toPng } from "html-to-image";
import jsPDF from "jspdf";

function sanitizeFileName(name: string) {
  return name.replace(/[\\/:*?"<>|]+/g, "").trim() || "document";
}

// Captures the node at 2x pixel density on a solid white background so the
// exported PNG/PDF always looks crisp and print-ready, regardless of the
// page's own (dark) background behind it.
async function captureNodeAsPng(node: HTMLElement): Promise<string> {
  // html-to-image sometimes needs a second pass the very first time it runs
  // in a tab (fonts/images not fully decoded yet) - render once, then again.
  await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#ffffff",
  });
  return toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#ffffff",
  });
}

export async function downloadNodeAsImage(node: HTMLElement, fileName: string) {
  const dataUrl = await captureNodeAsPng(node);
  const link = document.createElement("a");
  link.download = `${sanitizeFileName(fileName)}.png`;
  link.href = dataUrl;
  link.click();
}

export async function downloadNodeAsPdf(node: HTMLElement, fileName: string) {
  const dataUrl = await captureNodeAsPng(node);

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

  // Build a PDF page sized to exactly match the captured image (px -> pt,
  // undoing the 2x pixelRatio) so the image fills the page edge-to-edge -
  // no cropping, no extra margins, and it "just becomes" a PDF.
  const widthPt = (img.width / 2) * 0.75;
  const heightPt = (img.height / 2) * 0.75;

  const pdf = new jsPDF({
    orientation: widthPt > heightPt ? "landscape" : "portrait",
    unit: "pt",
    format: [widthPt, heightPt],
  });
  pdf.addImage(dataUrl, "PNG", 0, 0, widthPt, heightPt);
  pdf.save(`${sanitizeFileName(fileName)}.pdf`);
}
