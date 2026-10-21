import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Our Mission", href: "/mission" },
    { label: "Achievers Gallery", href: "/achievers" },
    { label: "All Celebrations", href: "/events" },
    { label: "Awards Celebrations 2025", href: "/awards-celebrations-2025" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact Us", href: "/contact" },
  ];

  const resourceLinks = [
    { label: "Step-Up Series", href: "/stepup" },
    { label: "Crossword Puzzles", href: "/crosswords" },
    { label: "Aptitude Tests", href: "/aptitude" },
    { label: "Mock Tests", href: "/mocktests" },
    { label: "Success Series", href: "/success-series" },
    { label: "Olympiad Syllabus", href: "/downloads" },
  ];

  const examLinks = [
    { label: "NSTSE", href: "/exam/nstse" },
    { label: "UCO", href: "/exam/uco" },
    { label: "UIEO", href: "/exam/uieo" },
    { label: "UIMO", href: "/exam/uimo" },
    { label: "UIGKO", href: "/exam/uigko" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-slate-900 text-white" data-testid="footer">
      {/* CTA Section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                Let's Build the{" "}
                <span className="text-gradient">Future</span>
                <br />
                Together
              </h2>
              <p className="text-lg text-slate-400 font-medium">
                Subscribe to our newsletter for updates on exams, results, and learning resources.
              </p>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 px-6 py-6 focus:border-sky-500"
                  data-testid="newsletter-email"
                />
                <Button
                  className="rounded-full font-bold px-8 py-6 bg-sky-500 hover:bg-sky-400"
                  data-testid="newsletter-subscribe-btn"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="https://customer-assets.emergentagent.com/job_kids-edu-new/artifacts/jpg6s12y_logo%20%281%29.png" 
                alt="Unified Council Logo"
                className="h-16 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-slate-400 font-medium mb-6 leading-relaxed">
              INDIA'S 1st ISO 9001:2015 Certified Organisation in Testing &amp; Assessment
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-sky-500 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div data-testid="footer-company-links">
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-sky-400 font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div data-testid="footer-resources-links">
            <h4 className="font-bold text-lg mb-6">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-sky-400 font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Exams */}
          <div>
            <h4 className="font-bold text-lg mb-6">Our Exams</h4>
            <ul className="space-y-3">
              {examLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-sky-400 font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400 font-medium">
                  #16-11-16/1/B, Saleem Nagar,<br />
                  Malakpet, Hyderabad - 500036
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <a href="tel:+914066105200" className="text-slate-400 hover:text-sky-400 font-medium">
                  +91 40 6610 5200
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <a href="mailto:info@unifiedcouncil.com" className="text-slate-400 hover:text-sky-400 font-medium">
                  info@unifiedcouncil.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm font-medium text-center md:text-left">
              © {new Date().getFullYear()} Unified Council. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-slate-500 text-sm font-medium">ISO 9001:2015 Certified</span>
              <span className="text-slate-500 text-sm font-medium">Techfest IIT Bombay Partner</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
