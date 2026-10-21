import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ChevronRight, Brain, Play,
  MonitorSmartphone, Timer, BarChart3, Handshake
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TESTS = [
  { cls: 1, url: "http://www.yourolympiadcoach.com/ExamsQR/UserDetails.aspx?qpid=4766", color: "bg-sky-50 border-sky-100", iconBg: "bg-sky-100", iconText: "text-sky-600", btn: "bg-sky-500 hover:bg-sky-600" },
  { cls: 2, url: "http://www.yourolympiadcoach.com/ExamsQR/UserDetails.aspx?qpid=4767", color: "bg-green-50 border-green-100", iconBg: "bg-green-100", iconText: "text-green-600", btn: "bg-green-500 hover:bg-green-600" },
  { cls: 3, url: "http://www.yourolympiadcoach.com/ExamsQR/UserDetails.aspx?qpid=4768", color: "bg-amber-50 border-amber-100", iconBg: "bg-amber-100", iconText: "text-amber-600", btn: "bg-amber-500 hover:bg-amber-600" },
  { cls: 4, url: "http://www.yourolympiadcoach.com/ExamsQR/UserDetails.aspx?qpid=4769", color: "bg-pink-50 border-pink-100", iconBg: "bg-pink-100", iconText: "text-pink-600", btn: "bg-pink-500 hover:bg-pink-600" },
  { cls: 5, url: "http://www.yourolympiadcoach.com/ExamsQR/UserDetails.aspx?qpid=4770", color: "bg-purple-50 border-purple-100", iconBg: "bg-purple-100", iconText: "text-purple-600", btn: "bg-purple-500 hover:bg-purple-600" },
];

const AptitudePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Aptitude Tests (UCAT) | Unified Council";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Assess your aptitude with Unified Council Aptitude Tests (UCAT) — free online tests for classes 1-5, in association with Brain Mapping Academy and Olympiad Coach.";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50" data-testid="aptitude-page">
      <Header />

      {/* Hero */}
      <section className="relative py-16 bg-[#FFFBF3] overflow-hidden">
        <div className="absolute top-12 left-8 w-6 h-6 bg-amber-300 rounded-full opacity-60" />
        <div className="absolute top-24 right-16 w-4 h-4 bg-sky-400 rounded-full opacity-50" />
        <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-rose-400 rounded-full opacity-40" />
        <div className="absolute bottom-8 right-10 w-14 h-14 border-4 border-dotted border-amber-300 rounded-full opacity-50" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 justify-center">
            <a href="/" className="hover:text-slate-600">Home</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-700 font-semibold">Aptitude Tests (UCAT)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-200 rounded-full px-4 py-2 mb-6">
            <Brain className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-black uppercase tracking-wider text-amber-700">Free Online Tests</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
            Assess Your Aptitude with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
              UCAT
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-3xl mx-auto mb-8">
            Unified Council Aptitude Tests — fun brain teasers and logical reasoning exercises for
            classes 1-5, taken completely online. Pick your class and start right away!
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white border-2 border-amber-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-amber-600">5</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Class Levels</p>
            </div>
            <div className="bg-white border-2 border-sky-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-sky-600">100%</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Online & Free</p>
            </div>
            <div className="bg-white border-2 border-green-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-green-600">Instant</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Assessment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Test cards */}
      <section className="py-16 bg-white" data-testid="aptitude-tests-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800">
              Pick Your Class & Start the Test
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {TESTS.map((t) => (
              <div
                key={t.cls}
                className={`${t.color} border-2 rounded-3xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300`}
                data-testid={`aptitude-test-card-${t.cls}`}
              >
                <div className={`w-14 h-14 ${t.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Brain className={`w-7 h-7 ${t.iconText}`} />
                </div>
                <h3 className="font-black text-slate-800 text-lg mb-1">Class {t.cls}</h3>
                <p className="text-xs text-slate-500 font-medium mb-4">Aptitude Test</p>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-1.5 ${t.btn} text-white text-sm font-bold rounded-full px-5 py-2.5 w-full transition-colors`}
                  data-testid={`aptitude-start-test-${t.cls}`}
                >
                  <Play className="w-4 h-4" /> Start Test
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MonitorSmartphone className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="font-black text-slate-800 mb-2">Take It Anywhere</h3>
              <p className="text-sm text-slate-500">Works on any device with a browser — computer, tablet or phone.</p>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Timer className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-black text-slate-800 mb-2">Quick & Fun</h3>
              <p className="text-sm text-slate-500">Brain teasers and logical reasoning questions designed for young minds.</p>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-black text-slate-800 mb-2">Know Where You Stand</h3>
              <p className="text-sm text-slate-500">Get an instant sense of your aptitude and areas to sharpen before Olympiads.</p>
            </div>
          </div>

          <div className="bg-sky-50 border-2 border-sky-100 rounded-3xl p-6 text-center" data-testid="aptitude-partners-note">
            <p className="text-slate-600 text-sm font-medium flex items-center justify-center gap-2 flex-wrap">
              <Handshake className="w-5 h-5 text-sky-600" />
              Conducted in association with <span className="font-black text-slate-800">Brain Mapping Academy</span> and <span className="font-black text-slate-800">Olympiad Coach</span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Brain className="w-14 h-14 text-white mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Aced the Aptitude Test?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Take the next step — register for our Olympiad exams and compete nationally!
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="rounded-full font-bold px-10 py-6 text-lg bg-white text-slate-800 hover:bg-slate-100"
            data-testid="aptitude-cta-register-btn"
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

export default AptitudePage;
