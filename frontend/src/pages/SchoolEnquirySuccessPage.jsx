import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Check,
  ClipboardCheck,
  Copy,
  FileCheck2,
  House,
  Phone,
  School,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "../components/Header";
import Footer from "../components/SchoolsFooter";

const confetti = Array.from({ length: 120 }, (_, index) => {
  const seed = (index * 37 + 13) % 101;
  return {
    id: index,
    left: `${(index * 47.73) % 100}%`,
    top: `${(index * 29.17) % 94}%`,
    drift: `${((seed % 25) - 12)}px`,
    delay: `-${((index * 17) % 63) / 10}s`,
    duration: `${3.8 + ((index * 13) % 38) / 10}s`,
    hue: [198, 214, 142, 48, 270, 330, 12, 176][index % 8],
    size: `${3 + (index % 4)}px`,
    shape: index % 4,
  };
});

function formatSubmittedDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatEnquiryReference(id) {
  if (id === null || id === undefined || String(id).trim() === "") return "";
  return String(id).padStart(5, "0");
}

function SchoolArtwork() {
  return (
    <div className="uc-success-artwork" aria-hidden="true">
      <div className="uc-success-books">
        <svg viewBox="0 0 190 154" role="presentation">
          <path d="M29 117h129l-9 20H37z" fill="#f6bd4d" />
          <path d="M22 91h143l-7 21H29z" fill="#0b6fe8" />
          <path d="M36 64h122l8 22H29z" fill="#fff" />
          <path d="M43 67h8v17h-8zM148 67h5v17h-5z" fill="#c4e7ff" />
          <path d="M52 41 95 18l42 23-8 5H59z" fill="#102e6b" />
          <path d="m95 18 42 23-8 5H95z" fill="#174a9c" />
          <path d="M133 42v19" stroke="#f6bd4d" strokeWidth="3" />
          <path d="M128 62h11" stroke="#f6bd4d" strokeWidth="4" strokeLinecap="round" />
          <path d="M95 18v31" stroke="#d9efff" strokeWidth="2" opacity=".8" />
          <path d="M31 112h140" stroke="#d6ebff" strokeWidth="2" />
        </svg>
      </div>
      <div className="uc-success-school">
        <svg viewBox="0 0 220 170" role="presentation">
          <path d="M23 70 111 23l86 47v82H23z" fill="#fff" stroke="#c7def7" strokeWidth="3" />
          <path d="m17 70 94-52 94 52" fill="none" stroke="#144a8b" strokeWidth="9" strokeLinejoin="round" />
          <path d="M78 40h66v21H78z" fill="#eaf5ff" />
          <path d="M84 45h54v11H84z" fill="#155ea9" />
          <text x="111" y="54" fill="#fff" fontSize="8" fontWeight="700" textAnchor="middle">SCHOOL</text>
          <path d="M93 91h36v61H93z" fill="#f1b751" />
          <path d="M39 84h31v31H39zM150 84h31v31h-31z" fill="#9bd7fa" stroke="#fff" strokeWidth="5" />
          <path d="M47 84v31M62 84v31M39 99h31M158 84v31M173 84v31M150 99h31" stroke="#fff" strokeWidth="3" />
          <path d="M103 104h16v48h-16z" fill="#d68d32" />
          <circle cx="115" cy="129" r="2" fill="#fff" />
          <path d="M14 152h193" stroke="#73b95a" strokeWidth="6" strokeLinecap="round" />
          <path d="M31 151c2-19 11-28 19-28s16 9 18 28M157 151c2-19 11-28 19-28s16 9 18 28" fill="#84c86b" />
          <path d="M48 123v29M174 123v29" stroke="#855c37" strokeWidth="4" />
        </svg>
      </div>
    </div>
  );
}

function SchoolEnquirySuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const copyTimer = useRef(null);
  const [copied, setCopied] = useState(false);
  const enquiry = location.state || {};
  const schoolName = String(enquiry.schoolName || "").trim();
  const principalName = String(enquiry.principalName || "").trim();
  const submittedAt = enquiry.submittedAt || "";
  const formattedDate = useMemo(() => formatSubmittedDate(submittedAt), [submittedAt]);
  const enquiryReference = useMemo(
    () => formatEnquiryReference(enquiry.enquiryId),
    [enquiry.enquiryId]
  );

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const copyEnquiryReference = async () => {
    if (!enquiryReference) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(enquiryReference);
      } else {
        const input = document.createElement("textarea");
        input.value = enquiryReference;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        const copiedToClipboard = document.execCommand("copy");
        input.remove();
        if (!copiedToClipboard) throw new Error("Clipboard access is unavailable.");
      }
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch (_error) {
      toast.error("Unable to copy the enquiry ID. Please select and copy it manually.");
    }
  };

  const nextSteps = [
    {
      title: "Enquiry Received",
      description: "Your enquiry has been successfully submitted to Unified Council.",
      Icon: FileCheck2,
      style: "uc-step-blue",
    },
    {
      title: "Our Team Reviews It",
      description: "Our School Relations Team will review the information provided.",
      Icon: ClipboardCheck,
      style: "uc-step-purple",
    },
    {
      title: "We Contact You",
      description: "A team member will contact your school to discuss the next steps.",
      Icon: Phone,
      style: "uc-step-green",
    },
    {
      title: "Get Started",
      description: "We’ll help you understand examinations, registration and available resources.",
      Icon: School,
      style: "uc-step-orange",
    },
  ];

  return (
    <div className="school-enquiry-success-page min-h-screen text-slate-900">
      <Header
        sticky={false}
        stickyUtility
        registerPath="/student-registration-through-school"
        showSchoolsUtility={false}
        showOptionsUtility={false}
        showResultsOnMobile={false}
        navigateToMissingSection={false}
        onResults={() => navigate("/#exams")}
        onRegister={() => navigate("/student-registration-through-school")}
      />

      <main className="uc-success-main">
        <section className="uc-success-hero" aria-labelledby="enquiry-success-title">
          <div className="uc-hero-orb uc-hero-orb-one" aria-hidden="true" />
          <div className="uc-hero-orb uc-hero-orb-two" aria-hidden="true" />
          <div className="uc-hero-grid" aria-hidden="true" />
          <SchoolArtwork />
          <div className="uc-confetti" aria-hidden="true">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className={`uc-confetti-piece uc-confetti-shape-${piece.shape}`}
                style={{
                  "--confetti-left": piece.left,
                  "--confetti-top": piece.top,
                  "--confetti-drift": piece.drift,
                  "--confetti-delay": piece.delay,
                  "--confetti-duration": piece.duration,
                  "--confetti-hue": piece.hue,
                  "--confetti-size": piece.size,
                }}
              />
            ))}
          </div>

          <div className="uc-success-hero-content">
            <div className="uc-success-icon-wrap">
              <span className="uc-success-icon-glow" />
              <span className="uc-success-icon"><Check aria-hidden="true" /></span>
            </div>
            <p className="uc-success-ribbon"><span />Enquiry submitted successfully<span /></p>
            <h1 id="enquiry-success-title">
              {schoolName ? <>Thank You, <span>{schoolName}!</span></> : "Thank You!"}
            </h1>
            {principalName && <p className="uc-success-greeting">Dear {principalName},</p>}
            <p className="uc-success-message">
              Your enquiry has been successfully received. Our School Relations Team will contact you shortly to guide
              you through the next steps.
            </p>
            <p className="uc-success-appreciation">We appreciate your interest in Unified Council!</p>
          </div>
        </section>

        <div className="uc-success-content">
          <section className="uc-enquiry-card" aria-labelledby="enquiry-details-title">
            <div className="uc-enquiry-card-heading">
              <div className="uc-enquiry-heading-title">
                <span className="uc-heading-icon"><BookOpenCheck aria-hidden="true" /></span>
                <h2 id="enquiry-details-title">Enquiry Details</h2>
              </div>
              <span className="uc-enquiry-status"><span />Enquiry Received</span>
            </div>
            <div className="uc-enquiry-details">
              <div className="uc-enquiry-detail">
                <span className="uc-detail-icon uc-detail-blue"><School aria-hidden="true" /></span>
                <div><p>School Name</p><strong>{schoolName || "—"}</strong></div>
              </div>
              <div className="uc-enquiry-detail uc-enquiry-reference">
                <span className="uc-detail-icon uc-detail-rose"><ClipboardCheck aria-hidden="true" /></span>
                <div className="uc-detail-reference-copy">
                  <p>Enquiry ID</p>
                  <strong>{enquiryReference || "—"}</strong>
                </div>
                <button
                  type="button"
                  className="uc-copy-button"
                  onClick={copyEnquiryReference}
                  disabled={!enquiryReference}
                  aria-label={copied ? "Enquiry ID copied" : "Copy enquiry ID"}
                >
                  {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="uc-enquiry-detail">
                <span className="uc-detail-icon uc-detail-purple"><UserRound aria-hidden="true" /></span>
                <div><p>Contact Person</p><strong>{principalName || "—"}</strong></div>
              </div>
              <div className="uc-enquiry-detail">
                <span className="uc-detail-icon uc-detail-violet"><CalendarDays aria-hidden="true" /></span>
                <div><p>Submitted On</p><strong>{formattedDate || "—"}</strong></div>
              </div>
            </div>
          </section>

          <section className="uc-next-section" aria-labelledby="next-steps-title">
            <div className="uc-next-heading">
              <span />
              <h2 id="next-steps-title">What happens next?</h2>
              <ArrowRight aria-hidden="true" />
            </div>
            <div className="uc-next-grid">
              {nextSteps.map(({ title, description, Icon, style }, index) => (
                <article className={`uc-next-step ${style}`} key={title} style={{ "--step-index": index }}>
                  <div className="uc-step-topline">
                    <span className="uc-step-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="uc-step-icon"><Icon aria-hidden="true" /></span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="uc-success-actions">
            <button type="button" className="uc-primary-action" onClick={() => navigate("/")}>
              Explore Unified Council <ArrowRight aria-hidden="true" />
            </button>
            <button type="button" className="uc-secondary-action" onClick={() => navigate("/schools")}>
              <House aria-hidden="true" /> Back to Home
            </button>
          </div>
        </div>

        <div className="uc-success-ribbon-edge" aria-hidden="true" />
      </main>

      <Footer />
    </div>
  );
}

export default SchoolEnquirySuccessPage;
