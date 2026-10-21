import { useState } from "react";
import { Menu, X, ChevronDown, Trophy, BookOpen, GraduationCap, Info, Medal } from "lucide-react";
import { Button } from "./ui/button";
import { OPTIONS_URL } from "../lib/utils";

const Header = ({ onRegister, onResults }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    // { label: "Exams", href: "#exams", icon: Trophy },
    // { label: "Resources", href: "#resources", icon: BookOpen },
    // { label: "Schools", href: "#schools", icon: GraduationCap },
    // { label: "Options", href: OPTIONS_URL, icon: Info, isExternal: true },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b-2 border-slate-100" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3" data-testid="logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_kids-edu-new/artifacts/jpg6s12y_logo%20%281%29.png" 
              alt="Unified Council Logo"
              className="h-14 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="font-black text-xl text-slate-800">Unified Council</h1>
              <p className="text-xs text-slate-500 font-medium">Foundation for Success</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => link.isExternal ? window.location.href = link.href : scrollToSection(link.href)}
                className="nav-link text-slate-600 hover:text-sky-500 flex items-center gap-2 py-2"
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onResults}
              className="rounded-full font-bold px-6 border-2 border-slate-200 hover:border-sky-500 hover:text-sky-600"
              data-testid="header-results-btn"
            >
              Check Results
            </Button>
            <Button
              onClick={() => { window.location.href = OPTIONS_URL; }}
              className="rounded-full font-bold px-6 bg-sky-500 hover:bg-sky-400 btn-3d"
              data-testid="header-register-btn"
            >
              Register Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 animate-slide-up">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => link.isLink ? navigate(link.href) : scrollToSection(link.href)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </button>
              ))}
              <hr className="my-2 border-slate-100" />
              <div className="flex flex-col gap-3 px-4 pt-2">
                <Button
                  variant="outline"
                  onClick={() => { onResults(); setMobileMenuOpen(false); }}
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
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
