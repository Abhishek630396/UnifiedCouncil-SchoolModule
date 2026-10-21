import { Monitor, Globe, BookOpen, Calculator, Atom, Sigma, Calendar, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const iconMap = {
  Monitor: Monitor,
  Globe: Globe,
  BookOpen: BookOpen,
  Calculator: Calculator,
  Atom: Atom,
  Sigma: Sigma,
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

const ExamCard = ({ exam, onEnroll, index }) => {
  const IconComponent = iconMap[exam.icon] || Monitor;
  const colors = colorClasses[exam.color] || colorClasses.sky;

  return (
    <div
      className={`exam-card relative overflow-hidden rounded-3xl border-2 ${colors.border} bg-white p-6 md:p-8 shadow-sm card-hover animate-slide-up`}
      style={{ animationDelay: `${index * 0.1}s`, "--exam-color": colors.bar.replace("bg-", "").split("-")[0] }}
      data-testid={`exam-card-${exam.id}`}
    >
      {/* Top color bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${colors.bar}`} />

      {/* Icon and Name */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl ${colors.icon} flex items-center justify-center`}>
          <IconComponent className={`w-7 h-7 ${colors.text}`} />
        </div>
        <div className="flex gap-2">
          {exam.offline_date && (
            <Badge className={`${colors.badge} font-semibold text-xs`}>Offline</Badge>
          )}
          {exam.online_date && (
            <Badge className="bg-green-100 text-green-700 font-semibold text-xs">Online</Badge>
          )}
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

      {/* Enroll Button */}
      <Button
        onClick={() => onEnroll(exam)}
        className={`w-full rounded-full font-bold py-6 ${colors.button} text-white`}
        data-testid={`enroll-btn-${exam.id}`}
      >
        Enroll Now
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
