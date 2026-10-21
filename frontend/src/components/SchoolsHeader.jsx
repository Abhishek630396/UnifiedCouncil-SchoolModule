import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Trophy, BookOpen, GraduationCap, Info, Medal } from "lucide-react";
import { Button } from "./ui/button";

const Header = ({ onRegister, onResults }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Exams", href: "/#exams", icon: Trophy, isLink: true },
    { label: "Resources", href: "/#resources", icon: BookOpen, isLink: true },
    { label: "Schools", href: "/schools", icon: GraduationCap, isLink: true },
    { label: "Options", href: "/options", icon: Info, isLink: true },
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
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3" data-testid="logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_kids-edu-new/artifacts/jpg6s12y_logo%20%281%29.png" 
              alt="Unified Council Logo"
              className="h-16 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => link.isLink ? navigate(link.href) : scrollToSection(link.href)}
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
              onClick={() => (onResults ? onResults() : navigate("/"))}
              className="rounded-full font-bold px-6 border-2 border-slate-200 hover:border-sky-500 hover:text-sky-600"
              data-testid="header-results-btn"
            >
              Check Results
            </Button>
            <Button
              onClick={() => navigate('/register')}
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
                  onClick={() => { onResults ? onResults() : navigate("/"); setMobileMenuOpen(false); }}
                  className="w-full rounded-full font-bold border-2"
                  data-testid="mobile-results-btn"
                >
                  Check Results
                </Button>
                <Button
                  onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
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
