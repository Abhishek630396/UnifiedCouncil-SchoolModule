import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

const Header = ({
  onRegister,
  onResults,
  registerPath = "/indregister",
  showSchoolsUtility = true,
  showOptionsUtility = true,
  showResultsOnMobile = true,
  navigateToMissingSection = true,
  showBrandingAndNavigation = true,
  sticky = true,
  stickyUtility = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItems, setExpandedMobileItems] = useState({});
  const [openDesktopMenu, setOpenDesktopMenu] = useState(null);
  const [searchMessage, setSearchMessage] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [utilityHeight, setUtilityHeight] = useState(56);
  const utilityBarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const utilityBar = utilityBarRef.current;
    if (!stickyUtility || !utilityBar) return undefined;

    let active = true;
    const updateUtilityHeight = () => {
      if (active && utilityBar.isConnected) {
        setUtilityHeight(utilityBar.getBoundingClientRect().height);
      }
    };
    updateUtilityHeight();

    const observer = new ResizeObserver(updateUtilityHeight);
    observer.observe(utilityBar);
    window.addEventListener("resize", updateUtilityHeight);
    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener("resize", updateUtilityHeight);
    };
  }, [stickyUtility]);

  const navLinks = [
    { label: "About", href: "https://unifiedcouncil.com/about.html", external: true },
    { label: "NSTSE", href: "/exam/nstse", isLink: true, submenu: [
      { label: "About NSTSE-Offline", href: "https://unifiedcouncil.com/about-nstse.html" },
      { label: "About NSTSE-Online", href: "https://unifiedcouncil.com/about-nstse-online.html" },
      { label: "NSTSE Advantage", href: "https://unifiedcouncil.com/nstse-advantages.html" },
      { label: "Recognition for Toppers", href: "https://unifiedcouncil.com/recognition-for-toppers.html" },
      { label: "Subscribe News Letter", href: "https://unifiedcouncil.com/Subscribe.aspx" },
      { label: "Refer A Friend", href: "https://unifiedcouncil.com/Referfriend.aspx" },
      { label: "Sample Questions", href: "https://unifiedcouncil.com/sample-questions-nstse.html" },
      { label: "Reference Books", href: "https://www.bmatalent.com/classwise-books-2/" },
    ] },
    { label: "UICO", href: "/exam/uco", isLink: true, submenu: [
      { label: "About UICO-Offline", href: "https://unifiedcouncil.com/about-uco.html" },
      { label: "About UICO-Online", href: "https://unifiedcouncil.com/about-uco-online.html" },
      { label: "Sample Questions", href: "https://unifiedcouncil.com/sample-questions-uco.html" },
      { label: "Reference Books", href: "https://www.bmatalent.com/product-category/cyber-olympiad/" },
    ] },
    { label: "UIEO", href: "/exam/uieo", isLink: true, submenu: [
      { label: "About UIEO-Offline", href: "https://unifiedcouncil.com/about-uieo.html" },
      { label: "About UIEO-Online", href: "https://unifiedcouncil.com/about-uieo-online.html" },
      { label: "Sample Questions", href: "https://unifiedcouncil.com/sample-questions-uieo.html" },
    ] },
    { label: "UIMO", href: "/exam/uimo", isLink: true, submenu: [
      { label: "About UIMO-Offline", href: "https://unifiedcouncil.com/about-uimo.html" },
      { label: "About UIMO-Online", href: "https://unifiedcouncil.com/about-uimo-online.html" },
      { label: "Sample Questions", href: "https://unifiedcouncil.com/sample-questions-uimo.html" },
      { label: "Reference Books", href: "https://www.bmatalent.com/classwise-books-2/" },
    ] },
    { label: "UIGKO", href: "/exam/uigko", isLink: true, submenu: [
      { label: "About UIGKO", href: "https://unifiedcouncil.com/about-uigko.html" },
      { label: "Sample Questions", href: "https://unifiedcouncil.com/sample-questions-uigko.html" },
    ] },
    { label: "UMO", href: "/exam/umo", isLink: true },
    { label: "Results", action: "results", submenu: [
      { label: "NSTSE", href: "https://www.unifiedcouncil.com/nstse/nstse-result.html?_ga=2.21655867.1297853030.1788274342-1657181071.1786957274" },
      { label: "NSTSE-Online", href: "https://www.unifiedcouncil.com/nstse/online.aspx?_ga=2.132150670.1297853030.1788274342-1657181071.1786957274" },
      { label: "UICO", href: "https://www.unifiedcouncil.com/uco/ucoresult-online.aspx?_ga=2.132150670.1297853030.1788274342-1657181071.1786957274" },
      { label: "UICO-Online", href: "https://www.unifiedcouncil.com/uco/ucoresult-online.aspx?_ga=2.132150670.1297853030.1788274342-1657181071.1786957274" },
      { label: "UIGKO", href: "https://www.unifiedcouncil.com/UIGKO/uigkoresults.aspx?_ga=2.132150670.1297853030.1788274342-1657181071.1786957274" },
      { label: "UIEO", href: "https://www.unifiedcouncil.com/UIEO/uieoresults.aspx?_ga=2.25835453.1297853030.1788274342-1657181071.1786957274" },
      { label: "UIEO-Online", href: "https://www.unifiedcouncil.com/uieo/online.aspx?_ga=2.25835453.1297853030.1788274342-1657181071.1786957274" },
      { label: "UIMO", href: "https://www.unifiedcouncil.com/uimo/uimoresults.aspx?_ga=2.25835453.1297853030.1788274342-1657181071.1786957274" },
      { label: "UIMO-Online", href: "https://www.unifiedcouncil.com/uimo/online.aspx?_ga=2.25835453.1297853030.1788274342-1657181071.1786957274" },
    ] },
    { label: "Achievers", href: "#testimonials", submenu: [
      { label: "UICO Achievers", href: "https://unifiedcouncil.com/achievers-uco.aspx" },
      { label: "UICO Online Achievers", href: "https://unifiedcouncil.com/achievers-uco-online.aspx" },
      { label: "UIGKO Achievers", href: "https://unifiedcouncil.com/achievers-uigko.aspx" },
      { label: "UIEO Achievers", href: "https://unifiedcouncil.com/achievers-uieo.aspx" },
      { label: "UIEO Online Achievers", href: "https://unifiedcouncil.com/achievers-uieo-online.aspx" },
      { label: "NSTSE Achievers", href: "https://unifiedcouncil.com/achievers-nstse.aspx" },
      { label: "NSTSE Online Achievers", href: "https://unifiedcouncil.com/achievers-nstse-online.aspx" },
      { label: "UIMO Achievers", href: "https://unifiedcouncil.com/achievers-uimo.aspx" },
      { label: "UIMO Online Achievers", href: "https://unifiedcouncil.com/achievers-uimo-online.aspx" },
    ] },
    { label: "For Schools", href: "#schools", submenu: [
      { label: "School Participation", href: "https://unifiedcouncil.com/school-participation.html" },
      { label: "School Awards", href: "https://unifiedcouncil.com/school-awards.html" },
    ] },
    { label: "Parents", href: "https://unifiedcouncil.com/parents.html", external: true },
    { label: "Miscellaneous", href: "/terms-and-conditions", isLink: true, submenu: [
      { label: "School Awards", href: "https://unifiedcouncil.com/school-awards.html" },
      { label: "Make Questions for NSTSE", href: "https://unifiedcouncil.com/make-questions-for-nstse.html" },
      { label: "Careers", href: "https://unifiedcouncil.com/careers.html" },
      { label: "Previous Question Papers", href: "https://unifiedcouncil.com/careers.html" },
      { label: "Unique Reference Books for various Olympiads", href: "https://www.bmatalent.com/classwise-books-2/" },
    ] },
    { label: "Contact Us", href: "#contact" },
  ];

  const utilityLinks = [
    { label: "Free Resources", href: "http://staging.unifiedcouncil.com/#resources" },
    ...(showSchoolsUtility ? [{ label: "Schools", href: "/schools", isLink: true }] : []),
    ...(showOptionsUtility ? [{ label: "Options", href: "/options", isLink: true }] : []),
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      window.scrollTo({
        top: window.scrollY + element.getBoundingClientRect().top - (stickyUtility ? utilityHeight : 0),
        behavior: "instant",
      });
    } else if (navigateToMissingSection && href.startsWith("#")) {
      navigate(`/${href}`);
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
      setSearchOpen(false);
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
      setSearchOpen(false);
    } else {
      setSearchMessage(`No results found for "${query}".`);
    }
  };

  const toggleMobileItem = (label) => {
    setExpandedMobileItems((current) => ({ ...current, [label]: !current[label] }));
  };

  return (
    <header className={`${sticky ? "sticky top-0" : "relative"} z-50 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.08)]`} data-testid="header">
      {stickyUtility && (
        <div
          aria-hidden="true"
          className="h-32 sm:h-14"
          style={{ height: utilityHeight }}
        />
      )}
      <div
        ref={utilityBarRef}
        className={`${stickyUtility ? "fixed inset-x-0 top-0 z-[60]" : ""} bg-slate-950 text-white`}
      >
        <div className={`header-utility-row mx-auto flex min-h-12 max-w-7xl flex-row items-center justify-between gap-1 px-2 py-2.5 text-xs sm:gap-4 sm:px-4 md:px-8 lg:px-12${searchOpen ? " search-open" : ""}`}>
          <div className="header-search-container flex w-auto min-w-0 shrink-0 items-center gap-2 sm:w-auto">
            {searchOpen ? (
              <form className="flex w-full items-center gap-2 sm:max-w-[420px]" onSubmit={handleSearch} role="search">
                <label className="sr-only" htmlFor="site-search">Search Unified Council</label>
                <div className="flex h-9 w-full items-center rounded-full bg-white px-3 text-slate-500 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.35)] transition-all focus-within:shadow-[0_0_0_2px_rgba(59,130,246,0.2),inset_0_0_0_1px_rgba(148,163,184,0.35)]">
                  <Search className="mr-2 h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                  <input autoFocus id="site-search" name="site-search" type="search" placeholder="Search exams and resources" className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
                </div>
                <button type="submit" className="header-utility-button flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 shadow-[0_2px_0_#0369a1] transition-all hover:bg-sky-400 hover:shadow-[0_1px_0_#0369a1] hover:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" aria-label="Submit search">
                  <Search className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => { setSearchOpen(false); setSearchMessage(""); }} className="header-utility-button flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" aria-label="Close search">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            ) : (
              <button type="button" onClick={() => setSearchOpen(true)} className="header-utility-button flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 shadow-[0_2px_0_#0369a1] transition-all hover:bg-sky-400 hover:shadow-[0_1px_0_#0369a1] hover:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" aria-label="Open search" aria-expanded={false}>
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <nav className="header-utility-navigation flex min-w-0 flex-1 flex-nowrap items-center justify-end gap-1 text-slate-300 sm:ml-auto sm:w-auto sm:flex-none sm:overflow-x-auto sm:whitespace-nowrap" aria-label="Utility navigation">
            {utilityLinks.map((link) => (
              link.label === "Free Resources" ? (
                <div key={link.label} className="flex items-center gap-1">
                  <a href={link.href} className="header-utility-button rounded-md border border-white/20 bg-white/5 px-2.5 py-1.5 font-semibold text-white transition-colors hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">{link.label}</a>
                  <button type="button" onClick={() => navigate('/downloads')} className="header-utility-button rounded-md border border-white/20 bg-white/5 px-2.5 py-1.5 font-semibold text-white transition-colors hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">Downloads</button>
                </div>
              ) : link.isLink ? (
                <button key={link.label} type="button" onClick={() => navigate(link.href)} className="header-utility-button rounded-md border border-white/20 bg-white/5 px-2.5 py-1.5 font-semibold text-white transition-colors hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">{link.label}</button>
              ) : (
                <button key={link.label} type="button" onClick={() => scrollToSection(link.href)} className="header-utility-button rounded-md border border-white/20 bg-white/5 px-2.5 py-1.5 font-semibold text-white transition-colors hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">{link.label}</button>
              )
            ))}
            <span className="mx-1 hidden h-5 w-px bg-white/20 sm:block" aria-hidden="true" />
            <button type="button" onClick={onResults} className="header-utility-button hidden rounded-md border border-white/20 px-3 py-1.5 font-bold text-white transition-colors hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:inline-flex">Check Results</button>
            <button type="button" onClick={() => (onRegister ? onRegister() : navigate(registerPath))} className="header-utility-button ml-1 rounded-md bg-sky-500 px-3.5 py-1.5 font-bold text-white shadow-[0_2px_0_#0369a1] transition-all hover:bg-sky-400 hover:shadow-[0_1px_0_#0369a1] hover:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Register</button>
            <button type="button" onClick={() => navigate('/school-dashboard/login')} className="header-utility-button ml-1 rounded-md bg-sky-500 px-3.5 py-1.5 font-bold text-white shadow-[0_2px_0_#0369a1] transition-all hover:bg-sky-400 hover:shadow-[0_1px_0_#0369a1] hover:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Login</button>
          </nav>
          <span className="sr-only" role="status" aria-live="polite">{searchMessage}</span>
        </div>
      </div>

      {showBrandingAndNavigation && (
      <>
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="relative flex min-h-[84px] items-center justify-between gap-2 py-3 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4 lg:py-3 2xl:min-h-[112px]">
          <a href="/" className="z-10 flex h-14 w-24 items-center justify-start lg:h-20 lg:w-full 2xl:h-24" data-testid="logo">
            <img
              src="https://customer-assets.emergentagent.com/job_kids-edu-new/artifacts/jpg6s12y_logo%20%281%29.png"
              alt="Unified Council Foundation for Success Logo"
              className="h-14 w-24 object-contain object-left lg:h-20 lg:w-40 2xl:h-24 2xl:w-52"
            />
          </a>

          <div className="absolute left-1/2 w-[calc(100%-7rem)] -translate-x-1/2 text-center lg:static lg:w-auto lg:translate-x-0">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-sky-600 sm:text-xs sm:tracking-[0.28em]">Unified Council</p>
            <p className="mt-0.5 text-sm font-black leading-tight text-slate-900 sm:mt-1 sm:text-2xl xl:text-3xl">Inspiring Young Minds</p>
            <p className="mt-0.5 text-[9px] font-medium leading-tight text-slate-500 sm:mt-1 sm:text-xs">Olympiads that build confident achievers</p>
          </div>

          <div className="hidden h-20 w-full items-center justify-end pr-12 lg:flex 2xl:pr-0">
            <img
              src="https://www.unifiedcouncil.com/images/uc-olympiads-logo.png"
              alt="Unified Council Olympiads Logo"
              className="h-20 w-40 object-contain object-right 2xl:h-24 2xl:w-52"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="z-10 ml-auto rounded-md p-2 transition-colors hover:bg-slate-100 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:p-3 2xl:hidden"
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

        <nav className="relative z-0 hidden min-h-14 items-center justify-center gap-0 bg-transparent px-2 2xl:flex 2xl:gap-1 2xl:px-3 before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-slate-200 before:content-['']" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="group relative"
              onMouseEnter={() => link.submenu && setOpenDesktopMenu(link.label)}
              onMouseLeave={() => setOpenDesktopMenu(null)}
              onFocusCapture={() => link.submenu && setOpenDesktopMenu(link.label)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setOpenDesktopMenu(null);
                }
              }}
            >
              {link.external ? (
                <a href={link.href} className="block border-t-4 border-transparent px-3 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 transition-colors hover:border-sky-500 hover:bg-white hover:text-slate-800 xl:px-4">{link.label}</a>
              ) : (
                <button type="button" onClick={() => link.action === "results" ? onResults() : link.isLink ? navigate(link.href) : scrollToSection(link.href)} aria-haspopup={link.submenu ? "true" : undefined} aria-expanded={link.submenu ? openDesktopMenu === link.label : undefined} className="flex items-center gap-2 border-t-4 border-transparent px-3 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 transition-colors hover:border-sky-500 hover:bg-white hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 xl:px-4" data-testid={`nav-${link.label.toLowerCase().replaceAll(" ", "-")}`}>
                  {link.label}
                  {link.submenu && <span className="text-sm leading-none" aria-hidden="true">›</span>}
                </button>
              )}
              {link.submenu && openDesktopMenu === link.label && (
                <div
                  className="absolute left-0 top-full z-[60] w-64 border border-slate-200 bg-white shadow-xl"
                >
                  {link.submenu.map((item) => (
                    <a key={item.label} href={item.href} className="block border-b border-slate-100 px-4 py-2.5 text-sm font-semibold normal-case tracking-normal text-sky-700 transition-colors last:border-b-0 hover:bg-cyan-50 hover:text-cyan-700">{item.label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-white px-4 pb-6 pt-3 shadow-xl animate-slide-up 2xl:hidden">
            <div className="mb-3 flex shrink-0 items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-800">Menu</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2 transition-colors hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-slate-700" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <div key={link.label} className="rounded-xl border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center">
                    {link.external ? (
                      <a href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex-1 px-4 py-3 text-left font-medium text-slate-600 transition-colors hover:text-sky-700">{link.label}</a>
                    ) : (
                      <button type="button" onClick={() => { link.action === "results" ? onResults() : link.isLink ? navigate(link.href) : scrollToSection(link.href); setMobileMenuOpen(false); }} className="flex-1 px-4 py-3 text-left font-medium text-slate-600 transition-colors hover:text-sky-700">{link.label}</button>
                    )}
                    {link.submenu && (
                      <button type="button" onClick={() => toggleMobileItem(link.label)} className="flex h-11 w-12 items-center justify-center text-slate-500" aria-label={`${expandedMobileItems[link.label] ? "Collapse" : "Expand"} ${link.label} menu`} aria-expanded={Boolean(expandedMobileItems[link.label])}>
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedMobileItems[link.label] ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                  {link.submenu && expandedMobileItems[link.label] && (
                    <div className="border-t border-slate-200 bg-white px-3 py-2">
                      {link.submenu.map((item) => (
                        <a key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block break-words rounded-lg px-3 py-2.5 text-sm font-medium text-sky-700 hover:bg-sky-50">{item.label}</a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <hr className="my-2 border-slate-100" />
              <div className="flex flex-col gap-3 px-4 pt-2">
                {showResultsOnMobile && (
                  <Button
                    variant="outline"
                    onClick={() => { onResults(); setMobileMenuOpen(false); }}
                    className="w-full rounded-full font-bold border-2"
                    data-testid="mobile-results-btn"
                  >
                    Check Results
                  </Button>
                )}
                <Button
                  onClick={() => { navigate("/student-registration-through-school"); setMobileMenuOpen(false); }}
                  className="w-full rounded-full font-bold bg-sky-500 hover:bg-sky-400"
                  data-testid="mobile-register-btn"
                >
                  Register Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
      </>
      )}
    </header>
  );
};

export default Header;
