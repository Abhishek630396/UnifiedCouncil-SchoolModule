import { useEffect } from "react";
import { Download, FileText } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/SchoolsFooter";

const DOWNLOAD_RESOURCES = [
  { title: "UIGKO Syllabus", href: "/assests/downloads/UIGKO_Syllabus.pdf" },
  { title: "UIEO Syllabus", href: "/assests/downloads/UIEO_Syllabus.pdf" },
  { title: "UICO Syllabus", href: "/assests/downloads/UICO_Syllabus.pdf" },
  { title: "NSTSE Syllabus", href: "/assests/downloads/NSTSE_Syllabus.pdf" },
  {
    title: "Unified Olympiads 2026–27 Brochure",
    href: "/assests/downloads/UC_Olympiads_2026-27_Brochure.pdf",
  },
  {
    title: "Unified Olympiads 2026–27 Poster",
    href: "/assests/downloads/Unified_Olympiads_2026-27_Poster.pdf",
  },
  {
    title: "Unified Olympiads 2026–27 Registration Form",
    href: "/assests/downloads/Unified_Olympiads_2026-27_Registration_Form.pdf",
  },
];

function DownloadsPage() {
  useEffect(() => {
    document.title = "Olympiad Syllabus — Unified Council";
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-sky-700 shadow-sm">
              <Download className="h-4 w-4" aria-hidden="true" />
              Learning resources
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
              Olympiad Syllabus
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-slate-600 md:text-lg">
              Browse Olympiad syllabi, brochures, posters, and registration forms.
            </p>
          </div>

          <section className="mb-12" aria-labelledby="downloads-resources-heading">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
                Syllabi and documents
              </p>
              <h2 id="downloads-resources-heading" className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">
                Olympiad syllabus
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DOWNLOAD_RESOURCES.map(({ title, href }) => (
                <a
                  key={href}
                  href={href}
                  download
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-200">
                    <FileText className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black leading-snug text-slate-900">{title}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-wider text-sky-700">Download PDF</p>
                  </div>
                  <Download className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-sky-600" aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DownloadsPage;
