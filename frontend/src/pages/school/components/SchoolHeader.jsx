import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import fullLogoSrc from "@/assets/unified-council-full-logo.png";
const LOGO_SRC = "/assests/logo/uc_logo.jpeg";

const SchoolHeader = ({ showFullLogo = false }) => {
  const logoSrc = showFullLogo
    ? fullLogoSrc
    : LOGO_SRC;

  return (
    <header className="bg-white border-b-2 border-slate-100 sticky top-0 z-40">
        <div className={`max-w-7xl mx-auto px-4 flex items-center justify-between ${showFullLogo ? "py-1" : "py-4"}`}>
          <div className="flex items-center gap-3">
            <Link to="/">
              <img
                src={logoSrc}
                alt="Unified Council Foundation for Success"
                className={showFullLogo ? "h-20 w-36 object-contain sm:h-24 sm:w-44" : "h-10 w-10 rounded-full"}
              />
            </Link>
            {!showFullLogo && (
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-black text-slate-800 leading-tight">Unified Council</h1>
              </div>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Phone className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-semibold text-slate-600">+91-90300 07882, 96030 64939</span>
          </div>
          <Button
            type="button"
            onClick={() => {
              window.location.href = "tel:+919603064939";
            }}
            className="h-9 rounded-full bg-slate-900 px-3 text-[11px] font-bold hover:bg-slate-800 sm:hidden"
          >
            <Phone className="mr-1.5 h-3.5 w-3.5" />
            Call our Expert
          </Button>
        </div>
      </header>
  )
}

export default SchoolHeader;
