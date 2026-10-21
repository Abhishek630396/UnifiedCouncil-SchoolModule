import { useEffect } from "react";
import { TrendingUp, Grid3X3, Brain, FileText, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const iconMap = {
  TrendingUp: TrendingUp,
  Grid3X3: Grid3X3,
  Brain: Brain,
  FileText: FileText,
};

const colorClasses = {
  sky: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-600",
    icon: "bg-sky-100",
    bar: "bg-sky-500",
  },
  pink: {
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-600",
    icon: "bg-pink-100",
    bar: "bg-pink-500",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    icon: "bg-amber-100",
    bar: "bg-amber-500",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
    icon: "bg-green-100",
    bar: "bg-green-500",
  },
};

const ResourceCard = ({ resource, index }) => {
  const IconComponent = iconMap[resource.icon] || FileText;
  const colors = colorClasses[resource.color] || colorClasses.sky;

  return (
    <div
      className={`resource-card relative overflow-hidden rounded-3xl border-2 ${colors.border} bg-white p-6 md:p-8 card-hover animate-slide-up`}
      style={{ animationDelay: `${index * 0.1}s`, "--resource-color": colors.bar }}
      data-testid={`resource-card-${resource.id}`}
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl ${colors.icon} flex items-center justify-center mb-4`}>
        <IconComponent className={`w-7 h-7 ${colors.text}`} />
      </div>

      {/* Content */}
      <h3 className="text-xl font-black text-slate-800 mb-2">
        {resource.name}
      </h3>
      <p className="text-sm text-slate-500 font-medium mb-3">
        {resource.description}
      </p>

      {/* Classes Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-bold mb-4`}>
        <span>Classes {resource.classes}</span>
      </div>

      {/* CTA */}
      <Button
        variant="ghost"
        className={`w-full justify-between font-bold ${colors.text} hover:${colors.bg}`}
      >
        Explore
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

const ResourcesSection = ({ resources }) => {
  useEffect(() => {
    if (window.location.hash !== "#resources") return undefined;

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById("resources")?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const defaultResources = [
    {
      id: "stepup",
      name: "Step-Up Series",
      description: "Progressive learning materials for classes 1-10",
      classes: "1-10",
      icon: "TrendingUp",
      color: "sky"
    },
    {
      id: "crossword",
      name: "Crossword Puzzles",
      description: "Fun vocabulary building games for young learners",
      classes: "1-5",
      icon: "Grid3X3",
      color: "pink"
    },
    {
      id: "aptitude",
      name: "Aptitude Test",
      description: "Brain teasers and logical reasoning exercises",
      classes: "1-5",
      icon: "Brain",
      color: "amber"
    },
    {
      id: "mocktest",
      name: "Mock Test",
      description: "Practice tests simulating real exam conditions",
      classes: "1-10",
      icon: "FileText",
      color: "green"
    }
  ];

  const displayResources = resources && resources.length > 0 ? resources : defaultResources;

  return (
    <section id="resources" className="py-16 md:py-24" data-testid="resources-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 border-2 border-green-100 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-black uppercase tracking-wider text-green-600">
              Free Learning Tools
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-4">
            Free Resources
          </h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Boost your preparation with our collection of free learning materials and practice tools
          </p>
        </div>

        {/* Resources Grid - Bento Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayResources.map((resource, index) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              index={index}
            />
          ))}
        </div>

        {/* Additional CTA */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full font-bold px-8 border-2 border-slate-200 hover:border-sky-500 hover:text-sky-600"
          >
            View All Resources
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
