import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  IndianRupee,
  GraduationCap,
  School,
  Trophy,
  Medal,
  Award,
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Building2,
  Mail,
  ScrollText,
  MapPin,
  Users,
  Monitor,
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ResultsModal from "../components/ResultsModal";
import { OFFLINE_EXAMS } from "../data/offlineExamData";

const COLOR_TOKENS = {
  purple: {
    grad: "from-purple-600 via-fuchsia-600 to-pink-600",
    softBg: "bg-purple-50",
    softBorder: "border-purple-100",
    text: "text-purple-600",
    chip: "bg-purple-100 text-purple-700",
    solid: "bg-purple-600 hover:bg-purple-700",
    ring: "ring-purple-200",
    accent: "bg-purple-500",
  },
  green: {
    grad: "from-emerald-500 via-green-500 to-teal-500",
    softBg: "bg-emerald-50",
    softBorder: "border-emerald-100",
    text: "text-emerald-600",
    chip: "bg-emerald-100 text-emerald-700",
    solid: "bg-emerald-600 hover:bg-emerald-700",
    ring: "ring-emerald-200",
    accent: "bg-emerald-500",
  },
  sky: {
    grad: "from-sky-500 via-blue-500 to-indigo-500",
    softBg: "bg-sky-50",
    softBorder: "border-sky-100",
    text: "text-sky-600",
    chip: "bg-sky-100 text-sky-700",
    solid: "bg-sky-600 hover:bg-sky-700",
    ring: "ring-sky-200",
    accent: "bg-sky-500",
  },
  pink: {
    grad: "from-pink-500 via-rose-500 to-fuchsia-500",
    softBg: "bg-pink-50",
    softBorder: "border-pink-100",
    text: "text-pink-600",
    chip: "bg-pink-100 text-pink-700",
    solid: "bg-pink-600 hover:bg-pink-700",
    ring: "ring-pink-200",
    accent: "bg-pink-500",
  },
  orange: {
    grad: "from-orange-500 via-amber-500 to-yellow-500",
    softBg: "bg-orange-50",
    softBorder: "border-orange-100",
    text: "text-orange-600",
    chip: "bg-orange-100 text-orange-700",
    solid: "bg-orange-600 hover:bg-orange-700",
    ring: "ring-orange-200",
    accent: "bg-orange-500",
  },
  amber: {
    grad: "from-amber-500 via-yellow-500 to-orange-500",
    softBg: "bg-amber-50",
    softBorder: "border-amber-100",
    text: "text-amber-600",
    chip: "bg-amber-100 text-amber-700",
    solid: "bg-amber-600 hover:bg-amber-700",
    ring: "ring-amber-200",
    accent: "bg-amber-500",
  },
};

const ONLINE_ENROLL_URLS = {
  nstse: "https://register.unifiedcouncil.com/exam/nstse",
  uimo: "https://register.unifiedcouncil.com/exam/uimo",
  uieo: "https://register.unifiedcouncil.com/exam/uieo",
  uco: "https://register.unifiedcouncil.com/exam/uico",
  umo: "https://register.unifiedcouncil.com/exam/umo",
  uigko: "https://register.unifiedcouncil.com/exam/uigko",
};

const SECTION_IDS = [
  "about",
  "eligibility",
  "pattern",
  "syllabus",
  "awards",
  "certificates",
  "how-to-apply",
];

const SectionHeader = ({ icon: Icon, kicker, title, colors }) => (
  <div className="mb-8">
    <div
      className={`inline-flex items-center gap-2 ${colors.softBg} border-2 ${colors.softBorder} rounded-full px-3 py-1 mb-3`}
    >
      <Icon className={`w-4 h-4 ${colors.text}`} />
      <span
        className={`text-xs font-black uppercase tracking-wider ${colors.text}`}
      >
        {kicker}
      </span>
    </div>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
      {title}
    </h2>
  </div>
);

const OfflineExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const exam = OFFLINE_EXAMS[examId];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (exam) {
      document.title = `${exam.name} Offline Exam — ${exam.fullName} | Unified Council`;
    }
  }, [exam]);

  useEffect(() => {
    if (!exam) return undefined;

    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { rootMargin: "-144px 0px -60% 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    const hashSection = document.getElementById(window.location.hash.slice(1));
    if (hashSection) {
      requestAnimationFrame(() => {
        hashSection.scrollIntoView({ block: "start" });
        setActiveSection(hashSection.id);
      });
    }

    return () => observer.disconnect();
  }, [exam]);

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-800 mb-4">
            Offline exam page not found
          </h1>
          <Button onClick={() => navigate("/")} className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back Home
          </Button>
        </div>
      </div>
    );
  }

  const colors = COLOR_TOKENS[exam.color] || COLOR_TOKENS.sky;

  return (
    <div className="min-h-screen bg-white" data-testid={`offline-exam-${examId}`}>
      <Header onResults={() => setShowResults(true)} />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 pt-6 text-sm font-semibold text-slate-500 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-slate-900">
          Home
        </Link>
        <span>›</span>
        <Link to="/options" className="hover:text-slate-900">
          Olympiads
        </Link>
        <span>›</span>
        <span className="text-slate-900">{exam.name} Offline</span>
      </nav>

      {/* HERO */}
      <section
        className={`relative overflow-hidden mt-6 mx-4 md:mx-8 rounded-3xl bg-gradient-to-br ${colors.grad}`}
      >
        {/* decorations */}
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-white/20" />
        <div className="absolute bottom-16 right-24 w-4 h-4 rounded-full bg-white/30" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-4">
              <School className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">
                Offline Exam · Through Your School
              </span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
              {exam.name}
            </h1>
            <p className="text-lg md:text-xl font-bold text-white/90 mb-2">
              {exam.fullName}
            </p>
            <p className="text-base md:text-lg text-white/80 mb-8 max-w-2xl">
              {exam.tagline}
            </p>

            {/* Quick meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <Calendar className="w-4 h-4 mb-1" />
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/70">
                  Offline Date
                </p>
                <p className="text-sm font-black leading-tight">
                  {exam.offlineDates[0]}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <IndianRupee className="w-4 h-4 mb-1" />
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/70">
                  Exam Fee
                </p>
                <p className="text-sm font-black">{exam.fee}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <GraduationCap className="w-4 h-4 mb-1" />
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/70">
                  Classes
                </p>
                <p className="text-sm font-black">{exam.classes}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <Clock className="w-4 h-4 mb-1" />
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/70">
                  Duration
                </p>
                <p className="text-sm font-black">{exam.duration}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Button
                onClick={() => {
                  const el = document.getElementById("how-to-apply");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="rounded-full bg-white text-slate-900 hover:bg-slate-100 font-black px-6 py-6"
                data-testid="offline-apply-btn"
              >
                Apply Through School
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(exam.syllabusPdf, "_blank", "noopener")}
                className="rounded-full border-2 border-white/40 text-white hover:bg-white/10 bg-transparent font-black px-6 py-6"
                data-testid="offline-syllabus-btn"
              >
                <Download className="w-4 h-4 mr-2" /> Syllabus PDF
              </Button>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-6 bg-white/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl min-w-[240px]">
                {exam.logo && (
                  <img
                    src={exam.logo}
                    alt={`${exam.name} logo`}
                    className="w-40 h-40 object-contain mx-auto"
                  />
                )}
                {exam.accentLogo && (
                  <img
                    src={exam.accentLogo}
                    alt={`${exam.name} highlight`}
                    className="mt-4 w-40 h-16 object-contain mx-auto"
                  />
                )}
                <div className="mt-4 text-center">
                  <span
                    className={`inline-block ${colors.chip} rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider`}
                  >
                    {exam.highlight}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUB NAV */}
      <div className="sticky top-16 z-30 bg-white/85 backdrop-blur-md border-b border-slate-100 mt-4">
        <nav className="max-w-7xl mx-auto px-4 py-3 flex gap-1 overflow-x-auto no-scrollbar text-sm font-bold">
          {[
            ["about", "About"],
            ["eligibility", "Eligibility"],
            ["pattern", "Pattern"],
            ["syllabus", "Syllabus"],
            ["awards", "Awards"],
            ["certificates", "Certificates"],
            ...(exam.resultDetails ? [["results", "Results"]] : []),
            ...(exam.zones ? [["zones", "Zones"]] : []),
            ["how-to-apply", "How to Apply"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActiveSection(id)}
              aria-current={activeSection === id ? "location" : undefined}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full transition-colors ${
                activeSection === id
                  ? `${colors.chip} ${colors.text}`
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-16">
        {/* ABOUT */}
        <section id="about" className="scroll-mt-36 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SectionHeader
              icon={Sparkles}
              kicker={`Why ${exam.name}?`}
              title={`What makes ${exam.name} different`}
              colors={colors}
            />
            <div className="space-y-4 text-slate-700 text-[15px] md:text-base leading-relaxed">
              {exam.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Highlights card */}
          <aside
            className={`relative rounded-2xl border-2 ${colors.softBorder} ${colors.softBg} p-6`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors.grad} flex items-center justify-center text-white`}
              >
                <ScrollText className="w-4 h-4" />
              </div>
              <p className="text-sm font-black uppercase tracking-wider text-slate-900">
                Highlights
              </p>
            </div>
            <ul className="space-y-3">
              {exam.highlights.map((h, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <CheckCircle2
                    className={`w-4 h-4 mt-0.5 flex-none ${colors.text}`}
                  />
                  <span className="font-medium">{h}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* ELIGIBILITY + SCHEDULE + FEE + STRUCTURE — 4 cards */}
        <section id="eligibility" className="scroll-mt-36">
          <SectionHeader
            icon={Users}
            kicker="Quick Facts"
            title="Everything at a glance"
            colors={colors}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FactCard
              icon={GraduationCap}
              label="Eligibility"
              value={exam.eligibility}
              colors={colors}
            />
            <FactCard
              icon={Calendar}
              label="Exam Schedule"
              value={exam.offlineDates.join(" & ")}
              colors={colors}
              hint={exam.onlineDate ? `Online exam (direct registration): ${exam.onlineDate}` : "Held in respective schools"}
            />
            <FactCard
              icon={IndianRupee}
              label="Exam Fee"
              value={exam.fee}
              colors={colors}
              hint={exam.feeNote || "Per student"}
            />
            <FactCard
              icon={Building2}
              label="Exam Structure"
              value={exam.structureNote}
              colors={colors}
            />
          </div>
        </section>

        {/* EXAM PATTERN */}
        <section id="pattern" className="scroll-mt-36">
          <SectionHeader
            icon={FileText}
            kicker="Exam Pattern"
            title="Objective — no negative marking"
            colors={colors}
          />

          <div className="rounded-2xl border-2 border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead
                className={`bg-gradient-to-r ${colors.grad} text-white text-left`}
              >
                <tr>
                  <th className="px-4 py-3 font-black">Class</th>
                  <th className="px-4 py-3 font-black">Questions</th>
                  <th className="px-4 py-3 font-black">Marks</th>
                  <th className="px-4 py-3 font-black">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {exam.examPattern.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-black text-slate-900">
                      {row.classes}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {row.questions}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {row.marks}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {row.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Marks division */}
          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {exam.marksDivision.map((block, i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-slate-100 p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <p
                  className={`text-xs uppercase tracking-wider font-black ${colors.text} mb-3`}
                >
                  {block.group}
                </p>
                <ul className="divide-y divide-slate-100">
                  {block.items.map((it, j) => (
                    <li
                      key={j}
                      className="flex items-center justify-between py-2.5 text-sm"
                    >
                      <span className="font-semibold text-slate-800">
                        {it.name}
                      </span>
                      <span
                        className={`text-xs font-black ${colors.chip} rounded-full px-2 py-0.5`}
                      >
                        {it.marks} Marks
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {exam.marksFootnote && (
            <p className="mt-4 text-sm text-slate-600 italic bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
              <strong>Note:</strong> {exam.marksFootnote}
            </p>
          )}
        </section>

        {/* SYLLABUS */}
        <section id="syllabus" className="scroll-mt-36">
          <div
            className={`rounded-3xl border-2 ${colors.softBorder} ${colors.softBg} p-6 md:p-8`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className={`w-5 h-5 ${colors.text}`} />
                <p
                  className={`text-xs uppercase tracking-wider font-black ${colors.text}`}
                >
                  Syllabus
                </p>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                {exam.syllabusPdf ? "Class-specific question papers" : `${exam.name} syllabus`}
              </h3>
              <p className="text-slate-700 font-medium">
                {exam.syllabusPdf
                  ? `Suitable for CBSE, ICSE, ISC and various State Board syllabi. ${exam.syllabusDescription || `Download the official ${exam.name} syllabus PDF for detailed topics.`}`
                  : "Please contact your school for current syllabus details."}
              </p>
            </div>
            {exam.syllabusPdf && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => window.open(exam.syllabusPdf, "_blank", "noopener")}
                  className={`${colors.solid} text-white rounded-full font-black px-6 py-6`}
                  data-testid="offline-syllabus-download"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Syllabus
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* SAMPLE QUESTIONS */}
        {(exam.sampleQuestions?.length > 0 || exam.sampleQuestionsMessage) && (
          <section id="sample-questions">
            <SectionHeader
              icon={FileText}
              kicker="Try Before You Register"
              title="Sample Questions by Class"
              colors={colors}
            />
            {exam.sampleQuestions?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {exam.sampleQuestions.map((sample, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-slate-100 rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
                  data-testid={`offline-sample-question-card-${index}`}
                >
                  <div className={`w-10 h-10 ${colors.chip} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800 mb-3">{sample.label}</h3>
                  <div className="flex flex-col gap-2">
                        {sample.questions ? (
                          <a
                            href={sample.questions}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${colors.accent} text-white inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-full px-3 py-2 hover:opacity-90 transition-opacity`}
                            data-testid={`offline-sample-questions-link-${index}`}
                          >
                            <Download className="w-3.5 h-3.5" /> Questions
                          </a>
                        ) : (
                          <span className={`${colors.accent} text-white opacity-50 inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-full px-3 py-2 cursor-not-allowed`}>
                            <Download className="w-3.5 h-3.5" /> Questions
                          </span>
                        )}
                        {sample.solutions && (
                          <a
                            href={sample.solutions}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${colors.softBg} ${colors.text} border-2 ${colors.softBorder} inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-full px-3 py-2 hover:opacity-80 transition-opacity`}
                            data-testid={`offline-sample-solutions-link-${index}`}
                          >
                            <FileText className="w-3.5 h-3.5" /> Key & Solutions
                          </a>
                        )}
                  </div>
                </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 font-medium">
                {exam.sampleQuestionsMessage}
              </p>
            )}

            {exam.preparationLinks && (
              <div className="mt-8 rounded-3xl border-2 border-slate-100 bg-white p-6 md:p-8">
                <h3 className="text-xl font-black text-slate-900 mb-5 text-center">
                  Looking for More Preparation?
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {exam.preparationLinks.map((link) => {
                    const PreparationIcon = link.icon === "monitor" ? Monitor : link.icon === "book" ? BookOpen : FileText;

                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${colors.softBg} rounded-2xl p-5 text-center border-2 ${colors.softBorder} hover:shadow-md transition-shadow`}
                      >
                        <PreparationIcon className={`w-8 h-8 ${colors.text} mx-auto mb-2`} />
                        <p className="font-bold text-slate-800 text-sm">{link.label}</p>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* AWARDS */}
        <section id="awards" className="scroll-mt-36">
          <SectionHeader
            icon={Trophy}
            kicker="Awards & Prizes"
            title={`What ${exam.name} rankers win`}
            colors={colors}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exam.awards.map((a, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border-2 border-slate-100 bg-white p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.grad} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Trophy className="w-5 h-5" />
                </div>
                <p className={`text-xs font-black uppercase tracking-wider ${colors.text} mb-1`}>
                  {a.rank}
                </p>
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                  {a.prize}
                </p>
              </div>
            ))}
          </div>
        </section>

        {exam.resultDetails && (
          <section id="results">
            <SectionHeader
              icon={FileText}
              kicker="Interpreting Results"
              title="How rankings are determined"
              colors={colors}
            />
            <div className="space-y-3 text-slate-700 text-[15px] md:text-base leading-relaxed">
              {exam.resultDetails.map((detail, index) => (
                <p key={index}>{detail}</p>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATES + INSTITUTIONAL */}
        <section id="certificates" className="scroll-mt-36 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border-2 border-slate-100 bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Medal className={`w-5 h-5 ${colors.text}`} />
              <h3 className="text-xl font-black text-slate-900">
                Certificates & Reports
              </h3>
            </div>
            <ul className="space-y-3">
              {exam.certificates.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-none ${colors.text}`} />
                  <span className="font-medium">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border-2 border-slate-100 bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className={`w-5 h-5 ${colors.text}`} />
              <h3 className="text-xl font-black text-slate-900">
                Institutional Awards
              </h3>
            </div>
            <ul className="space-y-3">
              {exam.institutional.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-none ${colors.text}`} />
                  <span className="font-medium">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {exam.zones && (
          <section id="zones">
            <SectionHeader
              icon={MapPin}
              kicker="Zones"
              title="17 examination zones"
              colors={colors}
            />
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {exam.zones.map((zone, index) => (
                <li
                  key={zone}
                  className="flex items-start gap-3 rounded-xl border-2 border-slate-100 bg-white p-4"
                >
                  <span className={`flex-none font-black ${colors.text}`}>
                    {index + 1}.
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {zone}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* HOW TO APPLY */}
        <section id="how-to-apply" className="scroll-mt-36">
          <SectionHeader
            icon={School}
            kicker="How to Apply"
                title={`Register ${exam.name} through your school`}
            colors={colors}
          />
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {exam.howToApply.slice(0, 4).map((step, i) => (
              <li
                key={i}
                className="relative rounded-2xl border-2 border-slate-100 bg-white p-5"
              >
                <span
                  className={`absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br ${colors.grad} text-white font-black flex items-center justify-center shadow-lg`}
                >
                  {i + 1}
                </span>
                <p className="mt-2 text-sm font-semibold text-slate-800 leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>

          {exam.howToApply.length > 4 && (
            <p className="text-sm text-slate-600 italic bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-6">
              <MapPin className="w-4 h-4 inline mr-1" />
              {exam.howToApply.slice(4).join(" ")}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {exam.schoolFormUrl && (
              <Button
                onClick={() =>
                  window.open(exam.schoolFormUrl, "_blank", "noopener")
                }
                className={`${colors.solid} text-white rounded-full font-black px-6 py-6`}
                data-testid="offline-schoolform-btn"
              >
                <Download className="w-4 h-4 mr-2" /> School Registration Form
              </Button>
            )}
            {exam.sampleQuestionsUrl && (
              <Button
                variant="outline"
                onClick={() =>
                  window.open(exam.sampleQuestionsUrl, "_blank", "noopener")
                }
                className="rounded-full border-2 font-black px-6 py-6"
                data-testid="offline-samples-btn"
              >
                <FileText className="w-4 h-4 mr-2" /> Sample Questions
              </Button>
            )}
            <a
              href="mailto:support@unifiedcouncil.com"
              className="inline-flex items-center gap-2 text-sm font-black text-slate-700 hover:text-slate-900"
            >
              <Mail className="w-4 h-4" /> support@unifiedcouncil.com
            </a>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section>
          <div
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.grad} p-8 md:p-12 text-white`}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="text-xs uppercase tracking-wider font-black text-white/80 mb-2">
                  Ready to enroll?
                </p>
                <h3 className="text-2xl md:text-3xl font-black mb-2">
                  Register your school for {exam.name} {new Date().getFullYear()}-27
                </h3>
                <p className="text-white/85 max-w-2xl">
                  Direct students can also enroll individually for the online exam.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    const enrollUrl = ONLINE_ENROLL_URLS[exam.id];
                    if (enrollUrl) window.location.href = enrollUrl;
                  }}
                  variant="outline"
                  className="rounded-full border-2 border-white/40 text-white bg-transparent hover:bg-white/10 font-black px-6 py-6"
                  data-testid="offline-cta-online"
                >
                  View Online Exam
                </Button>
                <Button
                  onClick={() => window.open("https://school.unifiedcouncil.com/student-registration-through-school", "_blank", "noopener,noreferrer")}
                  className="rounded-full bg-white text-slate-900 hover:bg-slate-100 font-black px-6 py-6"
                  data-testid="offline-cta-register"
                >
                  Enroll Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      {showResults && (
        <ResultsModal
          exams={Object.values(OFFLINE_EXAMS).map(({ id, name }) => ({ id, name }))}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

const FactCard = ({ icon: Icon, label, value, hint, colors }) => (
  <div className="rounded-2xl border-2 border-slate-100 bg-white p-5 hover:shadow-md transition-shadow">
    <div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.grad} flex items-center justify-center text-white mb-3`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <p className="text-[11px] uppercase tracking-wider font-black text-slate-500 mb-1">
      {label}
    </p>
    <p className="text-sm font-black text-slate-900 leading-snug">{value}</p>
    {hint && (
      <p className="text-xs text-slate-500 font-semibold mt-1">{hint}</p>
    )}
  </div>
);

export default OfflineExamPage;
