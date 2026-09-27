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

// This document is a standalone printable artifact (not app UI), so its
// palette is hard-coded true gold/near-black rather than the app's
// tailwind.config tokens — those are repurposed for the site's blue theme
// and "white" is remapped to near-black there, which is exactly what made
// this document unreadable before. Keeping literal hex here means it will
// always render correctly no matter how the app's own theme changes.
const INK = "#1c1917";
const GOLD = "#b6892f";
const GOLD_LIGHT = "#d9b25c";
const CREAM = "#fbf8f2";
const NIGHT = "#15130f";
const NIGHT_2 = "#211d17";

type ResumeDocumentProps = {
  details: PersonalDetails;
  targetRole: string;
  targetMarket: string;
  jobTitle: string;
  companyName: string;
  resumeText: string;
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

// The AI's optimized text sometimes comes back as loose paragraphs, but it
// usually contains short ALL-CAPS or Title-Case lines that read as section
// headers ("EXPERIENCE", "Skills", "Education"). We detect those so the
// exported document gets real visual hierarchy instead of one flat block.
function renderResumeBody(text: string) {
  const lines = text.split("\n");
  const isHeading = (line: string) => {
    const t = line.trim();
    if (!t || t.length > 40) return false;
    const letters = t.replace(/[^A-Za-z]/g, "");
    if (letters.length < 3) return false;
    const isUpper = t === t.toUpperCase() && /[A-Z]/.test(t);
    const isTitleShort =
      t.split(/\s+/).length <= 4 && /^[A-Z]/.test(t) && !/[.,;]$/.test(t);
    return isUpper || isTitleShort;
  };

  const blocks: { heading: string | null; body: string[] }[] = [];
  let current: { heading: string | null; body: string[] } = {
    heading: null,
    body: [],
  };
  for (const line of lines) {
    if (isHeading(line)) {
      if (current.heading || current.body.length) blocks.push(current);
      current = { heading: line.trim(), body: [] };
    } else {
      current.body.push(line);
    }
  }
  if (current.heading || current.body.length) blocks.push(current);

  return blocks.map((b, i) => (
    <div key={i} className={i > 0 ? "mt-6" : ""}>
      {b.heading && (
        <div className="mb-2 flex items-center gap-3">
          <h3
            className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: GOLD }}
          >
            {b.heading}
          </h3>
          <span
            className="h-px flex-1"
            style={{
              background: `linear-gradient(to right, ${GOLD}66, transparent)`,
            }}
          />
        </div>
      )}
      <div
        className="whitespace-pre-wrap text-[13px] leading-relaxed"
        style={{ color: `${INK}e6` }}
      >
        {b.body.join("\n").trim()}
      </div>
    </div>
  ));
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

function ResumeDocumentInner(
  {
    details,
    targetRole,
    targetMarket,
    jobTitle,
    companyName,
    resumeText,
  }: ResumeDocumentProps,
  ref: Ref<HTMLDivElement>,
) {
  const relocateLabel =
    details.relocate === "yes"
      ? `Ready to relocate${targetMarket ? ` to ${targetMarket}` : ""}`
      : details.relocate === "no"
        ? "Prefers remote / local roles"
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
            {targetRole}
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
            {targetMarket ? `Tailored for ${targetMarket}` : "Resume"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 p-9 sm:p-11"
        style={{ backgroundColor: CREAM, color: INK }}
      >
        {(jobTitle || companyName) && (
          <p
            className="mb-6 inline-block rounded-full px-4 py-1.5 text-[11px] font-medium"
            style={{
              backgroundColor: `${GOLD}1a`,
              color: GOLD,
              border: `1px solid ${GOLD}55`,
            }}
          >
            Tailored for {jobTitle}
            {jobTitle && companyName ? " at " : ""}
            {companyName}
          </p>
        )}

        {renderResumeBody(resumeText)}

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
            {details.fullName}
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

export const ResumeDocument = forwardRef(ResumeDocumentInner);
