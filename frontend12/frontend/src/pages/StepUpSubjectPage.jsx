import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ChevronRight, Calculator, Atom,
  Download, FileText, BookOpen
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { STEPUP_DATA, STEPUP_SUBJECTS } from "../data/stepUpData";

const SUBJECT_THEME = {
  maths: {
    icon: Calculator,
    text: "text-green-600", bg: "bg-green-50", border: "border-green-100",
    light: "bg-green-100", accent: "bg-green-500 hover:bg-green-600",
    activePill: "bg-green-500 text-white border-green-500",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
  },
  science: {
    icon: Atom,
    text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100",
    light: "bg-purple-100", accent: "bg-purple-500 hover:bg-purple-600",
    activePill: "bg-purple-500 text-white border-purple-500",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
  },
};

const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const StepUpSubjectPage = () => {
  const navigate = useNavigate();
  const { subject } = useParams();
  const [activeClass, setActiveClass] = useState("1");

  const meta = STEPUP_SUBJECTS[subject];
  const theme = SUBJECT_THEME[subject];

  useEffect(() => {
    if (!meta) return;
    document.title = `Step-Up ${meta.label} | Unified Council`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "description";
      document.head.appendChild(m);
    }
    m.content = `Free Step-Up ${meta.label} worksheets — challenging chapter-wise questions with solutions for classes 1-10.`;
    window.scrollTo(0, 0);
    setActiveClass("1");
  }, [subject, meta]);

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Subject not found</h1>
          <Button onClick={() => navigate('/stepup')} className="rounded-full" data-testid="stepup-subject-not-found-btn">
            <ArrowLeft className="w-4 h-4 mr-2" /> Step-Up Series
          </Button>
        </div>
      </div>
    );
  }

  const Icon = theme.icon;
  const chapters = STEPUP_DATA[subject][activeClass] || [];

  return (
    <div className="min-h-screen bg-slate-50" data-testid={`stepup-subject-page-${subject}`}>
      <Header />

      {/* Hero */}
      <section className={`relative py-14 ${theme.bg} overflow-hidden`}>
        <div className="absolute top-10 right-12 w-14 h-14 border-4 border-dashed border-white rounded-full opacity-60" />
        <div className="absolute bottom-8 left-10 w-5 h-5 bg-white rounded-full opacity-50" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 justify-center">
            <a href="/" className="hover:text-slate-600">Home</a>
            <ChevronRight className="w-4 h-4" />
            <a href="/stepup" className="hover:text-slate-600">Step-Up Series</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-700 font-semibold">{meta.label}</span>
          </div>

          <div className={`w-20 h-20 ${theme.light} rounded-3xl flex items-center justify-center mx-auto mb-5`}>
            <Icon className={`w-10 h-10 ${theme.text}`} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-3">
            Step-Up <span className={theme.text}>{meta.label}</span>
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            {meta.tagline}. Pick your class and download chapter-wise question papers with solutions — completely free.
          </p>
        </div>
      </section>

      {/* Class selector + chapters */}
      <section className="py-12 bg-white" data-testid="stepup-chapters-section">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Select Your Class</p>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CLASSES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveClass(c)}
                className={`w-12 h-12 rounded-2xl text-sm font-black border-2 transition-colors ${activeClass === c ? theme.activePill : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                data-testid={`class-tab-${c}`}
              >
                {c}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2" data-testid="chapters-heading">
            <BookOpen className={`w-6 h-6 ${theme.text}`} />
            Class {activeClass} — {chapters.length} Chapters
          </h2>

          <div className="flex flex-col gap-4">
            {chapters.map((ch, index) => (
              <div
                key={ch.chapter}
                className={`bg-white border-2 ${theme.border} rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow`}
                data-testid={`chapter-card-${index}`}
              >
                <div className={`w-12 h-12 ${theme.light} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <span className={`font-black ${theme.text}`}>{ch.chapter}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-400 uppercase">Chapter {ch.chapter}</p>
                  <h3 className="font-black text-slate-800">{ch.name}</h3>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={ch.qp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 ${theme.accent} text-white text-sm font-bold rounded-full px-4 py-2 transition-colors`}
                    data-testid={`chapter-qp-${index}`}
                  >
                    <Download className="w-4 h-4" /> Questions
                  </a>
                  <a
                    href={ch.sol}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 ${theme.bg} ${theme.text} border-2 ${theme.border} text-sm font-bold rounded-full px-4 py-2 hover:opacity-80 transition-opacity`}
                    data-testid={`chapter-sol-${index}`}
                  >
                    <FileText className="w-4 h-4" /> Solutions
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Other subject link */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              onClick={() => navigate(subject === "maths" ? "/stepup/science" : "/stepup/maths")}
              className="rounded-full font-bold border-2"
              data-testid="stepup-other-subject-btn"
            >
              Also try Step-Up {subject === "maths" ? "Science" : "Mathematics"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 bg-gradient-to-r ${theme.gradient}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Test Your Skills for Real?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Register for our Olympiad exams and put your Step-Up practice to work.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="rounded-full font-bold px-10 py-6 text-lg bg-white text-slate-800 hover:bg-slate-100"
            data-testid="stepup-subject-cta-register-btn"
          >
            Register Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StepUpSubjectPage;
