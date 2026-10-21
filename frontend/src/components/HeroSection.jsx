import { Trophy, Rocket } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const HeroSection = ({ onSchoolRegister, onResults }) => {
  const isLocalHost = typeof window !== "undefined" && ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const studentRegistrationUrl = isLocalHost
    ? "/student-registration-through-school"
    : "https://school.unifiedcouncil.com/student-registration-through-school";

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#f4f9fc] py-12 md:py-16 lg:py-20" data-testid="hero-section">
      {/* Floating decorations */}
      <div className="pointer-events-none absolute -right-24 top-10 z-0 h-72 w-72 rounded-full border-[30px] border-sky-100/70" aria-hidden="true" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-slide-up">
            {/* Overline */}
            <div className="mb-5 inline-flex items-center gap-2 border-l-4 border-amber-400 bg-white px-4 py-2 shadow-sm">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-black uppercase tracking-wider text-sky-600">
                29+ Years of Excellence
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-5 text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Where curiosity becomes{" "}
              <span className="text-sky-600">achievement.</span>
            </h1>

            {/* Subheading */}
            <p className="mb-8 max-w-xl text-base font-medium leading-relaxed text-slate-600 md:text-lg lg:mx-0">
              India's most trusted Olympiad platform. Join millions of students competing in 
              <span className="text-sky-600 font-bold"> Science</span>,
              <span className="text-pink-500 font-bold"> Maths</span>,
              <span className="text-green-500 font-bold"> English</span>,
              <span className="text-yellow-500 font-bold"> Computers</span> &
              <span className="text-purple-500 font-bold"> GK</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button
                asChild
                className="min-h-11 rounded-md bg-sky-600 px-5 font-bold text-white hover:bg-sky-700"
                data-testid="hero-register-btn"
              >
                <Link to={studentRegistrationUrl}>
                  <Rocket className="w-3 h-3 mr-1" />
                  School Students Registration
                </Link>
              </Button>
            </div>

            {/* <div className="mt-6 flex justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => navigate('/options')}
                className="group w-full max-w-xl rounded-3xl border-2 border-sky-100 bg-white/90 p-5 text-left shadow-lg transition-all hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"
                data-testid="hero-options-link"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
                    Explore Options
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-black text-slate-900">
                  Choose Your Olympiad in <span className="text-sky-500">Options</span>
                </p>
                <p className="mt-2 text-sm md:text-base font-medium text-slate-600">
                  View all available olympiads and open the full options page.
                </p>
              </button>
            </div> */}

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10">
              <div className="flex items-center gap-2">
              </div>
              <div className="h-6 w-px bg-slate-200" />
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-slide-up stagger-2">
            <div className="hero-image-wrapper relative">
              <img
                src="/assests/banner/banner.jpeg"
                alt="Happy students learning together"
                className="w-full h-auto rounded-[3rem] shadow-2xl object-cover aspect-[4/3]"
                data-testid="hero-image"
              />
              
              {/* Floating badge - Top Left */}
              <div className="hidden sm:flex absolute -top-2 -left-2 md:-top-4 md:-left-4 bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-2 sm:p-4 animate-float max-w-xs">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm md:text-lg font-black text-slate-800 leading-tight">Best Olympiads Certified by the Times of India</p>
                  </div>
                </div>
              </div>

              {/* Floating badge - Bottom Right */}
              {/* <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float stagger-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Success Rate</p>
                    <p className="text-lg font-black text-green-600">98%</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
