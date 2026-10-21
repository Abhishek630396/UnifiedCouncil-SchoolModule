import { useNavigate } from "react-router-dom";
import { Download, FileText, School, TrendingUp, Grid3X3, BookOpen, ArrowRight } from "lucide-react";
import { PageShell } from "../components/PageShell";

const DOWNLOADS = [
  {
    title: "NSTSE Prospectus",
    description: "Complete prospectus with exam details, syllabus overview, awards and registration information.",
    url: "https://www.unifiedcouncil.com/documents/NSTSE%20Prospectus-2020-2021_UC%20Site.pdf",
    icon: FileText, color: "bg-sky-50 border-sky-100", iconBg: "bg-sky-100", iconText: "text-sky-600", btn: "bg-sky-500 hover:bg-sky-600",
  },
  {
    title: "School Registration Form",
    description: "Unified Olympiads registration form for schools to enrol their students in our exams.",
    url: "https://www.unifiedcouncil.com/documents/Unified_Olympiads_Form.pdf",
    icon: School, color: "bg-green-50 border-green-100", iconBg: "bg-green-100", iconText: "text-green-600", btn: "bg-green-500 hover:bg-green-600",
  },
];

const MORE_RESOURCES = [
  { title: "Step-Up Series", text: "130+ chapter-wise Maths & Science worksheets with solutions", link: "/stepup", icon: TrendingUp, iconText: "text-sky-600", iconBg: "bg-sky-100" },
  { title: "Crossword Puzzles", text: "60 printable & online puzzles for classes 1-5", link: "/crosswords", icon: Grid3X3, iconText: "text-pink-600", iconBg: "bg-pink-100" },
  { title: "Sample Questions", text: "Free NSTSE sample papers for every class", link: "/exam/nstse", icon: BookOpen, iconText: "text-purple-600", iconBg: "bg-purple-100" },
];

const DownloadsPage = () => {
  const navigate = useNavigate();
  return (
    <PageShell
      title="Downloads"
      seoDescription="Download Unified Council's NSTSE prospectus, school registration forms and other free resources."
      testId="downloads-page"
      badge={
        <div className="inline-flex items-center gap-2 bg-sky-100 border-2 border-sky-200 rounded-full px-4 py-2 mb-6">
          <Download className="w-4 h-4 text-sky-600" />
          <span className="text-sm font-black uppercase tracking-wider text-sky-700">Free Downloads</span>
        </div>
      }
      heroTitle={
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
          Everything You Need,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500">One Click Away</span>
        </h1>
      }
      heroSubtitle="Official prospectus, registration forms and links to all our free practice resources."
    >
      <section className="py-16 bg-white" data-testid="downloads-section">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-6 mb-14">
            {DOWNLOADS.map((d, i) => (
              <div key={i} className={`${d.color} border-2 rounded-3xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300`} data-testid={`download-card-${i}`}>
                <div className={`w-16 h-16 ${d.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <d.icon className={`w-8 h-8 ${d.iconText}`} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{d.title}</h3>
                <p className="text-sm text-slate-600 mb-6">{d.description}</p>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${d.btn} text-white font-bold rounded-full px-6 py-3 transition-colors`}
                  data-testid={`download-btn-${i}`}
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-black text-slate-800 mb-6 text-center">More Free Resources</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {MORE_RESOURCES.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate(r.link)}
                className="group text-left bg-slate-50 border-2 border-slate-100 hover:border-amber-300 rounded-3xl p-5 hover:shadow-md transition-[border-color,box-shadow]"
                data-testid={`downloads-resource-${i}`}
              >
                <div className={`w-11 h-11 ${r.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                  <r.icon className={`w-5 h-5 ${r.iconText}`} />
                </div>
                <h3 className="font-black text-slate-800 text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-slate-500 mb-2">{r.text}</p>
                <span className="inline-flex items-center gap-1 text-amber-600 font-black text-xs group-hover:gap-2 transition-all">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default DownloadsPage;
