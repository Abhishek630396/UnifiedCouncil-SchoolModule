import { Building2, Lightbulb, Microscope, LineChart, Award, Users } from "lucide-react";
import { PageShell } from "../components/PageShell";

const AboutPage = () => (
  <PageShell
    title="About Us"
    seoDescription="Unified Council — a professionally managed progressive organisation in education since 1998, India's first ISO 9001:2015 certified organisation in testing & assessment."
    testId="about-page"
    badge={
      <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-200 rounded-full px-4 py-2 mb-6">
        <Building2 className="w-4 h-4 text-amber-600" />
        <span className="text-sm font-black uppercase tracking-wider text-amber-700">Since 1998</span>
      </div>
    }
    heroTitle={
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
        Making the Younger Generation{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">Stronger</span>
      </h1>
    }
    heroSubtitle="A professionally managed progressive organisation in the field of education — India's 1st ISO 9001:2015 certified organisation in Testing & Assessment."
  >
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <p className="text-slate-600 leading-relaxed text-lg">
          Unified Council was established in the year 1998 by eminent personalities from various fields,
          including academicians of international repute. Since its inception, Unified Council has brought
          together the best brains in the field of education, in an endeavour to make the younger generation
          fundamentally stronger and to nourish their brains for a bright and enterprising future.
        </p>
        <p className="text-slate-600 leading-relaxed text-lg">
          The Unified Council team comprises experienced teachers and professionals with intense involvement
          in school education. Their hands-on experience helps the team create and implement solutions based
          on the actual needs of schools and teachers — built on a strong foundation of curriculum and
          educational research.
        </p>
      </div>
    </section>

    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-rose-50 border-2 border-rose-100 rounded-full px-4 py-2 mb-4">
            <Lightbulb className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-black uppercase tracking-wider text-rose-600">Our Philosophy</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">The Fundamental Revolution</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Exams like IIT-JEE, AIEEE, AIIMS, CAT, SAT, GRE and GMAT test a student's fundamental strengths.
            The need of the hour is to build that fundamental base as strong as possible — this is the
            philosophy behind all our assessment exams.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Microscope, color: "text-sky-600", bg: "bg-sky-100", title: "Scientifically Designed", text: "Question papers prepared after detailed study of CBSE and various State board syllabi." },
            { icon: Lightbulb, color: "text-amber-600", bg: "bg-amber-100", title: "Skills over Rote", text: "We measure how well skills and concepts are learnt — not rote memorisation." },
            { icon: LineChart, color: "text-green-600", bg: "bg-green-100", title: "Diagnostic Reports", text: "Results reveal strengths and weaknesses of each student — and the whole class." },
            { icon: Award, color: "text-rose-600", bg: "bg-rose-100", title: "Practical Improvement", text: "Our diagnostic tests help students practically improve their skills." },
          ].map((f, i) => (
            <div key={i} className="bg-white border-2 border-slate-100 rounded-3xl p-6 text-center" data-testid={`about-feature-${i}`}>
              <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="font-black text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Users className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-4">Trusted Across India & Beyond</h2>
        <p className="text-slate-600 text-lg">
          Lakhs of students from thousands of schools participate in our Olympiads — NSTSE, UIMO, UCO,
          UIEO & UIGKO — every year, making Unified Council a household name in talent assessment.
        </p>
      </div>
    </section>
  </PageShell>
);

export default AboutPage;
