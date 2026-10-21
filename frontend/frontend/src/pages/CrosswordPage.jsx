import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ChevronRight, Grid3X3, Calculator, Leaf,
  Download, KeyRound, Gamepad2, Users, X
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CROSSWORDS } from "../data/crosswordData";

const CLASSES = [1, 2, 3, 4, 5];

const SUBJECTS = {
  maths: {
    label: "Mathematics", icon: Calculator,
    text: "text-green-600", bg: "bg-green-50", border: "border-green-100",
    light: "bg-green-100", accent: "bg-green-500 hover:bg-green-600",
  },
  science: {
    label: "Science (EVS)", icon: Leaf,
    text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100",
    light: "bg-purple-100", accent: "bg-purple-500 hover:bg-purple-600",
  },
};

const CrosswordPage = () => {
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState(1);
  const [activePuzzle, setActivePuzzle] = useState(null);

  useEffect(() => {
    if (!activePuzzle) return;
    const onKey = (e) => { if (e.key === "Escape") setActivePuzzle(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activePuzzle]);

  useEffect(() => {
    document.title = "Crossword Puzzles | Unified Council";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Free chapter-wise Maths & Science crossword puzzles for classes 1-5 — download PDFs or play online, with answer keys.";
    window.scrollTo(0, 0);
  }, []);

  const topics = CROSSWORDS.filter((c) => c.cls === activeClass);

  return (
    <div className="min-h-screen bg-slate-50" data-testid="crossword-page">
      <Header />

      {/* Hero */}
      <section className="relative py-16 bg-[#FFFBF3] overflow-hidden">
        <div className="absolute top-12 left-8 w-6 h-6 bg-pink-300 rounded-full opacity-60" />
        <div className="absolute top-24 right-16 w-4 h-4 bg-sky-400 rounded-full opacity-50" />
        <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-amber-400 rounded-full opacity-40" />
        <div className="absolute bottom-8 right-10 w-14 h-14 border-4 border-dotted border-pink-300 rounded-full opacity-50" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 justify-center">
            <a href="/" className="hover:text-slate-600">Home</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-700 font-semibold">Crossword Puzzles</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-pink-100 border-2 border-pink-200 rounded-full px-4 py-2 mb-6">
            <Grid3X3 className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-black uppercase tracking-wider text-pink-700">Free Learning Resource</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
            Crossword{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500">
              Puzzles
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-3xl mx-auto mb-8">
            Chapter-wise Maths & Science puzzles in 3 difficulty levels — download the PDF or play
            online, then check your answers with the key!
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white border-2 border-pink-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-pink-600">60</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Puzzles</p>
            </div>
            <div className="bg-white border-2 border-sky-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-sky-600">1-5</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Classes</p>
            </div>
            <div className="bg-white border-2 border-green-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-green-600">2</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Subjects</p>
            </div>
            <div className="bg-white border-2 border-amber-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-amber-600">3</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Difficulty Levels</p>
            </div>
          </div>
        </div>
      </section>

      {/* Class selector + puzzles */}
      <section className="py-12 bg-white" data-testid="crossword-puzzles-section">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Select Your Class</p>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {CLASSES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveClass(c)}
                className={`w-12 h-12 rounded-2xl text-sm font-black border-2 transition-colors ${activeClass === c ? "bg-pink-500 text-white border-pink-500" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                data-testid={`crossword-class-tab-${c}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {["maths", "science"].map((subj) => {
              const theme = SUBJECTS[subj];
              const Icon = theme.icon;
              const subjTopics = topics.filter((t) => t.subject === subj);
              return (
                <div key={subj} data-testid={`crossword-subject-${subj}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 ${theme.light} rounded-2xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${theme.text}`} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800">Class {activeClass} — {theme.label}</h2>
                  </div>

                  <div className="flex flex-col gap-5">
                    {subjTopics.map((topic, ti) => (
                      <div
                        key={ti}
                        className={`bg-white border-2 ${theme.border} rounded-3xl p-6`}
                        data-testid={`crossword-topic-${subj}-${ti}`}
                      >
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Chapter {topic.chapter}</p>
                        <h3 className="font-black text-slate-800 mb-4">{topic.topic}</h3>
                        <div className="flex flex-col gap-2.5">
                          {topic.puzzles.map((p, pi) => (
                            <div key={pi} className={`flex items-center justify-between gap-3 ${theme.bg} rounded-2xl px-4 py-2.5`}>
                              <span className="text-sm font-bold text-slate-700">Puzzle {pi + 1}</span>
                              <div className="flex gap-2">
                                <a
                                  href={p.pdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-1.5 ${theme.accent} text-white text-xs font-bold rounded-full px-3.5 py-1.5 transition-colors`}
                                  data-testid={`puzzle-pdf-${subj}-${ti}-${pi}`}
                                >
                                  <Download className="w-3.5 h-3.5" /> PDF
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setActivePuzzle({
                                    embed: p.embed,
                                    cls: activeClass,
                                    subjectLabel: theme.label,
                                    topic: topic.topic,
                                    num: pi + 1,
                                    keyUrl: topic.key,
                                  })}
                                  className={`inline-flex items-center gap-1.5 bg-white ${theme.text} border-2 ${theme.border} text-xs font-bold rounded-full px-3.5 py-1.5 hover:opacity-80 transition-opacity`}
                                  data-testid={`puzzle-online-${subj}-${ti}-${pi}`}
                                >
                                  <Gamepad2 className="w-3.5 h-3.5" /> Play Online
                                </button>
                              </div>
                            </div>
                          ))}
                          <a
                            href={topic.key}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 mt-1 bg-amber-100 text-amber-700 border-2 border-amber-200 text-xs font-black rounded-full px-4 py-2 hover:bg-amber-200 transition-colors"
                            data-testid={`puzzle-key-${subj}-${ti}`}
                          >
                            <KeyRound className="w-4 h-4" /> Answer Key for All 3 Puzzles
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Teacher note */}
          <div className="mt-12 bg-sky-50 border-2 border-sky-100 rounded-3xl p-8" data-testid="crossword-teacher-note">
            <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" /> A Note for Teachers & Parents
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-2">
              Each chapter comes with puzzles in 3 different difficulty levels. Share them with students over
              WhatsApp, Google Meet, Zoom or Email (one file at a time) to keep them engaged in honing their skills.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Prefer solving on screen? Every PDF puzzle has an online version — just click "Play Online" and share
              the link with your students. More chapters are added periodically!
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Grid3X3 className="w-14 h-14 text-white mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Sharpen Skills, Then Show Them Off!
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Register for our Olympiad exams and turn puzzle power into medals.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="rounded-full font-bold px-10 py-6 text-lg bg-white text-slate-800 hover:bg-slate-100"
            data-testid="crossword-cta-register-btn"
          >
            Register Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />

      {/* Puzzle Popup */}
      {activePuzzle && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActivePuzzle(null)}
          data-testid="puzzle-modal"
        >
          <div
            className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl flex flex-col"
            style={{ height: "88vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b-2 border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 min-w-0 flex-wrap" data-testid="puzzle-modal-title">
                <span className="bg-pink-100 text-pink-700 text-xs font-black rounded-full px-3 py-1">
                  Class {activePuzzle.cls}
                </span>
                <span className="bg-sky-100 text-sky-700 text-xs font-black rounded-full px-3 py-1">
                  {activePuzzle.subjectLabel}
                </span>
                <span className="bg-amber-100 text-amber-700 text-xs font-black rounded-full px-3 py-1">
                  {activePuzzle.topic} · Puzzle {activePuzzle.num}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={activePuzzle.keyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-black rounded-full px-4 py-2 transition-colors"
                  data-testid="puzzle-modal-solution-btn"
                >
                  <KeyRound className="w-4 h-4" /> Solution
                </a>
                <button
                  type="button"
                  onClick={() => setActivePuzzle(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                  aria-label="Close puzzle"
                  data-testid="puzzle-modal-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <iframe
              src={activePuzzle.embed}
              title={`Class ${activePuzzle.cls} ${activePuzzle.subjectLabel} ${activePuzzle.topic} Puzzle ${activePuzzle.num}`}
              className="w-full flex-1 border-0"
              data-testid="puzzle-modal-iframe"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CrosswordPage;
