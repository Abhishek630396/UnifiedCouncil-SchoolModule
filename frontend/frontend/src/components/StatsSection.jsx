import { useEffect, useState, useRef } from "react";
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

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const endValue = parseInt(end.replace(/\D/g, ""));
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(endValue * easeOutQuart);
            
            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={countRef} className="counter-number">
      {count}{suffix}
    </span>
  );
};

const StatsSection = ({ stats }) => {
  const defaultStats = [
    { label: "Years of Excellence", value: "25+", icon: "Award" },
    { label: "Trusted Countries", value: "15+", icon: "Globe2" },
    { label: "Million Students", value: "40+", icon: "Users" },
    { label: "Partner Schools", value: "318+", icon: "Building2" },
  ];

  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-16 md:py-24" data-testid="stats-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayStats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Award;
            const colors = colorClasses[index % colorClasses.length];
            
            return (
              <div
                key={stat.label}
                className={`flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl ${colors.bg} border-2 ${colors.border} text-center card-hover animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`stat-card-${index}`}
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${colors.icon} flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-7 h-7 md:w-8 md:h-8 ${colors.text}`} />
                </div>
                <h3 className={`text-4xl md:text-5xl lg:text-6xl font-black ${colors.text} mb-2`}>
                  <CountUp 
                    end={stat.value} 
                    suffix={stat.value.includes("+") ? "+" : ""} 
                  />
                </h3>
                <p className="text-sm md:text-base font-semibold text-slate-600">
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
