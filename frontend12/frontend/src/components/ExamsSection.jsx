import { Calendar, School, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const examLogos = {
  nstse: "/assests/exams/nstse.png",
  uimo: "/assests/exams/uimo.png",
  uieo: "/assests/exams/uieo.png",
  uco: "/assests/exams/uico.png",
  umo: "/assests/exams/umo.png",
  uigko: "/assests/exams/uigko.png",
};

const colorClasses = {
  sky: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-600",
    icon: "bg-sky-100",
    bar: "bg-sky-500",
    badge: "bg-sky-100 text-sky-700",
    button: "bg-sky-500 hover:bg-sky-400",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    icon: "bg-amber-100",
    bar: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700",
    button: "bg-amber-500 hover:bg-amber-400",
  },
  pink: {
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-600",
    icon: "bg-pink-100",
    bar: "bg-pink-500",
    badge: "bg-pink-100 text-pink-700",
    button: "bg-pink-500 hover:bg-pink-400",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
    icon: "bg-green-100",
    bar: "bg-green-500",
    badge: "bg-green-100 text-green-700",
    button: "bg-green-500 hover:bg-green-400",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-600",
    icon: "bg-purple-100",
    bar: "bg-purple-500",
    badge: "bg-purple-100 text-purple-700",
    button: "bg-purple-500 hover:bg-purple-400",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    icon: "bg-orange-100",
    bar: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700",
    button: "bg-orange-500 hover:bg-orange-400",
  },
};

const OFFLINE_PAGES = new Set(["nstse", "uimo", "uco", "uieo", "umo", "uigko"]);

const ENROLL_URLS = {
  nstse: "https://register.unifiedcouncil.com/exam/nstse",
  uimo: "https://register.unifiedcouncil.com/exam/uimo",
  uieo: "https://register.unifiedcouncil.com/exam/uieo",
  uco: "https://register.unifiedcouncil.com/exam/uico",
  umo: "https://register.unifiedcouncil.com/exam/umo",
  uigko: "https://register.unifiedcouncil.com/exam/uigko",
};

const ExamCard = ({ exam, onEnroll, index }) => {
  const colors = colorClasses[exam.color] || colorClasses.sky;
  const navigate = useNavigate();

  const goOffline = () => {
    if (exam.offline_available === false) return;

    if (OFFLINE_PAGES.has(exam.id)) {
      navigate(`/exam/${exam.id}/offline`);
      return;
    }

    const fallbackUrl = ENROLL_URLS[exam.id];
    if (fallbackUrl) {
      window.location.href = fallbackUrl;
      return;
    }

    navigate(`/exam/${exam.id}`);
  };

  const isOnlineAvailable = Boolean(exam.online_date || ENROLL_URLS[exam.id]);
  const isOfflineAvailable = exam.offline_available ?? Boolean(exam.offline_date || ENROLL_URLS[exam.id]);

  return (
    <div
      className={`exam-card relative overflow-hidden rounded-3xl border-2 ${colors.border} bg-white p-6 md:p-8 shadow-sm card-hover animate-slide-up flex h-full flex-col`}
      style={{ animationDelay: `${index * 0.1}s`, "--exam-color": colors.bar.replace("bg-", "").split("-")[0] }}
      data-testid={`exam-card-${exam.id}`}
    >
      <div className="flex-1">
        {/* Top color bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${colors.bar}`} />

        {/* Icon and Name */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl ${colors.icon} flex items-center justify-center`}>
          <img
            src={examLogos[exam.id]}
            alt={`${exam.name} logo`}
            className="w-full h-full rounded-2xl object-contain p-1"
            loading="lazy"
          />
        </div>
      </div>

      {/* Exam Name */}
      <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-1">
        {exam.name}
      </h3>
      <p className="text-sm text-slate-500 font-medium mb-3">
        {exam.full_name}
      </p>

      {/* Subject & Classes */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-bold`}>
          {exam.subject}
        </div>
        <span className="text-sm text-slate-500">Classes {exam.classes}</span>
      </div>

      {/* Dates */}
      <div className="space-y-2 mb-6">
        {exam.offline_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">
              <span className="font-semibold text-sky-600">Offline:</span> {exam.offline_date}
            </span>
          </div>
        )}
        {exam.online_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">
              <span className="font-semibold text-green-600">Online:</span> {exam.online_date}
            </span>
          </div>
        )}
      </div>

      </div>

      {/* Enroll Buttons — Online + Offline */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button
          onClick={() => {
            if (isOnlineAvailable) {
              const url = ENROLL_URLS[exam.id] || "https://register.unifiedcouncil.com/exam/nstse";
              window.location.href = url;
            }
          }}
          disabled={!isOnlineAvailable}
          className={`rounded-full font-bold py-5 ${colors.button} text-white disabled:opacity-40 disabled:cursor-not-allowed`}
          data-testid={`enroll-online-btn-${exam.id}`}
        >
          <Wifi className="w-4 h-4 mr-1.5" />
          Enroll Online
        </Button>
        <Button
          onClick={goOffline}
          disabled={!isOfflineAvailable}
          variant="outline"
          className={`rounded-full font-bold py-5 border-2 ${colors.border} ${colors.text} hover:${colors.bg} disabled:opacity-40 disabled:cursor-not-allowed bg-white`}
          data-testid={`enroll-offline-btn-${exam.id}`}
        >
          <School className="w-4 h-4 mr-1.5" />
          Enroll Offline
        </Button>
      </div>
    </div>
  );
};

const ExamsSection = ({ exams, onEnroll }) => {
  return (
    <section id="exams" className="py-16 md:py-24 bg-slate-50/50" data-testid="exams-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-100 rounded-full px-4 py-2 mb-4">
            <span className="text-2xl">🎮</span>
            <span className="text-sm font-black uppercase tracking-wider text-amber-600">
              Choose Your Quest
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-4">
            Olympiad Examinations
          </h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Select from our range of competitive exams designed to challenge and inspire young minds
          </p>
        </div>

        {/* Exams Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {exams.map((exam, index) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onEnroll={onEnroll}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExamsSection;
