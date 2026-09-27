"use client";

import { useRef } from "react";
import { Camera, X } from "lucide-react";
import { COUNTRY_CODES } from "@/lib/countryCodes";

export interface PersonalDetails {
  fullName: string;
  dialCode: string;
  phone: string;
  email: string;
  location: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  photoDataUrl: string;
  // "" = not answered yet, so the document can simply omit the line.
  relocate: "" | "yes" | "no";
}

export const emptyPersonalDetails: PersonalDetails = {
  fullName: "",
  dialCode: "+92",
  phone: "",
  email: "",
  location: "",
  portfolioUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  photoDataUrl: "",
  relocate: "",
};

// Photo is optional by design — every other field is mandatory before a
// cover letter or an optimized-resume document can be generated/exported.
const REQUIRED_FIELDS: { key: keyof PersonalDetails; label: string }[] = [
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone number" },
  { key: "portfolioUrl", label: "Portfolio link" },
  { key: "linkedinUrl", label: "LinkedIn profile" },
  { key: "githubUrl", label: "GitHub link" },
];

// Returns the human-readable labels of whichever required fields are still
// empty, so callers can tell the user exactly what's missing instead of a
// generic "fill your details" message.
export function getMissingFields(d: PersonalDetails): string[] {
  return REQUIRED_FIELDS.filter((f) => !String(d[f.key] ?? "").trim()).map(
    (f) => f.label,
  );
}

export function isPersonalDetailsComplete(d: PersonalDetails) {
  return getMissingFields(d).length === 0;
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-gold/60";
// Applied to a required field that's still empty, so the user can see at a
// glance which box is causing the "fill your details" error.
const missingClass = "border-red-500/70 focus:border-red-500";
const labelClass =
  "mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-ivory/40";

export function PersonalDetailsForm({
  value,
  onChange,
}: {
  value: PersonalDetails;
  onChange: (next: PersonalDetails) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof PersonalDetails>(key: K, v: PersonalDetails[K]) {
    onChange({ ...value, [key]: v });
  }

  function cls(key: keyof PersonalDetails, extra = "") {
    const isEmpty = !String(value[key] ?? "").trim();
    return `${inputClass} ${extra} ${isEmpty ? missingClass : ""}`.trim();
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Photo must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("photoDataUrl", reader.result as string);
    reader.readAsDataURL(file);
  }

  // Single column throughout: this form lives inside a narrow ~380px
  // sidebar card, so a 2-column grid (which only responds to viewport
  // width, not the card's own width) used to squeeze every input into an
  // unreadably tight ~150px, making fields look merged/broken.
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <div
          onClick={() => fileRef.current?.click()}
          className="relative flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gold/40 bg-white/5"
        >
          {value.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value.photoDataUrl}
              alt="Your photo"
              className="h-full w-full object-cover"
            />
          ) : (
            <Camera className="h-5 w-5 text-gold" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs text-ivory/50">
            Photo (optional) — will appear in the cover letter / resume design.
          </p>
          <div className="mt-1 flex gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs text-gold underline underline-offset-2"
            >
              Upload photo
            </button>
            {value.photoDataUrl && (
              <button
                type="button"
                onClick={() => set("photoDataUrl", "")}
                className="flex items-center gap-1 text-xs text-red-500 underline underline-offset-2"
              >
                <X className="h-3 w-3" /> Remove
              </button>
            )}
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhoto}
        />
      </div>

      <div>
        <label className={labelClass}>Full name *</label>
        <input
          required
          placeholder="e.g. Husban Ahmad"
          value={value.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          className={cls("fullName")}
        />
      </div>

      <div>
        <label className={labelClass}>Email *</label>
        <input
          required
          type="email"
          placeholder="you@example.com"
          value={value.email}
          onChange={(e) => set("email", e.target.value)}
          className={cls("email")}
        />
      </div>

      <div>
        <label className={labelClass}>Phone number *</label>
        {/* Country code + the full number side by side, on their own full
            width row so there's no confusion about which box is which. */}
        <div className="flex gap-2">
          <select
            value={value.dialCode}
            onChange={(e) => set("dialCode", e.target.value)}
            className={`${inputClass} w-[6.5rem] flex-shrink-0`}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.iso} value={c.dial} className="bg-charcoal">
                {c.flag} {c.dial}
              </option>
            ))}
          </select>
          <input
            required
            inputMode="tel"
            placeholder="Enter your full mobile number"
            value={value.phone}
            onChange={(e) =>
              set("phone", e.target.value.replace(/[^0-9 ]/g, ""))
            }
            className={cls("phone", "flex-1")}
          />
        </div>
        <p className="mt-1 text-[11px] text-ivory/35">
          First select your country (Pakistan, Germany, or any other), then
          enter your full number next to it.
        </p>
      </div>

      <div>
        <label className={labelClass}>Current location</label>
        <input
          placeholder="e.g. Faisalabad, Pakistan"
          value={value.location}
          onChange={(e) => set("location", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Open to relocating?</label>
        <select
          value={value.relocate}
          onChange={(e) =>
            set("relocate", e.target.value as PersonalDetails["relocate"])
          }
          className={inputClass}
        >
          <option value="" className="bg-charcoal">
            Select — will show on resume/cover letter
          </option>
          <option value="yes" className="bg-charcoal">
            Yes, ready to relocate
          </option>
          <option value="no" className="bg-charcoal">
            No, remote / local roles only
          </option>
        </select>
        <p className="mt-1 text-[11px] text-ivory/35">
          On the cover letter, this will be mentioned alongside the country
          you're applying to (Target Market).
        </p>
      </div>

      <div>
        <label className={labelClass}>Portfolio link *</label>
        <input
          required
          placeholder="https://your-portfolio.com"
          value={value.portfolioUrl}
          onChange={(e) => set("portfolioUrl", e.target.value)}
          className={cls("portfolioUrl")}
        />
      </div>

      <div>
        <label className={labelClass}>LinkedIn profile *</label>
        <input
          required
          placeholder="https://linkedin.com/in/..."
          value={value.linkedinUrl}
          onChange={(e) => set("linkedinUrl", e.target.value)}
          className={cls("linkedinUrl")}
        />
      </div>

      <div>
        <label className={labelClass}>GitHub link *</label>
        <input
          required
          placeholder="https://github.com/..."
          value={value.githubUrl}
          onChange={(e) => set("githubUrl", e.target.value)}
          className={cls("githubUrl")}
        />
      </div>
    </div>
  );
}
