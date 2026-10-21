import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Trophy, Sparkles, GraduationCap,
  ChevronRight, Medal, PlayCircle, School, Star, Search, X
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import { Input } from "../components/ui/input";
import Footer from "../components/Footer";
import { WhatsAppIcon } from "../components/WhatsAppIcon";
import { ACHIEVERS, ACHIEVER_EXAMS, ACHIEVER_YEARS } from "../data/achieversData";

const toEmbedUrl = (url) => {
  let id = null;
  let m = url.match(/youtu\.be\/([\w-]+)/);
  if (m) id = m[1];
  if (!id) { m = url.match(/youtube\.com\/shorts\/([\w-]+)/); if (m) id = m[1]; }
  if (!id) { m = url.match(/[?&]v=([\w-]+)/); if (m) id = m[1]; }
  return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : url;
};

const buildWhatsAppUrl = (a) => {
  const rankType = a.year === "2021-22" ? "International Rank" : "All India Rank";
  const mediaLine = a.video
    ? `▶️ Watch ${a.name.split(" ")[0]}'s interview: ${a.video}\n\n`
    : `📸 See the achiever: ${a.photo}\n\n`;
  const text =
    `🏆 *Proud Achiever Alert!*\n\n` +
    `${a.name} of Class ${a.studentClass}, ${a.school} secured *${rankType} ${a.rank}* in *${a.exam}* (${a.year}). 🎉\n\n` +
    mediaLine +
    `Unified Council is India's premier Olympiad organization since 1998, conducting NSTSE, UIMO, UCO & UIEO exams for classes 1-12 to nurture young talent across the country.\n\n` +
    `🌐 Know more: www.unifiedcouncil.com`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

const EXAM_COLORS = {
  NSTSE: { chip: "bg-purple-100 text-purple-700 border-purple-200", active: "bg-purple-500 text-white border-purple-500" },
  UIMO: { chip: "bg-green-100 text-green-700 border-green-200", active: "bg-green-500 text-white border-green-500" },
  UCO: { chip: "bg-sky-100 text-sky-700 border-sky-200", active: "bg-sky-500 text-white border-sky-500" },
  UIEO: { chip: "bg-pink-100 text-pink-700 border-pink-200", active: "bg-pink-500 text-white border-pink-500" },
};

const RANK_STYLES = {
  1: "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900",
  2: "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800",
  3: "bg-gradient-to-r from-orange-400 to-amber-600 text-white",
};

const AchieversPage = () => {
  const navigate = useNavigate();
  const [examFilter, setExamFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e) => { if (e.key === "Escape") setActiveVideo(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  useEffect(() => {
    document.title = "Achievers Gallery | Unified Council";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Meet Unified Council's young achievers — national and international rank holders of NSTSE, UIMO, UCO & UIEO Olympiads.";
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ACHIEVERS.filter((a) =>
      (examFilter === "All" || a.exam === examFilter) &&
      (yearFilter === "All" || a.year === yearFilter) &&
      (!q || a.name.toLowerCase().includes(q) || a.school.toLowerCase().includes(q))
    );
  }, [examFilter, yearFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50" data-testid="achievers-page">
      <Header />

      {/* Hero */}
      <section className="relative py-16 bg-[#FFFBF3] overflow-hidden">
        <div className="absolute top-12 left-8 w-6 h-6 bg-amber-300 rounded-full opacity-60" />
        <div className="absolute top-24 right-16 w-4 h-4 bg-sky-400 rounded-full opacity-50" />
        <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-rose-400 rounded-full opacity-40" />
        <div className="absolute bottom-8 right-10 w-14 h-14 border-4 border-dotted border-sky-300 rounded-full opacity-50" />
        <div className="absolute top-16 right-1/3 text-amber-400 opacity-60"><Star className="w-8 h-8" /></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 justify-center">
            <a href="/" className="hover:text-slate-600">Home</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-700 font-semibold">Achievers Gallery</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-200 rounded-full px-4 py-2 mb-6">
            <Medal className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-black uppercase tracking-wider text-amber-700">Hall of Fame</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
            Our Young{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
              Achievers
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-8">
            Meet the national and international rank holders of NSTSE, UIMO, UCO & UIEO — stars who prove that every kid can shine.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white border-2 border-amber-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-amber-600">{ACHIEVERS.length}+</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Rank Holders</p>
            </div>
            <div className="bg-white border-2 border-sky-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-sky-600">4</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Olympiads</p>
            </div>
            <div className="bg-white border-2 border-rose-100 rounded-2xl px-6 py-3 shadow-sm">
              <p className="text-2xl font-black text-rose-600">2</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Academic Years</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-12 bg-white" data-testid="achievers-gallery-section">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search */}
          <div className="max-w-xl mx-auto mb-8 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, school or city..."
              className="rounded-full border-2 border-slate-200 focus:border-amber-400 pl-12 pr-12 py-6 text-base font-medium"
              data-testid="achievers-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                aria-label="Clear search"
                data-testid="achievers-search-clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Exam filter */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => setExamFilter("All")}
              className={`rounded-full px-5 py-2.5 text-sm font-black border-2 transition-colors ${examFilter === "All" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
              data-testid="filter-exam-all"
            >
              All Exams
            </button>
            {ACHIEVER_EXAMS.map((exam) => (
              <button
                key={exam}
                type="button"
                onClick={() => setExamFilter(exam)}
                className={`rounded-full px-5 py-2.5 text-sm font-black border-2 transition-colors ${examFilter === exam ? EXAM_COLORS[exam].active : `${EXAM_COLORS[exam].chip} hover:opacity-80`}`}
                data-testid={`filter-exam-${exam.toLowerCase()}`}
              >
                {exam}
              </button>
            ))}
          </div>

          {/* Year filter */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              type="button"
              onClick={() => setYearFilter("All")}
              className={`rounded-full px-4 py-1.5 text-xs font-black border-2 transition-colors ${yearFilter === "All" ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-500 border-slate-200 hover:border-amber-300"}`}
              data-testid="filter-year-all"
            >
              All Years
            </button>
            {ACHIEVER_YEARS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYearFilter(y)}
                className={`rounded-full px-4 py-1.5 text-xs font-black border-2 transition-colors ${yearFilter === y ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-500 border-slate-200 hover:border-amber-300"}`}
                data-testid={`filter-year-${y}`}
              >
                {y}
              </button>
            ))}
          </div>

          <p className="text-center text-sm font-bold text-slate-400 mb-8" data-testid="achievers-count">
            Showing {filtered.length} achiever{filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((a, index) => (
              <div
                key={`${a.photo}-${index}`}
                className="group bg-white rounded-3xl overflow-hidden border-2 border-slate-100 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 transition-[transform,border-color,box-shadow] duration-300"
                data-testid={`achiever-card-${index}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={a.photo}
                    alt={a.name}
                    loading="lazy"
                    className="w-full aspect-square object-cover object-top group-hover:scale-105 transition-transform duration-500 bg-slate-100"
                  />
                  <span className={`absolute top-3 left-3 ${RANK_STYLES[a.rank] || "bg-slate-700 text-white"} text-[11px] font-black uppercase tracking-wide rounded-full px-3 py-1 shadow`}>
                    <Trophy className="w-3 h-3 inline mr-1 -mt-0.5" />
                    {a.rankLabel}
                  </span>
                  <span className={`absolute top-3 right-3 border text-[11px] font-black rounded-full px-2.5 py-1 ${EXAM_COLORS[a.exam].chip}`}>
                    {a.exam}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-slate-800 leading-snug mb-1 line-clamp-1">{a.name}</h3>
                  <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" /> Class {a.studentClass} · {a.year}
                  </p>
                  <p className="text-xs text-slate-500 mb-3 flex items-start gap-1 line-clamp-2">
                    <School className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {a.school}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    {a.video ? (
                      <button
                        type="button"
                        onClick={() => setActiveVideo(a)}
                        className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 text-xs font-black"
                        data-testid={`achiever-video-${index}`}
                      >
                        <PlayCircle className="w-4 h-4" /> Watch Video
                      </button>
                    ) : <span />}
                    <a
                      href={buildWhatsAppUrl(a)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-black rounded-full px-3 py-1.5 transition-colors"
                      title={`Share ${a.name}'s achievement on WhatsApp`}
                      data-testid={`achiever-share-${index}`}
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" /> Share
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16" data-testid="achievers-empty-state">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No achievers found. Try a different name, school or filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-14 h-14 text-white mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Want to See Your Photo Here?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Register for our Olympiad exams and join the wall of young achievers!
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="rounded-full font-bold px-10 py-6 text-lg bg-white text-slate-800 hover:bg-slate-100"
            data-testid="achievers-cta-register-btn"
          >
            Register Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
          data-testid="video-modal"
        >
          <button
            type="button"
            onClick={() => setActiveVideo(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close video"
            data-testid="video-modal-close-btn"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
              <iframe
                src={toEmbedUrl(activeVideo.video)}
                title={`${activeVideo.name} interview`}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="video-modal-iframe"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-white font-black" data-testid="video-modal-name">{activeVideo.name}</p>
              <p className="text-white/60 text-sm mb-2">
                {activeVideo.exam} {activeVideo.rankLabel} · Class {activeVideo.studentClass} · {activeVideo.school}
              </p>
              <a
                href={activeVideo.video}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs font-black"
                data-testid="video-modal-youtube-link"
              >
                <PlayCircle className="w-4 h-4" /> Video not playing? Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchieversPage;
