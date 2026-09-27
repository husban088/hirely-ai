import { forwardRef, Ref } from "react";
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  MapPin,
  Plane,
} from "lucide-react";
import { PersonalDetails } from "./PersonalDetailsForm";

// Hard-coded true gold/near-black palette — see the note in ResumeDocument.tsx
// for why this document never uses the app's own (repurposed) color tokens.
const INK = "#1c1917";
const GOLD = "#b6892f";
const GOLD_LIGHT = "#d9b25c";
const CREAM = "#fbf8f2";
const NIGHT = "#15130f";
const NIGHT_2 = "#211d17";

type CoverLetterDocumentProps = {
  details: PersonalDetails;
  jobTitle: string;
  companyName: string;
  targetMarket?: string;
  letterText: string;
};

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

function SidebarRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
        style={{ border: `1px solid ${GOLD}55`, color: GOLD_LIGHT }}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p
          className="text-[9px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: `${GOLD_LIGHT}99` }}
        >
          {label}
        </p>
        <p
          className="break-words text-[11.5px] leading-snug"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// Splits the AI letter into paragraphs, and separately renders any
// numbered lines ("1. ..." / "1) ...") as gold numbered points — matching
// how a real "here's how I match your requirements" letter reads.
function renderLetterBody(letterText: string) {
  const paragraphs = letterText.split(/\n{2,}/).filter(Boolean);
  if (paragraphs.length === 0) {
    return (
      <p className="italic" style={{ color: `${INK}66` }}>
        Cover letter text yahan aayega.
      </p>
    );
  }
  return paragraphs.map((p, i) => {
    const m = p.trim().match(/^(\d{1,2})[.)]\s+(.*)$/s);
    if (m) {
      return (
        <div key={i} className="flex gap-3">
          <span
            className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
            style={{ backgroundColor: GOLD, color: "#ffffff" }}
          >
            {m[1]}
          </span>
          <p className="flex-1" style={{ color: `${INK}e6` }}>
            {m[2]}
          </p>
        </div>
      );
    }
    return (
      <p key={i} style={{ color: `${INK}e6` }}>
        {p}
      </p>
    );
  });
}

function CoverLetterDocumentInner(
  {
    details,
    jobTitle,
    companyName,
    targetMarket,
    letterText,
  }: CoverLetterDocumentProps,
  ref: Ref<HTMLDivElement>,
) {
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const relocateLabel =
    details.relocate === "yes"
      ? `Ready to relocate${targetMarket ? ` to ${targetMarket}` : ""}`
      : details.relocate === "no"
        ? "Prefers remote / local roles"
        : "";

  const relocateParagraph =
    details.relocate === "yes"
      ? `I am based in ${details.location || "my current city"}, and I am fully open to relocating${
          targetMarket ? ` to ${targetMarket}` : ""
        } for this role.`
      : details.relocate === "no"
        ? `I am based in ${details.location || "my current city"}. I am currently focused on remote or local opportunities rather than relocating${
            targetMarket ? ` to ${targetMarket}` : ""
          }.`
        : "";

  return (
    <div
      ref={ref}
      className="mx-auto flex w-full max-w-[860px] overflow-hidden"
      style={{ fontFamily: "var(--font-sans, sans-serif)" }}
    >
      {/* Sidebar */}
      <div
        className="flex w-[280px] flex-shrink-0 flex-col gap-7 p-8"
        style={{
          background: `linear-gradient(165deg, ${NIGHT_2} 0%, ${NIGHT} 100%)`,
        }}
      >
        <div className="flex flex-col items-center text-center">
          {details.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={details.photoDataUrl}
              alt={details.fullName}
              className="h-28 w-28 rounded-full object-cover"
              style={{ border: `3px solid ${GOLD}` }}
            />
          ) : (
            <div
              className="flex h-28 w-28 items-center justify-center rounded-full font-display text-3xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                color: NIGHT,
              }}
            >
              {initials(details.fullName)}
            </div>
          )}
          <h1
            className="font-display mt-4 text-xl font-bold leading-tight"
            style={{ color: "#ffffff" }}
          >
            {details.fullName}
          </h1>
          <p
            className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: GOLD_LIGHT }}
          >
            {jobTitle || "Applicant"}
          </p>
          <span
            className="mt-4 h-px w-14"
            style={{ backgroundColor: `${GOLD}66` }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <SidebarRow icon={MapPin} label="Location" value={details.location} />
          <SidebarRow icon={Mail} label="Email" value={details.email} />
          <SidebarRow
            icon={Phone}
            label="Phone"
            value={`${details.dialCode} ${details.phone}`.trim()}
          />
          <SidebarRow
            icon={Linkedin}
            label="LinkedIn"
            value={details.linkedinUrl}
          />
          <SidebarRow icon={Github} label="GitHub" value={details.githubUrl} />
          <SidebarRow
            icon={Globe}
            label="Portfolio"
            value={details.portfolioUrl}
          />
          <SidebarRow icon={Plane} label="Relocation" value={relocateLabel} />
        </div>

        <div className="mt-auto pt-4">
          <span
            className="block h-px w-full"
            style={{ backgroundColor: `${GOLD}33` }}
          />
          <p
            className="mt-3 text-[9px] uppercase tracking-[0.25em]"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Cover Letter
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 p-9 sm:p-11"
        style={{ backgroundColor: CREAM, color: INK }}
      >
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-lg font-semibold">
            Dear{" "}
            {companyName ? (
              <span style={{ color: GOLD }}>{companyName}</span>
            ) : (
              "Hiring"
            )}{" "}
            Team,
          </p>
          <p
            className="whitespace-nowrap text-xs"
            style={{ color: `${INK}66` }}
          >
            {today}
          </p>
        </div>
        <p className="mt-1 text-sm font-medium" style={{ color: `${INK}99` }}>
          Re: Application for {jobTitle || "the role"}
          {companyName ? ` at ${companyName}` : ""}
        </p>
        <span
          className="mt-3 block h-px w-full"
          style={{
            background: `linear-gradient(to right, ${GOLD}66, transparent)`,
          }}
        />

        <div className="mt-6 space-y-4 text-[13px] leading-relaxed">
          {renderLetterBody(letterText)}
          {relocateParagraph && (
            <div>
              <h3
                className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                Relocation
              </h3>
              <p style={{ color: `${INK}e6` }}>{relocateParagraph}</p>
            </div>
          )}
        </div>

        <div className="mt-10 text-sm">
          <p style={{ color: `${INK}99` }}>Sincerely,</p>
          <p
            className="font-display mt-5 text-lg font-semibold italic"
            style={{ color: GOLD }}
          >
            {details.fullName}
          </p>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <span
            className="h-[2px] flex-1"
            style={{
              background: `linear-gradient(to right, ${GOLD}, transparent)`,
            }}
          />
          <span
            className="text-[9px] uppercase tracking-[0.3em]"
            style={{ color: `${GOLD}99` }}
          >
            {companyName || "Cover Letter"}
          </span>
          <span
            className="h-[2px] flex-1"
            style={{
              background: `linear-gradient(to left, ${GOLD}, transparent)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const CoverLetterDocument = forwardRef(CoverLetterDocumentInner);
