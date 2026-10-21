import { Sparkles, Trophy, Star, Rocket } from "lucide-react";
import { Button } from "./ui/button";

const HeroSection = ({ onRegister, onResults }) => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32" data-testid="hero-section">
      {/* Floating decorations */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-amber-400 rounded-full opacity-20 animate-float" />
      <div className="absolute top-40 right-20 w-12 h-12 bg-pink-400 rounded-full opacity-20 animate-float stagger-2" />
      <div className="absolute bottom-20 left-1/4 w-10 h-10 bg-green-400 rounded-full opacity-20 animate-float stagger-3" />
      <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-sky-400 rounded-full opacity-20 animate-float stagger-4" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-slide-up">
            {/* Overline */}
            <div className="inline-flex items-center gap-2 bg-sky-50 border-2 border-sky-100 rounded-full px-4 py-2 mb-6">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-black uppercase tracking-wider text-sky-600">
                28+ Years of Excellence
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
              Unleash Your Child's{" "}
              <span className="text-gradient">Genius</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              India's most trusted Olympiad platform. Join millions of students competing in 
              <span className="text-sky-600 font-bold"> Science</span>,
              <span className="text-pink-500 font-bold"> Maths</span>,
              <span className="text-green-500 font-bold"> English</span>,
              <span className="text-yellow-500 font-bold"> Computers</span> &
              <span className="text-purple-500 font-bold"> GK</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
              <Button
                size="sm"
                onClick={() => navigate("/indregister")}
                className="rounded-full font-medium px-4 py-2 text-xs bg-sky-500 hover:bg-sky-400 btn-3d"
                data-testid="hero-register-btn"
              >
                <Rocket className="w-3 h-3 mr-1" />
                Indian Students-Register Here
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.location.href =
                    'https://www.unifiedcouncil.com/Registrationinternational-2026-27.aspx'
                }
                className="rounded-full font-medium px-4 py-2 text-xs border-2 border-slate-200 hover:border-sky-500 hover:text-sky-600"
                data-testid="hero-results-btn"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                International Students-Register Here
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
              {/* <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">This Year</p>
                    <p className="text-lg font-black text-slate-800">Best Olympiads Certified by the Times of India</p>
                  </div>
                </div>
              </div> */}

              {/* Floating badge - Bottom Right */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float stagger-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Success Rate</p>
                    <p className="text-lg font-black text-green-600">98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
