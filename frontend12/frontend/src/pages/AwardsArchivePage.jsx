import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Calendar, MapPin, Trophy, Sparkles,
  Users, Camera, ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AWARDS_EVENTS, AWARDS_YEARS, yearUrl } from "../data/awardsEventsData";

const AwardsArchivePage = () => {
  const navigate = useNavigate();
  const yearsDesc = [...AWARDS_YEARS].sort((a, b) => b - a);
  const latest = AWARDS_EVENTS[yearsDesc[0]];
  const olderYears = yearsDesc.slice(1);

  useEffect(() => {
    document.title = "Awards Celebrations Archive | Unified Council";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Browse Unified Council's Annual Awards Celebrations through the years — photos, chief guests and memories from 2001 to 2025.";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50" data-testid="awards-archive-page">
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
            <span className="text-slate-700 font-semibold">All Celebrations</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-black uppercase tracking-wider text-amber-700">Events Archive</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
            Celebrations{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
              Through the Years
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
            Over two decades of honouring India's brightest young minds. Pick a year and relive the memories.
          </p>
        </div>
      </section>

      {/* Featured latest year */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <button
            type="button"
            onClick={() => navigate(yearUrl(latest.year))}
            className="group w-full text-left bg-slate-900 rounded-[2rem] overflow-hidden border-2 border-slate-800 hover:border-amber-400/60 transition-colors grid md:grid-cols-2"
            data-testid={`archive-year-card-${latest.year}`}
          >
            <div className="relative overflow-hidden">
              <img
                src={latest.gallery[0]}
                alt={`Awards Celebrations ${latest.year}`}
                loading="lazy"
                className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-xs font-black uppercase tracking-wider rounded-full px-4 py-1.5 shadow-lg">
                Latest Event
              </div>
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                {latest.year}
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed line-clamp-3">{latest.intro}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="inline-flex items-center gap-2 text-amber-300 text-sm font-bold">
                  <Calendar className="w-4 h-4" /> {latest.dateText}
                </span>
                <span className="inline-flex items-center gap-2 text-sky-300 text-sm font-bold">
                  <MapPin className="w-4 h-4" /> {latest.venueShort}
                </span>
                <span className="inline-flex items-center gap-2 text-rose-300 text-sm font-bold">
                  <Users className="w-4 h-4" /> {latest.dignitaries.length} Chief Guests
                </span>
                <span className="inline-flex items-center gap-2 text-emerald-300 text-sm font-bold">
                  <Camera className="w-4 h-4" /> {latest.gallery.length} Photos
                </span>
              </div>
              <span className="inline-flex items-center gap-2 text-white font-black group-hover:text-amber-300 transition-colors">
                View Celebrations <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Year timeline grid */}
      <section className="py-12 bg-white" data-testid="archive-timeline">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-sky-50 border-2 border-sky-100 rounded-full px-4 py-2 mb-4">
              <Trophy className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-black uppercase tracking-wider text-sky-600">Timeline</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800">
              Jump to Any Year
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {olderYears.map((y) => {
              const ev = AWARDS_EVENTS[y];
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => navigate(yearUrl(y))}
                  className="group text-left bg-white rounded-3xl overflow-hidden border-2 border-slate-100 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 transition-[transform,border-color,box-shadow] duration-300"
                  data-testid={`archive-year-card-${y}`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={ev.gallery[0]}
                      alt={`Awards Celebrations ${y}`}
                      loading="lazy"
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-3xl font-black text-white drop-shadow">{y}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs font-bold text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" /> {ev.dateText}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sky-500" /> {ev.venueShort}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 text-xs font-bold text-slate-400">
                        {ev.dignitaries.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {ev.dignitaries.length} Guests
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5" /> {ev.gallery.length} Photos
                        </span>
                      </div>
                      <span className="text-amber-600 font-black text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        View <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-slate-400 text-sm mt-8">
            No awards functions were held in 2003 and 2020–2024.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Trophy className="w-14 h-14 text-white mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Your Year Could Be Next!
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Register for our Olympiad exams and get a chance to shine at the next Awards Celebrations.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="rounded-full font-bold px-10 py-6 text-lg bg-white text-slate-800 hover:bg-slate-100"
            data-testid="archive-cta-register-btn"
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

export default AwardsArchivePage;
