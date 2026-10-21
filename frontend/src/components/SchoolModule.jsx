import { Building2, Users, LayoutDashboard, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const SchoolModule = ({ onSchoolRegister }) => {
  return (
    <section id="schools" className="py-16 md:py-24 bg-slate-900" data-testid="school-module">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-500/30 rounded-full px-4 py-2 mb-6">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-bold text-sky-400 uppercase tracking-wider">
                For Schools & Educators
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              Unified Olympiads
              <br />
              <span className="text-sky-400">School Module</span>
            </h2>

            <p className="text-lg text-slate-300 font-medium mb-8 max-w-xl mx-auto lg:mx-0">
              Register your school and give your students access to India's most prestigious 
              Olympiad examinations. Comprehensive dashboard for tracking performance.
            </p>

            {/* Action Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {/* School Registration */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-sky-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Register Your School</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Get your institution onboarded for all Olympiad exams
                </p>
                <Button
                  // onClick={onSchoolRegister}
                  className="w-full rounded-full font-bold bg-sky-500 hover:bg-sky-400"
                  data-testid="school-register-btn">

                  <Link to="/school-registration">
                    Register Now
                  </Link>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* School Dashboard */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">School Dashboard</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Track student registrations, results, and performance
                </p>
                <Button asChild
                  variant="outline"
                  className="w-full rounded-full font-bold border-2 border-white/30 text-white hover:bg-white/10"
                  data-testid="school-dashboard-btn">
                  <Link to="/school-dashboard/login">
                    Login
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              <div className="text-center">
                <p className="text-3xl font-black text-white">5000+</p>
                <p className="text-sm text-slate-400 font-medium">Partner Schools</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-white">30+</p>
                <p className="text-sm text-slate-400 font-medium">Countries</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-white">1st</p>
                <p className="text-sm text-slate-400 font-medium">ISO Certified</p>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative rounded-[2.5rem] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Happy students and teacher"
                className="w-full h-auto object-cover aspect-[4/3]"
                data-testid="school-module-image" />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">This Month</p>
                <p className="text-xl font-black text-slate-800">500+ Schools Joined</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default SchoolModule;