import { Target, Gem, Rocket, Brain, Flag } from "lucide-react";
import { PageShell } from "../components/PageShell";

const MissionPage = () => (
  <PageShell
    title="Our Mission"
    seoDescription="Unified Council's mission — to unearth the hidden talent in the younger generation, making them fundamentally stronger and more competitive."
    testId="mission-page"
    badge={
      <div className="inline-flex items-center gap-2 bg-sky-100 border-2 border-sky-200 rounded-full px-4 py-2 mb-6">
        <Target className="w-4 h-4 text-sky-600" />
        <span className="text-sm font-black uppercase tracking-wider text-sky-700">Our Mission</span>
      </div>
    }
    heroTitle={
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
        Mind Over and{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500">Above Matter!</span>
      </h1>
    }
    heroSubtitle="Our raison d'être — to unearth the hidden talent in the younger generation, making them fundamentally stronger and more competitive."
  >
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {[
            { icon: Gem, color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100", iconBg: "bg-sky-100", title: "Unearth Hidden Talent", text: "Every child has a spark. Our assessments help discover and nurture it early." },
            { icon: Brain, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", iconBg: "bg-amber-100", title: "Fundamentally Stronger", text: "Strong fundamentals prepare students for every competitive exam life throws at them." },
            { icon: Rocket, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", iconBg: "bg-rose-100", title: "More Competitive", text: "A healthy competitive spirit turns young learners into confident achievers." },
          ].map((f, i) => (
            <div key={i} className={`${f.bg} border-2 ${f.border} rounded-3xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300`} data-testid={`mission-card-${i}`}>
              <div className={`w-16 h-16 ${f.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                <f.icon className={`w-8 h-8 ${f.color}`} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">{f.title}</h3>
              <p className="text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          <Flag className="w-12 h-12 text-amber-400 mx-auto mb-5 relative" />
          <p className="text-2xl md:text-3xl font-black text-white leading-snug relative max-w-3xl mx-auto">
            "Paving the way for a prosperous nation — for the future lies in the hands of the younger generation."
          </p>
        </div>
      </div>
    </section>
  </PageShell>
);

export default MissionPage;
