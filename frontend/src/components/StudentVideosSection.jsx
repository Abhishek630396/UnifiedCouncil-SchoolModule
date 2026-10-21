import { useEffect, useRef, useState } from "react";
import { Play, X, ChevronLeft, ChevronRight, Video, Sparkles } from "lucide-react";

const VIDEOS = [
  {
    id: "8IH_sCT5Zoo",
    title: "From small town to national ranks",
    person: "NSTSE Achiever",
    tag: "Rank Holder",
    accent: "from-purple-500 to-fuchsia-500",
  },
  {
    id: "ID3jpPbGVmY",
    title: "How Olympiads changed my child",
    person: "Proud Parent",
    tag: "Parent Story",
    accent: "from-pink-500 to-rose-500",
  },
  {
    id: "lnor5DcErps",
    title: "The confidence Unified gave me",
    person: "UIMO Topper",
    tag: "Maths Champion",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    id: "Let4X8yJaKs",
    title: "A journey worth celebrating",
    person: "Award Winner",
    tag: "National Rank",
    accent: "from-amber-500 to-orange-500",
  },
  {
    id: "LuPxs9SfKyo",
    title: "Meet our shining star",
    person: "Young Achiever",
    tag: "Star Student",
    accent: "from-sky-500 to-indigo-500",
  },
  {
    id: "1l82zf6ngk8",
    title: "A teacher's honest review",
    person: "School Coordinator",
    tag: "Teacher Voice",
    accent: "from-cyan-500 to-blue-500",
  },
];

const StudentVideosSection = () => {
  const railRef = useRef(null);
  const [active, setActive] = useState(null);

  // Auto-scroll (subtle) until user interacts
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let paused = false;
    let raf;
    const step = () => {
      if (!paused && rail) {
        rail.scrollLeft += 0.4;
        if (rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1) {
          rail.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);
    rail.addEventListener("mouseenter", onEnter);
    rail.addEventListener("mouseleave", onLeave);
    rail.addEventListener("touchstart", onEnter, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      rail.removeEventListener("mouseenter", onEnter);
      rail.removeEventListener("mouseleave", onLeave);
      rail.removeEventListener("touchstart", onEnter);
    };
  }, []);

  // Close modal on Esc
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const scrollBy = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      data-testid="student-videos-section"
    >
      {/* Ambient gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-fuchsia-500/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-white">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 md:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4 backdrop-blur">
              <Video className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-black uppercase tracking-wider">
                Student Voices
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-1" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                Live
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Real stories from real{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-sky-400">
                achievers
              </span>
            </h2>
            <p className="mt-3 text-slate-300 font-medium md:text-lg">
              Hear it straight from our students, parents and teachers — six honest
              stories, one tap away.
            </p>
          </div>

          {/* Arrows (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollBy(-1)}
              className="w-11 h-11 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Scroll left"
              data-testid="videos-scroll-left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="w-11 h-11 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Scroll right"
              data-testid="videos-scroll-right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Rail */}
        <div className="relative -mx-4 md:-mx-8">
          {/* edge fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-slate-950 to-transparent z-10" />

          <div
            ref={railRef}
            className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-8 py-6"
            data-testid="videos-rail"
          >
            {[...VIDEOS, ...VIDEOS].map((v, i) => (
              <VideoCard
                key={`${v.id}-${i}`}
                video={v}
                onOpen={() => setActive(v)}
                testid={`video-card-${v.id}-${i}`}
              />
            ))}
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs font-semibold text-slate-500 mt-2">
          <Sparkles className="w-3 h-3 inline mr-1 text-amber-400" />
          Auto-scrolling · hover to pause · tap any card to watch
        </p>
      </div>

      {/* MODAL */}
      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setActive(null)}
          data-testid="video-modal"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${active.accent}`}
                >
                  {active.tag}
                </span>
                <p className="text-sm font-black truncate">{active.title}</p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
                aria-label="Close video"
                data-testid="video-modal-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0&modestbranding=1`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <p className="mt-3 text-center text-xs font-semibold text-slate-400">
              Press <span className="font-black text-white">Esc</span> or tap outside to close
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

const VideoCard = ({ video, onOpen, testid }) => {
  const [thumb, setThumb] = useState(
    `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`
  );

  return (
    <button
      onClick={onOpen}
      data-testid={testid}
      className="group relative flex-none w-[260px] sm:w-[300px] md:w-[320px] snap-start text-left"
    >
      {/* Gradient border ring */}
      <div
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br ${video.accent} opacity-70 group-hover:opacity-100 blur-sm group-hover:blur-md transition-all`}
      />

      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
        {/* Thumbnail */}
        <div className="relative aspect-[9/12]">
          <img
            src={thumb}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() =>
              setThumb(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`)
            }
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          {/* Live pulse ring */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/95 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              Playing
            </span>
          </div>

          {/* Tag */}
          <span
            className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${video.accent}`}
          >
            {video.tag}
          </span>

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <span
                className={`absolute inset-0 rounded-full bg-white/30 animate-ping`}
              />
              <span
                className={`relative w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform`}
              >
                <Play className="w-7 h-7 ml-1" fill="currentColor" />
              </span>
            </div>
          </div>

          {/* Bottom text */}
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="text-xs font-black uppercase tracking-widest text-white/70">
              {video.person}
            </p>
            <h3 className="text-base md:text-lg font-black leading-snug mt-0.5 line-clamp-2">
              {video.title}
            </h3>
          </div>
        </div>
      </div>
    </button>
  );
};

export default StudentVideosSection;
