import { useNavigate } from "react-router-dom";
import {
  Flame,
  Rocket,
  Camera,
  Download,
  Trophy,
  FileQuestion,
  TrendingUp,
  Grid3X3,
  Brain,
  ClipboardList,
  Medal,
  ArrowUpRight,
} from "lucide-react";

const HotLinks = ({ onResults, onRegister }) => {
  const navigate = useNavigate();

  const links = [
    {
      label: "Register for 2026-27 Olympiads",
      sub: "Enroll in minutes",
      icon: Rocket,
      tag: "New",
      grad: "from-sky-500 to-indigo-500",
      onClick: () => (onRegister ? onRegister() : navigate("/options")),
      testid: "hotlink-register",
    },
    {
      label: "Awards Celebration Photos",
      sub: "2025 highlights",
      icon: Camera,
      tag: "Photos",
      grad: "from-pink-500 to-rose-500",
      onClick: () => navigate("/events/2025"),
      testid: "hotlink-awards",
    },
    {
      label: "Download Certificates & Reports",
      sub: "NSTSE • UIMO • UIEO • UICO",
      icon: Download,
      tag: "Online",
      grad: "from-emerald-500 to-teal-500",
      onClick: () =>
        window.open("https://wheebox.com/unifiedcouncil", "_blank", "noopener,noreferrer"),
      testid: "hotlink-certificates",
    },
    {
      label: "2025-26 Exam Results",
      sub: "Check your rank",
      icon: Trophy,
      tag: "Live",
      grad: "from-amber-500 to-orange-500",
      onClick: () => (onResults ? onResults() : null),
      testid: "hotlink-results",
    },
    {
      label: "NSTSE Sample Questions",
      sub: "Practice PDFs, Class 1-12",
      icon: FileQuestion,
      tag: "Free",
      grad: "from-purple-500 to-fuchsia-500",
      onClick: () => navigate("/exam/nstse"),
      testid: "hotlink-nstse-samples",
    },
    {
      label: "Step-Up Series",
      sub: "Maths & Science • Class 1-10",
      icon: TrendingUp,
      tag: "Popular",
      grad: "from-sky-500 to-cyan-500",
      onClick: () => navigate("/stepup"),
      testid: "hotlink-stepup",
    },
    {
      label: "Crossword Puzzles",
      sub: "Play online • Class 1-5",
      icon: Grid3X3,
      tag: "Fun",
      grad: "from-rose-500 to-pink-500",
      onClick: () => navigate("/crosswords"),
      testid: "hotlink-crosswords",
    },
    {
      label: "Aptitude Test (UCAT)",
      sub: "Brain teasers • Class 1-5",
      icon: Brain,
      tag: "Try Now",
      grad: "from-amber-500 to-yellow-500",
      onClick: () => navigate("/aptitude"),
      testid: "hotlink-aptitude",
    },
    {
      label: "Mock Tests",
      sub: "Real exam feel • Class 1-10",
      icon: ClipboardList,
      tag: "Practice",
      grad: "from-green-500 to-emerald-500",
      onClick: () => navigate("/mocktests"),
      testid: "hotlink-mocktests",
    },
    {
      label: "Young Achievers Gallery",
      sub: "Meet 145+ toppers",
      icon: Medal,
      tag: "Stars",
      grad: "from-orange-500 to-red-500",
      onClick: () => navigate("/achievers"),
      testid: "hotlink-achievers",
    },
  ];

  // Marquee items derived from links (short labels)
  const marquee = [
    "Olympiad Registrations Open",
    "Certificates Live on Wheebox",
    "Awards 2025 Photos",
    "NSTSE Sample Papers",
    "Mock Tests Class 1-10",
    "Crossword Play Online",
    "Aptitude UCAT Free",
    "Step-Up Chapters PDF",
    "Achievers 145+ Stories",
    "Results 2025-26",
  ];

  return (
    <section
      className="relative py-14 md:py-20 overflow-hidden"
      data-testid="hot-links-section"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50" />
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(14,165,233,0.08), transparent 40%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.08), transparent 40%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 border-2 border-red-100 rounded-full px-4 py-2 mb-4">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-sm font-black uppercase tracking-wider text-red-600">
                Hot Links
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              What's <span className="text-gradient">trending</span> right now
            </h2>
            <p className="mt-3 text-base md:text-lg text-slate-600 font-medium max-w-2xl">
              10 shortcuts every parent and student clicks the most this season.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-white border-2 border-slate-100 rounded-full px-4 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Updated daily
            </span>
          </div>
        </div>

        {/* Marquee ticker */}
        <div
          className="relative mb-10 overflow-hidden rounded-full border-2 border-slate-100 bg-white shadow-sm"
          data-testid="hot-links-marquee"
        >
          <div className="absolute inset-y-0 left-0 z-10 flex items-center gap-2 px-4 bg-white pr-6 shadow-[6px_0_10px_-6px_rgba(255,255,255,1)]">
            <Flame className="w-4 h-4 text-red-500" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 whitespace-nowrap">
              Trending
            </span>
          </div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex whitespace-nowrap py-3 pl-40 animate-marquee">
            {[...marquee, ...marquee].map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 mx-3 text-sm font-bold text-slate-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Cards grid — 2 x 5 on lg, 3 on md, 2 on sm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {links.map((item, idx) => {
            const Icon = item.icon;
            const num = String(idx + 1).padStart(2, "0");
            return (
              <button
                key={item.testid}
                onClick={item.onClick}
                data-testid={item.testid}
                className="group relative text-left bg-white rounded-2xl p-4 border-2 border-slate-100 hover:border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
              >
                {/* Corner rank number */}
                <span className="absolute top-3 right-3 text-[11px] font-black tracking-wider text-slate-300 group-hover:text-slate-400">
                  #{num}
                </span>

                {/* Icon block */}
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${item.grad} shadow-md mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>

                {/* Label */}
                <h3 className="text-sm md:text-[15px] font-black text-slate-900 leading-snug pr-6">
                  {item.label}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500 leading-snug">
                  {item.sub}
                </p>

                {/* Footer row */}
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${item.grad}`}
                  >
                    {item.tag}
                  </span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>

                {/* Bottom hover accent line */}
                <span
                  className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${item.grad} transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HotLinks;
