import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

export const PageShell = ({ title, seoTitle, seoDescription, breadcrumb, badge, heroTitle, heroSubtitle, children, testId }) => {
  useEffect(() => {
    document.title = seoTitle || `${title} | Unified Council`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = seoDescription || "";
    window.scrollTo(0, 0);
  }, [title, seoTitle, seoDescription]);

  return (
    <div className="min-h-screen bg-slate-50" data-testid={testId}>
      <Header />

      <section className="relative py-14 bg-[#FFFBF3] overflow-hidden">
        <div className="absolute top-10 left-8 w-6 h-6 bg-amber-300 rounded-full opacity-60" />
        <div className="absolute top-20 right-16 w-4 h-4 bg-sky-400 rounded-full opacity-50" />
        <div className="absolute bottom-8 right-10 w-14 h-14 border-4 border-dotted border-sky-300 rounded-full opacity-50" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 justify-center">
            <a href="/" className="hover:text-slate-600">Home</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-700 font-semibold">{breadcrumb || title}</span>
          </div>
          {badge}
          {heroTitle}
          {heroSubtitle && (
            <p className="text-lg md:text-xl text-slate-600 font-medium max-w-3xl mx-auto">{heroSubtitle}</p>
          )}
        </div>
      </section>

      {children}

      <Footer />
    </div>
  );
};
