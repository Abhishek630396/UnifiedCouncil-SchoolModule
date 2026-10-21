import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ChevronRight, FileText, Play,
  ClipboardCheck, Timer, BarChart3, Sparkles
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MOCK_TESTS } from "../data/mockTestData";

const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const MockTestPage = () => {
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState("1");

  useEffect(() => {
    document.title = "Mock Tests | Unified Council";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Free online Mathematics mock tests for classes 1-10 — chapter-wise practice simulating real Olympiad exam conditions.";
    window.scrollTo(0, 0);
  }, []);

  const tests = MOCK_TESTS[activeClass] || [];
  const totalTests = Object.values(MOCK_TESTS).reduce((n, t) => n + t.length, 0);

  return (
    <div className="min-h-screen bg-slate-50" data-testid="mocktest-page">
      <Header />

      {/* Hero */}
      <section className="relative py-16 bg-[#FFFBF3] overflow-hidden">
        <div className="absolute top-12 left-8 w-6 h-6 bg-green-300 rounded-full opacity-60" />
        <div className="absolute top-24 right-16 w-4 h-4 bg-sky-400 rounded-full opacity-50" />
        <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-amber-400 rounded-full opacity-40" />
        <div className="absolute bottom-8 right-10 w-14 h-14 border-4 border-dotted border-green-300 rounded-full opacity-50" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 justify-center">
            <a href="/" className="hover:text-slate-600">Home</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-700 font-semibold">Mock Tests</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-green-100 border-2 border-green-200 rounded-full px-4 py-2 mb-6">
            <ClipboardCheck className="w-4 h-4 text-green-600" />
            <span className="text-sm font-black uppercase tracking-wider text-green-700">Free Online Practice</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
            Mathematics{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
              Mock Tests
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-3xl mx-auto mb-8">
            Chapter-wise practice tests simulating real exam conditions — pick your class,
            start a test online and see where you stand before the Olympiad.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white border-2 border-green-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-green-600">{totalTests}</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Mock Tests</p>
            </div>
            <div className="bg-white border-2 border-sky-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-sky-600">1-10</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Classes</p>
            </div>
            <div className="bg-white border-2 border-amber-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-amber-600">100%</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Online & Free</p>
            </div>
          </div>
        </div>
      </section>

      {/* Class selector + tests */}
      <section className="py-12 bg-white" data-testid="mocktest-tests-section">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Select Your Class</p>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CLASSES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveClass(c)}
                className={`w-12 h-12 rounded-2xl text-sm font-black border-2 transition-colors ${activeClass === c ? "bg-green-500 text-white border-green-500" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                data-testid={`mocktest-class-tab-${c}`}
              >
                {c}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2" data-testid="mocktest-heading">
            <FileText className="w-6 h-6 text-green-600" />
            Class {activeClass} Mathematics — {tests.length} Tests
          </h2>

          <div className="flex flex-col gap-4">
            {tests.map((t, index) => (
              <div
                key={index}
                className="bg-white border-2 border-green-100 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow"
                data-testid={`mocktest-card-${index}`}
              >
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="font-black text-green-600">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-400 uppercase">Test {index + 1}</p>
                  <h3 className="font-black text-slate-800">{t.name}</h3>
                </div>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-full px-6 py-2.5 flex-shrink-0 transition-colors"
                  data-testid={`mocktest-start-${index}`}
                >
                  <Play className="w-4 h-4" /> Start Test
                </a>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-amber-50 border-2 border-amber-100 rounded-3xl p-6 text-center" data-testid="mocktest-note">
            <p className="text-slate-600 text-sm font-medium flex items-center justify-center gap-2 flex-wrap">
              <Sparkles className="w-5 h-5 text-amber-500" />
              More tests are added in the coming weeks — keep visiting so you don't miss them!
            </p>
          </div>
        </div>
      </section>

      {/* Why mock tests */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-black text-slate-800 mb-2">Real Exam Feel</h3>
              <p className="text-sm text-slate-500">Practice in conditions that simulate the actual Olympiad experience.</p>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Timer className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="font-black text-slate-800 mb-2">Chapter-Wise</h3>
              <p className="text-sm text-slate-500">Focused tests covering small groups of chapters so you master each topic.</p>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-black text-slate-800 mb-2">Instant Feedback</h3>
              <p className="text-sm text-slate-500">Know your score right away and identify areas that need more practice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ClipboardCheck className="w-14 h-14 text-white mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Practiced Enough? Prove It!
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Register for our Olympiad exams and turn practice into national ranks.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="rounded-full font-bold px-10 py-6 text-lg bg-white text-slate-800 hover:bg-slate-100"
            data-testid="mocktest-cta-register-btn"
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

export default MockTestPage;
