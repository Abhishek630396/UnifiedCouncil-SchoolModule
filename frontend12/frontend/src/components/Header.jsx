import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { OPTIONS_URL } from "../lib/utils";
import ResultsModal from "./ResultsModal";

const RESULT_EXAMS = [
  { id: "nstse", name: "NSTSE" },
  { id: "uco", name: "UCO" },
  { id: "uieo", name: "UIEO" },
  { id: "uimo", name: "UIMO" },
  { id: "uigko", name: "UIGKO" },
  { id: "umo", name: "UMO" },
];

const Header = ({ onRegister, onResults }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItems, setExpandedMobileItems] = useState({});
  const [searchMessage, setSearchMessage] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLocalResults, setShowLocalResults] = useState(false);
  const navigate = useNavigate();
  const handleResults = () => {
    if (onResults) onResults();
    else setShowLocalResults(true);
  };

  const examLinks = [
    { label: "About NSTSE-Online", href: "https://register.unifiedcouncil.com/exam/nstse", external: true },
    { label: "About NSTSE-Offline", href: "/exam/nstse/offline" },
  ];
  const onlineExamUrls = {
    UICO: "https://register.unifiedcouncil.com/exam/uico",
    UIEO: "https://register.unifiedcouncil.com/exam/uieo",
    UIMO: "https://register.unifiedcouncil.com/exam/uimo",
  };
  const offlineExamLinks = (exam) => [
    ...(onlineExamUrls[exam]
      ? [{ label: `About ${exam}-Online`, href: onlineExamUrls[exam], external: true }]
      : []),
    { label: `About ${exam}-Offline`, href: `/exam/${exam === "UICO" ? "uco" : exam.toLowerCase()}/offline` },
  ];
  const schoolUrl = "https://school.unifiedcouncil.com/";
  const umoRegistrationUrl = "https://register.unifiedcouncil.com/exam/umo";
  const umoMenuLinks = [
    { label: "About UMO Online", href: umoRegistrationUrl, external: true },
  ];
  const miscellaneousLinks = [
    { label: "School Awards", href: "/school-awards", isLink: true },
    { label: "Make Questions for NSTSE", href: "/make-questions", isLink: true },
    { label: "Careers", href: "/careers", isLink: true },
    { label: "Previous Question Papers", href: "/previous-question-papers", isLink: true },
    { label: "Unique Reference Books for various Olympiads", href: "https://www.bmatalent.com/classwise-books-2/", external: true },
  ];
  const navLinks = [
    { label: "About", href: "/about", isLink: true },
    { label: "NSTSE", href: "#exams", submenu: examLinks },
    { label: "UICO", href: "/exam/uco/offline", isLink: true, submenu: offlineExamLinks("UICO") },
    { label: "UIEO", href: "/exam/uieo/offline", isLink: true, submenu: offlineExamLinks("UIEO") },
    { label: "UIMO", href: "/exam/uimo/offline", isLink: true, submenu: offlineExamLinks("UIMO") },
    { label: "UIGKO", href: "/exam/uigko/offline", isLink: true, submenu: offlineExamLinks("UIGKO") },
    { label: "UMO", href: umoRegistrationUrl, external: true, submenu: umoMenuLinks },
    { label: "Results", action: "results", submenu: ["NSTSE", "UICO", "UIEO", "UIMO", "UIGKO", "UMO"].map((label) => ({ label, action: "results" })) },
    { label: "Achievers", href: "/exam-archives", isLink: true },
    { label: "For Schools", href: schoolUrl, external: true, submenu: [
      { label: "School Participation", href: schoolUrl, external: true },
      { label: "School Resources", href: schoolUrl, external: true },
    ] },
    { label: "Parents", href: "/parents", isLink: true },
    { label: "Coordinator", href: "/coordinator", isLink: true },
    { label: "Miscellaneous", href: "#resources", submenu: miscellaneousLinks },
    { label: "Contact Us", href: "/contact", isLink: true },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (href.startsWith("#")) {
      navigate(`/${href}`);
    }
    setMobileMenuOpen(false);
  };

  const activateLink = (link) => {
    if (link.action === "results") {
      handleResults();
    } else if (link.external) {
      window.location.href = link.href;
    } else if (link.isLink || link.href.startsWith("/")) {
      navigate(link.href);
    } else {
      scrollToSection(link.href);
    }
    setMobileMenuOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.currentTarget.elements.namedItem("site-search").value.trim().toLowerCase();
    if (!query) {
      setSearchMessage("Enter a search term.");
      return;
    }

    const routeMatches = [
      { terms: ["option", "options"], href: "/options" },
      { terms: ["school", "schools", "schoolss"], href: "/schools" },
      { terms: ["resource", "resources", "free resource", "free resources"], href: "/#resources" },
    ];
    const routeMatch = routeMatches.find((item) => item.terms.some((term) => query.includes(term)));
    if (routeMatch) {
      navigate(routeMatch.href);
      return;
    }

    const searchableSections = [
      { selector: "#exams", terms: ["exam", "olympiad", "nstse", "uico", "uco", "uieo", "uimo", "uigko", "umo"] },
      { selector: "#resources", terms: ["resource", "question", "mock", "book", "crossword", "aptitude"] },
      { selector: "#schools", terms: ["school", "educator", "participation"] },
      { selector: "#testimonials", terms: ["parent", "principal", "testimonial", "review"] },
      { selector: "#contact", terms: ["contact", "phone", "email", "address"] },
    ];
    const sectionMatch = searchableSections.find((section) => section.terms.some((term) => query.includes(term)));
    const element = sectionMatch ? document.querySelector(sectionMatch.selector) : [...document.querySelectorAll("main section")].find((section) => section.innerText.toLowerCase().includes(query));

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setSearchMessage("");
    } else {
      setSearchMessage(`No results found for "${query}".`);
    }
  };

  const toggleMobileItem = (label) => {
    setExpandedMobileItems((current) => ({ ...current, [label]: !current[label] }));
  };

  return (
    <>
    <div className="fixed inset-x-0 top-0 z-50 h-14 bg-slate-950 text-white">
        <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-4 text-xs md:px-8 lg:px-12">
          <form className="relative flex items-center gap-2" onSubmit={handleSearch} role="search">
            <label className="sr-only" htmlFor="site-search">Search Unified Council</label>
            {searchOpen && (
              <div className="absolute left-0 top-11 z-50 flex h-10 w-[min(76vw,320px)] items-center rounded-full bg-white px-3 text-slate-500 shadow-lg sm:static sm:top-auto sm:w-[min(62vw,320px)] sm:shadow-[inset_0_0_0_1px_rgba(148,163,184,0.35)]">
                <input id="site-search" name="site-search" type="search" placeholder="Search exams and resources" className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
              </div>
            )}
            <button type={searchOpen ? "submit" : "button"} onClick={() => { if (!searchOpen) setSearchOpen(true); }} className="header-utility-button flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 shadow-[0_2px_0_#0369a1] transition-all hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" aria-label={searchOpen ? "Submit search" : "Open search"}>
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
            {searchOpen && <button type="button" onClick={() => setSearchOpen(false)} className="flex h-8 w-8 items-center justify-center text-white/80 hover:text-white" aria-label="Close search"><X className="h-4 w-4" /></button>}
          </form>
          <nav className="flex items-center justify-end gap-1 whitespace-nowrap text-slate-300" aria-label="Utility navigation">
            <button type="button" onClick={handleResults} className="header-utility-button rounded-md border border-white/20 px-3 py-1.5 font-bold text-white transition-colors hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">Check Results</button>
            <button type="button" onClick={() => { window.location.href = OPTIONS_URL; }} className="header-utility-button rounded-md bg-sky-500 px-3 py-1.5 font-bold text-white shadow-[0_2px_0_#0369a1] transition-all hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">Register</button>
            <button type="button" onClick={() => navigate("/login")} className="header-utility-button hidden rounded-md bg-sky-500 px-3 py-1.5 font-bold text-white shadow-[0_2px_0_#0369a1] transition-all hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:inline-flex">Login</button>
          </nav>
          <span className="sr-only" role="status" aria-live="polite">{searchMessage}</span>
        </div>
    </div>
    <div className="h-14" aria-hidden="true" />

    <header className="bg-white shadow-[0_4px_24px_rgba(15,23,42,0.08)]" data-testid="header">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="relative flex min-h-[84px] items-center justify-between gap-3 py-3 xl:grid xl:grid-cols-[1fr_auto_1fr] lg:min-h-[112px]">
          <a href="/" className="absolute left-1/2 flex h-20 w-auto -translate-x-1/2 items-center justify-center xl:static xl:w-full xl:translate-x-0 xl:justify-start" data-testid="logo">
            <img
              src="https://customer-assets.emergentagent.com/job_kids-edu-new/artifacts/jpg6s12y_logo%20%281%29.png"
              alt="Unified Council Foundation for Success Logo"
              className="h-20 w-40 object-contain object-left lg:h-24 lg:w-52"
            />
          </a>

          <div className="hidden text-center xl:block">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-600">Unified Council</p>
            <p className="mt-1 text-2xl font-black text-slate-900 xl:text-3xl">Inspiring Young Minds</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Olympiads that build confident achievers</p>
          </div>

          <div className="hidden h-20 w-full items-center justify-end xl:flex">
            <img
              src="https://www.unifiedcouncil.com/images/uc-olympiads-logo.png"
              alt="Unified Council Olympiads Logo"
              className="h-20 w-40 object-contain object-right lg:h-24 lg:w-52"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mr-auto rounded-md p-3 transition-colors hover:bg-slate-100 xl:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        <nav className="relative z-0 hidden min-h-14 items-center justify-center gap-0 bg-transparent px-2 xl:flex xl:gap-1 xl:px-3 before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-slate-200 before:content-['']" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <div key={link.label} className="group relative">
              {link.external ? (
                <a href={link.href} className="block border-t-4 border-transparent px-3 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 transition-colors hover:border-sky-500 hover:bg-white hover:text-slate-800 xl:px-3">{link.label}</a>
              ) : (
                <button type="button" onClick={() => activateLink(link)} aria-haspopup={link.submenu ? "true" : undefined} className="flex items-center gap-1 border-t-4 border-transparent px-2 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 transition-colors hover:border-sky-500 hover:bg-white hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 xl:px-3" data-testid={`nav-${link.label.toLowerCase().replaceAll(" ", "-")}`}>
                  {link.label}
                  {link.submenu && <span className="text-sm leading-none" aria-hidden="true">›</span>}
                </button>
              )}
              {link.submenu && (
                <div className="invisible absolute left-0 top-full z-[60] w-64 translate-y-1 border border-slate-200 bg-white opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {link.submenu.map((item) => item.external ? (
                    <a key={item.label} href={item.href} className="block border-b border-slate-100 px-4 py-2.5 text-sm font-semibold normal-case tracking-normal text-sky-700 transition-colors last:border-b-0 hover:bg-cyan-50 hover:text-cyan-700">{item.label}</a>
                  ) : (
                    <button key={item.label} type="button" onClick={() => activateLink(item)} className="block w-full border-b border-slate-100 px-4 py-2.5 text-left text-sm font-semibold normal-case tracking-normal text-sky-700 transition-colors last:border-b-0 hover:bg-cyan-50 hover:text-cyan-700">{item.label}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="border-t border-slate-100 py-4 animate-slide-up xl:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <div key={link.label} className="rounded-xl border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center">
                    {link.external ? (
                      <a href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex-1 px-4 py-3 text-left font-medium text-slate-600 transition-colors hover:text-sky-700">{link.label}</a>
                    ) : (
                      <button type="button" onClick={() => activateLink(link)} className="flex-1 px-4 py-3 text-left font-medium text-slate-600 transition-colors hover:text-sky-700">{link.label}</button>
                    )}
                    {link.submenu && (
                      <button type="button" onClick={() => toggleMobileItem(link.label)} className="flex h-11 w-12 items-center justify-center text-slate-500" aria-label={`${expandedMobileItems[link.label] ? "Collapse" : "Expand"} ${link.label} menu`} aria-expanded={Boolean(expandedMobileItems[link.label])}>
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedMobileItems[link.label] ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                  {link.submenu && expandedMobileItems[link.label] && (
                    <div className="border-t border-slate-200 bg-white px-3 py-2">
                      {link.submenu.map((item) => item.external ? (
                        <a key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block break-words rounded-lg px-3 py-2.5 text-sm font-medium text-sky-700 hover:bg-sky-50">{item.label}</a>
                      ) : (
                        <button key={item.label} type="button" onClick={() => activateLink(item)} className="block w-full break-words rounded-lg px-3 py-2.5 text-left text-sm font-medium text-sky-700 hover:bg-sky-50">{item.label}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <hr className="my-2 border-slate-100" />
              <div className="flex flex-col gap-3 px-4 pt-2">
                <Button
                  variant="outline"
                  onClick={() => { handleResults(); setMobileMenuOpen(false); }}
                  className="w-full rounded-full font-bold border-2"
                  data-testid="mobile-results-btn"
                >
                  Check Results
                </Button>
                <Button
                  onClick={() => { window.location.href = OPTIONS_URL; setMobileMenuOpen(false); }}
                  className="w-full rounded-full font-bold bg-sky-500 hover:bg-sky-400"
                  data-testid="mobile-register-btn"
                >
                  Register Now
                </Button>
                <Button
                  onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                  className="w-full rounded-full font-bold bg-sky-500 hover:bg-sky-400"
                  data-testid="mobile-login-btn"
                >
                  Login
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
    {showLocalResults && <ResultsModal exams={RESULT_EXAMS} onClose={() => setShowLocalResults(false)} />}
    </>
  );
};

export default Header;
