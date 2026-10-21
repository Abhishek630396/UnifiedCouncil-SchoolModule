import { Award, Globe2, Users, Building2 } from "lucide-react";

const iconMap = {
  Award: Award,
  Globe2: Globe2,
  Users: Users,
  Building2: Building2,
};

const colorClasses = [
  { bg: "bg-sky-50", border: "border-sky-100", text: "text-sky-600", icon: "bg-sky-100" },
  { bg: "bg-pink-50", border: "border-pink-100", text: "text-pink-600", icon: "bg-pink-100" },
  { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600", icon: "bg-amber-100" },
  { bg: "bg-green-50", border: "border-green-100", text: "text-green-600", icon: "bg-green-100" },
];

const StatsSection = ({ stats }) => {
  const defaultStats = [
    { label: "ISO Certified", value: "1st", icon: "Award" },
    { label: "Years of Excellence", value: "29+", icon: "Award" },
    { label: "Students Reached", value: "14M+", icon: "Users" },
    { label: "Partner Schools", value: "5000+", icon: "Building2" },
    { label: "Countries", value: "30+", icon: "Globe2" },
  ];
  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-[#1ca3ad] via-[#20a5ae] to-[#2aa8b1] text-white"
      data-testid="stats-section"
    >
      <div className="mx-auto max-w-[940px] px-0 py-0 md:px-1 lg:px-1.5">
        <div className="grid grid-cols-5 divide-x-[0.2px] divide-white/8">
          {displayStats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Award;
            return (
              <div
                key={stat.label}
                className="flex min-w-0 flex-col items-center justify-center px-0.5 py-1.5 text-center md:px-1 lg:px-1.5"
                data-testid={`stat-card-${index}`}
              >
                <div className="mb-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37]/15 md:h-4.5 md:w-4.5">
                  <IconComponent className="h-2 w-2 text-[#D4AF37] md:h-2.25 md:w-2.25" />
                </div>
                <h3 className="text-[0.72rem] font-black leading-none tracking-tight text-[#D4AF37] sm:text-[0.8rem] md:text-[0.95rem] lg:text-[1.05rem]">
                  {stat.value}
                </h3>
                <p className="mt-0.5 text-[4.5px] font-semibold uppercase tracking-[0.03em] text-[#F5D76E] md:text-[5px] lg:text-[6px]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
