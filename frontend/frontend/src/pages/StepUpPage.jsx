import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, TrendingUp, Sparkles, ChevronRight,
  Calculator, Atom, Target, Lightbulb, Trophy, BookOpen
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const StepUpPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Step-Up Series | Unified Council";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Unified Council's free Step-Up Series — challenging chapter-wise Mathematics & Science questions for classes 1-10 to prepare for Olympiads.";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50" data-testid="stepup-page">
      <Header />

      {/* Hero */}
      <section className="relative py-16 bg-[#FFFBF3] overflow-hidden">
        <div className="absolute top-12 left-8 w-6 h-6 bg-amber-300 rounded-full opacity-60" />
        <div className="absolute top-24 right-16 w-4 h-4 bg-sky-400 rounded-full opacity-50" />
        <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-rose-400 rounded-full opacity-40" />
        <div className="absolute bottom-8 right-10 w-14 h-14 border-4 border-dotted border-sky-300 rounded-full opacity-50" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 justify-center">
            <a href="/" className="hover:text-slate-600">Home</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-700 font-semibold">Step-Up Series</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-sky-100 border-2 border-sky-200 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-black uppercase tracking-wider text-sky-700">Free Learning Resource</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
            Unified Council's{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500">
              STEP-UP
            </span>{" "}
            Series
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-3xl mx-auto mb-8">
            Challenging questions per chapter, class-wise, that encourage students to apply concepts
            learned in focus lessons — and step up their Olympiad game.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white border-2 border-sky-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-sky-600">2</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Subjects</p>
            </div>
            <div className="bg-white border-2 border-green-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-green-600">1-10</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Classes</p>
            </div>
            <div className="bg-white border-2 border-amber-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-amber-600">130+</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Chapter Worksheets</p>
            </div>
            <div className="bg-white border-2 border-rose-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-rose-600">100%</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Free with Solutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subject cards */}
      <section className="py-16 bg-white" data-testid="stepup-subjects-section">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <button
              type="button"
              onClick={() => navigate('/stepup/maths')}
              className="group text-left bg-green-50 border-2 border-green-100 hover:border-green-400 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-[transform,border-color,box-shadow] duration-300"
              data-testid="stepup-maths-card"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Mathematics</h2>
              <p className="text-slate-600 mb-5">
                7 chapters per class with tricky problems on numbers, geometry, algebra and more — with step-by-step solutions.
              </p>
              <span className="inline-flex items-center gap-2 text-green-600 font-black group-hover:gap-3 transition-all">
                Explore Maths Step-Up <ArrowRight className="w-5 h-5" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/stepup/science')}
              className="group text-left bg-purple-50 border-2 border-purple-100 hover:border-purple-400 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-[transform,border-color,box-shadow] duration-300"
              data-testid="stepup-science-card"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Atom className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Science</h2>
              <p className="text-slate-600 mb-5">
                6 chapters per class covering living things, matter, energy and beyond — with detailed solutions.
              </p>
              <span className="inline-flex items-center gap-2 text-purple-600 font-black group-hover:gap-3 transition-all">
                Explore Science Step-Up <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Why Step-Up */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-100 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-black uppercase tracking-wider text-amber-600">Why Step-Up?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800">
              Built to Make Young Minds Think
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="font-black text-slate-800 mb-2">Systematic Thinking</h3>
              <p className="text-sm text-slate-500">Questions direct students to think systematically and apply their knowledge effectively.</p>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-black text-slate-800 mb-2">Olympiad Ready</h3>
              <p className="text-sm text-slate-500">Nourishes the ability to face Olympiads and other competitive exams, yielding better results.</p>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-black text-slate-800 mb-2">Always Growing</h3>
              <p className="text-sm text-slate-500">New chapters are added periodically — keep visiting so you don't miss them!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BookOpen className="w-14 h-14 text-white mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Practice Today, Top the Olympiad Tomorrow!
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Combine Step-Up practice with our Olympiad exams for the best results.
          </p>
          <Button
            size="lg"
            onClick={() => window.open('https://register.unifiedcouncil.com/options')}
            className="rounded-full font-bold px-10 py-6 text-lg bg-white text-slate-800 hover:bg-slate-100"
            data-testid="stepup-cta-register-btn"
          >
            Register for Olympiads
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StepUpPage;
