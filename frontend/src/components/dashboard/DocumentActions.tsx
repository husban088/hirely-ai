"use client";

import { RefObject, useState } from "react";
import { FileImage, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { downloadNodeAsImage, downloadNodeAsPdf } from "@/lib/exportDocument";

export function DocumentActions({
  targetRef,
  defaultFileName,
}: {
  targetRef: RefObject<HTMLElement>;
  defaultFileName: string;
}) {
  const [fileName, setFileName] = useState(defaultFileName);
  const [busy, setBusy] = useState<"png" | "pdf" | null>(null);

  async function run(kind: "png" | "pdf") {
    if (!targetRef.current) return;
    setBusy(kind);
    try {
      const name = fileName.trim() || defaultFileName;
      if (kind === "png") await downloadNodeAsImage(targetRef.current, name);
      else await downloadNodeAsPdf(targetRef.current, name);
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex-1">
        <label className="mb-1.5 block text-xs text-ivory/50">
          File name (you can rename it)
        </label>
        <input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold/60"
          placeholder={defaultFileName}
        />
      </div>
      <div className="flex flex-shrink-0 gap-2">
        <Button
          variant="secondary"
          onClick={() => run("png")}
          loading={busy === "png"}
        >
          <FileImage className="h-4 w-4" /> Image
        </Button>
        <Button onClick={() => run("pdf")} loading={busy === "pdf"}>
          <FileText className="h-4 w-4" /> PDF
        </Button>
      </div>
    </div>
  );
}
