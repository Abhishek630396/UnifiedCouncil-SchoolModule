import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Rocket,
  School,
  Trophy,
  Users,
  Globe2,
  Building2,
  Award,
  BadgeCheck,
  Sparkles,
  BookOpen,
  Calculator,
  Atom,
  Monitor,
  Globe,
  Sigma,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  PhoneCall,
  ClipboardList,
  Handshake,
  CalendarCheck,
  GraduationCap,
  Star,
  ShieldCheck,
  Quote,
  Newspaper,
  Send,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/SchoolsFooter";
import SchoolEnquiryForm from "../components/SchoolEnquiryForm";
import SchoolModule from "../components/SchoolModule";
import StudentVideosSection from "../components/StudentVideosSection";
import AwardsImageMarquee from "../components/AwardsImageMarquee";
import { Button } from "../components/ui/button";

// ---- Data (all static) ----
const STATS = [
  { value: "1st", label: "ISO Certified", icon: Trophy, color: "text-pink-400" },
  { value: "29+", label: "Years of Excellence", icon: Award, color: "text-amber-400" },
  { value: "14M+", label: "Students Reached", icon: Users, color: "text-sky-400" },
  { value: "5000+", label: "Partner Schools", icon: Building2, color: "text-emerald-400" },
  { value: "30+", label: "Countries", icon: Globe2, color: "text-purple-400" },
];

const OLYMPIADS = [
  { name: "NSTSE", full: "National Science Talent Search Examination", icon: Atom, color: "from-purple-500 to-fuchsia-500", link: "/exam/nstse/offline" },
  { name: "UIMO", full: "Unified International Mathematics Olympiad", icon: Calculator, color: "from-emerald-500 to-green-500", link: "/exam/uimo/offline" },
  { name: "UCO", full: "Unified International Cyber Olympiad", icon: Monitor, color: "from-sky-500 to-blue-500", link: "/exam/uco/offline" },
  { name: "UIEO", full: "Unified International English Olympiad", icon: BookOpen, color: "from-pink-500 to-rose-500", link: "/exam/uieo" },
  { name: "UIGKO", full: "Unified International General Knowledge Olympiad", icon: Globe, color: "from-amber-500 to-orange-500", link: "/exam/uigko" },
  { name: "UMO", full: "Unified Monthly Olympiad", icon: Sigma, color: "from-orange-500 to-red-500", link: "/exam/umo" },
];

const ADVANTAGES = [
  {
    feature: "Skill-Based Testing",
    detail: "Measures how well students understand and apply concepts — not just what they memorise.",
    accent: "from-sky-500 via-blue-500 to-indigo-500",
    hoverCard: "from-sky-500/20 via-blue-500/20 to-indigo-500/20",
    titleColor: "from-sky-700 via-blue-700 to-indigo-700",
  },
  {
    feature: "A Benchmark for Progress",
    detail: "Helps students and teachers understand where each student stands and identify areas for improvement.",
    accent: "from-pink-500 via-rose-500 to-red-500",
    hoverCard: "from-pink-500/20 via-rose-500/20 to-red-500/20",
    titleColor: "from-pink-700 via-rose-700 to-red-700",
  },
  {
    feature: "Detailed Diagnostic Reports",
    detail: "Get skill-wise insights, class averages and national rankings — at no additional cost.",
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    hoverCard: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    titleColor: "from-emerald-700 via-teal-700 to-cyan-700",
  },
  {
    feature: "Affordable Participation",
    detail: "A nominal fee of just ₹150 per student — making quality Olympiad assessment accessible to every school.",
    accent: "from-amber-500 via-orange-500 to-red-500",
    hoverCard: "from-amber-500/20 via-orange-500/20 to-red-500/20",
    titleColor: "from-amber-700 via-orange-700 to-red-700",
  },
  {
    feature: "Recognition for Schools",
    detail: "Zone- and state-level recognition for outstanding Principals, teachers and student performance.",
    accent: "from-violet-500 via-purple-500 to-fuchsia-500",
    hoverCard: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
    titleColor: "from-violet-700 via-purple-700 to-fuchsia-700",
  },
  {
    feature: "Holistic Skill Development",
    detail: "Builds reasoning, critical thinking and language skills — going beyond textbook learning.",
    accent: "from-cyan-500 via-sky-500 to-blue-500",
    hoverCard: "from-cyan-500/20 via-sky-500/20 to-blue-500/20",
    titleColor: "from-cyan-700 via-sky-700 to-blue-700",
  },
];

const SCHOOL_AWARDS = [
  {
    title: "Best Performance School Award",
    color: "from-amber-500 to-yellow-500",
    icon: Trophy,
    perks: [
      "One school per zone (17 zones)",
      "₹3,000 cash prize to Principal + Teacher-in-charge",
      "Best Contribution in Education certificate",
    ],
  },
  {
    title: "Top Mentor Award (State)",
    color: "from-sky-500 to-indigo-500",
    icon: BadgeCheck,
    perks: [
      "Top 5 schools per state (min. 300 schools participation)",
      "₹1,500 cash prize + Certificate",
      "For Principal and Teacher-in-charge",
    ],
  },
  {
    title: "Best Participation School",
    color: "from-emerald-500 to-teal-500",
    icon: Star,
    perks: [
      "Any school forwarding 100+ applications",
      "Certificate of Appreciation",
      "Every co-ordinator gets an appreciation certificate",
    ],
  },
];

const PRIZE_ANNOUNCEMENTS = [
  { text: "₹2 Lakh Cash Prize for National Toppers", color: "text-amber-300" },
  { text: "49 Laptops for Academic Excellence", color: "text-sky-300" },
  { text: "98 Tablets for Outstanding Achievers", color: "text-violet-300" },
  { text: "743 Cash Rewards for Top Performers", color: "text-emerald-300" },
  { text: "Medals & Recognition for National, State, City & Class Toppers", color: "text-pink-300" },
];

const PROCESS = [
  {
    icon: ClipboardList,
    title: "Enquire",
    detail: "Fill out the enquiry form or call us — our team will get back to you within 24 hours.",
  },
  {
    icon: Handshake,
    title: "Onboard",
    detail: "Receive the brochure, syllabus and complete school registration kit from our team.",
  },
  {
    icon: CalendarCheck,
    title: "Schedule",
    detail: "Choose an offline exam date that fits your school’s academic calendar.",
  },
  {
    icon: GraduationCap,
    title: "Conduct",
    detail: "We conduct the exam at your school premises — making the entire process simple and hassle-free.",
  },
];

const TESTIMONIALS = [
  {
    quote: "A well-organized and meticulously structured examination that fosters intellectual growth among students. The carefully framed questions challenge them to think deeply and apply concepts effectively. We believe every student should participate in this Olympiad to enhance their academic skills.",
    name: "Dr. Rohini D. Joshi",
    school: "GEMS English Medium School, Nashik",
    initials: "RJ",
  },
  {
    quote: "The Olympiad was exceptionally well organized. Every detail was taken care of, making it a smooth experience for all participants. The standard of examination questions was excellent, accurately reflecting the syllabus and testing students’ knowledge comprehensively. The communication process was seamless with clear instructions and timely updates.",
    name: "Prem Shankar Swami",
    school: "Sri Chaitanya Techno School, Indore",
    initials: "PS",
  },
  {
    quote: "We sincerely appreciate the seamless conduct of the examination in our school. The examination was well structured with a balanced blend of questions catering effectively to various proficiency levels of students.",
    name: "Pramod Tripathi",
    school: "Ashoka Universal School, Nashik",
    initials: "PT",
  },
  {
    quote: "The communication and the complete procedure of the examination were seamless. We received all the details and examination papers on time, and the level of the question papers was commendable. Thank you for your cooperation throughout the entire process.",
    name: "Sonal Verma",
    school: "VIBGYOR Roots & Rise School, Indore",
    initials: "SV",
  },
  {
    quote: "We appreciate the variety of question types, which challenged students to think critically and demonstrate their understanding in different ways.",
    name: "Sr. Holy Rose",
    school: "St. Mary’s International School (ICSE), Kanya Kumari",
    initials: "HR",
  },
  {
    quote: "The examination procedures starting from the announcement to the results and mark sheet delivery were extremely well organized and efficient.",
    name: "P. S. Kombade",
    school: "PM Shri KV Ambajhari, Nagpur",
    initials: "PK",
  },
  {
    quote: "This examination improved students’ problem-solving skills and inculcated a competitive spirit among them. It serves as a great platform for students to showcase their knowledge and identify areas for improvement through practical application.",
    name: "R. Pavana Kumar",
    school: "Presidency High School, Mugpal",
    initials: "RK",
  },
  {
    quote: "The examination was a valuable experience for students, providing an opportunity to assess their knowledge and reasoning skills. The variety of questions covered all aspects of the syllabus. We appreciate your efforts in promoting scientific talent and encouraging students to excel.",
    name: "Misha P. V.",
    school: "Sri Chaitanya Techno School, Kudlu",
    initials: "MP",
  },
  {
    quote: "Kudos to Unified Council for conducting the Olympiads in a well-organized manner. Everything was up to the mark, and we look forward to continuing our association next year.",
    name: "P. M. Philip",
    school: "Holy Angels School, Rajpura",
    initials: "PP",
  },
  {
    quote: "The examination was well organized, and the standard of the question papers was appropriate for all classes. We thank Unified Council for organizing the NSTSE examination, which provided an excellent opportunity for students to challenge themselves and showcase their abilities.",
    name: "Vartika Gaur",
    school: "Pride Public School, Kota",
    initials: "VG",
  },
  {
    quote: "The Olympiad helped students develop higher-order thinking skills and enhanced their analytical abilities. It also contributed to improvement in verbal and language skills.",
    name: "Chinni Krishna",
    school: "Keshava Reddy EM School, Kadapa",
    initials: "CK",
  },
  {
    quote: "Unified Council is a very good organization. The staff members are cooperative, and the standards of examination and communication are excellent. The overall examination procedure is very well organized.",
    name: "Koteshwara N",
    school: "Jindal Vidya Mandir, JSW Hillside, Basapur",
    initials: "KN",
  },
  {
    quote: "The examination was well organized and conducted smoothly. The study materials provided were clear and easy to understand. Instructions and communication were timely, and the overall examination procedure was excellent.",
    name: "B. Mohana Rao",
    school: "Kesava Reddy E.M. School, Ampolu",
    initials: "BM",
  },
  {
    quote: "The examination was well organized and covered a wide range of topics that effectively assessed students’ grammar and vocabulary skills. Timely announcement of results would also help sustain students’ motivation and enthusiasm.",
    name: "G. Rambabu",
    school: "Geetanjali Concept School, Jeedimetla, Hyderabad",
    initials: "GR",
  },
  {
    quote: "First and foremost, I would like to extend our heartiest gratitude and congratulations for conducting the National Science Talent Search Examination so successfully, maintaining your usual and expected standards of excellence. Everything was organized exactly as it should be.",
    name: "J. R. Henry Andrade",
    school: "St. John’s School, Ledhupur, Varanasi",
    initials: "JA",
  },
];

const TRUST_BADGES = [
  {
    title: "Times Excellence Award",
    by: "by The Times of India",
    icon: Trophy,
    accent: "from-[#ffb347] via-[#ff8a00] to-[#ff5c00]",
    glow: "shadow-[0_18px_35px_rgba(255,138,0,0.28)]",
  },
  {
    title: "Eduresources Star Rating Award",
    by: "by EducationWorld",
    icon: Star,
    accent: "from-[#4cc9ff] via-[#1ea7ff] to-[#0056ff]",
    glow: "shadow-[0_18px_35px_rgba(30,167,255,0.28)]",
  },
  {
    title: "Best Olympiads – Education Excellence Award",
    by: "by HyBiz TV",
    icon: BadgeCheck,
    accent: "from-[#3de0a8] via-[#00b894] to-[#008f7a]",
    glow: "shadow-[0_18px_35px_rgba(0,184,148,0.28)]",
  },
];

const MEDIA_LOGOS = ["Times of India", "India Today", "Social News", "Pinterest News", "DD Telangana", "TV5", "V6", "ETV", "Zee News", "99 TV"];
const BRAND_LOGO = "https://customer-assets.emergentagent.com/job_kids-edu-new/artifacts/jpg6s12y_logo%20%281%29.png";
const TESTIMONIAL_MARKS = [
  { icon: Quote, colors: ["#38bdf8", "#818cf8"], motion: "float" },
  { icon: Trophy, colors: ["#fbbf24", "#f97316"], motion: "tilt" },
  { icon: ShieldCheck, colors: ["#34d399", "#06b6d4"], motion: "pulse" },
  { icon: ClipboardList, colors: ["#60a5fa", "#a78bfa"], motion: "orbit" },
  { icon: Star, colors: ["#f472b6", "#fb7185"], motion: "float" },
  { icon: BookOpen, colors: ["#22d3ee", "#3b82f6"], motion: "tilt" },
  { icon: Handshake, colors: ["#a3e635", "#10b981"], motion: "pulse" },
  { icon: Award, colors: ["#fb7185", "#f59e0b"], motion: "orbit" },
  { icon: GraduationCap, colors: ["#818cf8", "#38bdf8"], motion: "float" },
  { icon: Atom, colors: ["#c084fc", "#e879f9"], motion: "tilt" },
  { icon: BadgeCheck, colors: ["#2dd4bf", "#84cc16"], motion: "pulse" },
  { icon: Sparkles, colors: ["#facc15", "#f472b6"], motion: "orbit" },
  { icon: Globe2, colors: ["#60a5fa", "#2dd4bf"], motion: "float" },
  { icon: MessageCircle, colors: ["#f472b6", "#a78bfa"], motion: "tilt" },
];

const SchoolsPage = () => {
  const navigate = useNavigate();
  const isLocalHost = typeof window !== "undefined" && ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const studentRegistrationUrl = isLocalHost
    ? "/student-registration-through-school"
    : "https://school.unifiedcouncil.com/student-registration-through-school";

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = "For Schools — Bring Unified Council Olympiads to Your Campus";
  }, []);

  const [selectedTheory, setSelectedTheory] = useState(null);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedTheory(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-white" data-testid="schools-page">
      <Header
        sticky={false}
        stickyUtility
        registerPath="/student-registration-through-school"
        showSchoolsUtility={false}
        showOptionsUtility={false}
        showResultsOnMobile={false}
        navigateToMissingSection={false}
        onRegister={() => {
          document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
        }}
        onResults={() => navigate("/#exams")}
      />

      {/* HERO */}
      <section className="relative min-h-[760px] overflow-hidden bg-[#05091b] text-white">
        {/* Ambient glow */}
        <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-sky-500/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-3xl" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-10 md:px-8 md:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-20">
          <div>
            <Button
              asChild
              className="mb-8 inline-flex min-h-11 rounded-full border border-amber-200 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 px-5 py-3 text-sm font-black text-slate-950 shadow-[0_0_0_3px_rgba(251,191,36,0.18),0_12px_28px_rgba(251,191,36,0.28)] transition-all hover:-translate-y-0.5 hover:from-amber-200 hover:via-yellow-200 hover:to-amber-300 hover:shadow-[0_0_0_5px_rgba(251,191,36,0.2),0_16px_34px_rgba(251,191,36,0.36)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
              data-testid="schools-hero-specialists"
            >
              <Link to="/school-enquiry">
                <School className="h-4 w-4 text-amber-900" aria-hidden="true" />
                Connect With Our Experts
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>

            <h1 className="mb-4 text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.15rem]">
              <span className="block">Give Your Students</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-sky-400">a Bigger Stage</span>
              <span className="block">to Shine</span>
            </h1>
            <div className="relative mb-6 lg:hidden">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-sky-500/30 to-fuchsia-500/30 blur-xl" />
              <img
                src="https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Happy students and teacher"
                className="relative h-56 w-full rounded-2xl object-cover sm:h-72"
              />
            </div>
            <p className="mb-6 text-lg md:text-xl text-slate-300 font-semibold max-w-xl leading-relaxed">
              Trusted by schools. Inspiring students. Building achievers.
            </p>
            <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mb-4 leading-relaxed">
              Join <span className="text-white font-black">5,000+ schools</span> across{" "}
              <span className="text-white font-black">30+ countries</span> that trust Unified Council to deliver
              world-class Olympiad and academic exams. With <span className="text-white font-black">14M+ exams</span>{" "}
              conducted over <span className="text-white font-black">29+ years</span>, give your students the
              opportunity to compete, discover their potential, and excel.
            </p>
            <a
              href="https://unifiedcouncil.com/about.html"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-xl border border-sky-300/50 bg-sky-400/10 px-5 py-3 text-sm font-black text-sky-200 shadow-lg shadow-sky-950/20 transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-400/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              Learn more about Unified Council
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate("/school-enquiry")}
                className="order-1 rounded-full bg-white px-7 py-6 font-black text-slate-900 hover:bg-slate-100"
                data-testid="schools-hero-enquire"
              >
                <Send className="w-4 h-4 mr-2" /> School Enquiry
              </Button>
              <Button
                asChild
                className="order-2 relative rounded-full border border-amber-200 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 px-6 py-6 font-black text-slate-950 shadow-[0_0_0_3px_rgba(251,191,36,0.18),0_12px_28px_rgba(251,191,36,0.28)] transition-all hover:-translate-y-1 hover:from-amber-200 hover:via-yellow-200 hover:to-amber-300 hover:shadow-[0_0_0_5px_rgba(251,191,36,0.2),0_16px_34px_rgba(251,191,36,0.36)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
                data-testid="schools-student-registration"
              >
                <Link to={studentRegistrationUrl}>
                  <Rocket className="mr-2 h-4 w-4 text-amber-900" aria-hidden="true" />
                  Students Registration
                </Link>
              </Button>
            </div>

            {/* Mini stats row */}
            <div className="mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-5">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <Icon className={`w-4 h-4 mb-1.5 ${s.color}`} />
                    <p className="text-xl font-black">{s.value}</p>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-tight">
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-br from-sky-500/30 to-fuchsia-500/30 rounded-[2rem] blur-2xl" />
            <div className="relative rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-7 shadow-2xl">
              <img
                src="https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Happy students and teacher"
                className="h-[360px] w-full rounded-2xl object-cover"
              />
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/25 p-3">
                  <p className="text-2xl font-black text-emerald-400">98%</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Retention</p>
                </div>
                <div className="rounded-xl bg-sky-500/15 border border-sky-500/25 p-3">
                  <p className="text-2xl font-black text-sky-400">17</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Zones</p>
                </div>
                <div className="rounded-xl bg-amber-500/15 border border-amber-500/25 p-3">
                  <p className="text-2xl font-black text-amber-400">₹5 Cr+</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prizes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-6 md:py-7">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center justify-center gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <p className="w-full text-center text-sm font-black uppercase leading-relaxed tracking-[0.12em] text-transparent bg-gradient-to-r from-sky-600 via-violet-600 to-pink-500 bg-clip-text lg:max-w-[260px] lg:text-left">
              Trusted by Educators.<br />
              Recognised Nationally.
            </p>

            <div className="grid w-full max-w-5xl gap-3 md:grid-cols-3">
              {TRUST_BADGES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.title}
                    className={`group relative overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:${badge.glow}`} 
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${badge.accent}`} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${badge.accent} opacity-0 transition-all duration-300 group-hover:opacity-[0.12]`} />

                    <div className="relative flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${badge.accent} text-white shadow-lg shadow-slate-900/10 ring-4 ring-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[0.82rem] font-black leading-snug text-slate-800 transition-all duration-300 group-hover:text-slate-900 sm:text-sm">
                          {badge.title}
                        </p>
                        <p className="mt-1 text-[0.68rem] font-bold tracking-wide text-slate-500 transition-all duration-300 group-hover:text-slate-800 sm:text-[0.72rem]">
                          {badge.by}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PRIZE HIGHLIGHTS */}
      <section className="bg-slate-950">
        <div
          className="prize-announcement overflow-hidden border-y border-amber-300/20 bg-slate-950 py-4"
          aria-label="Prize highlights"
          role="region"
        >
          <div className="prize-announcement-track flex w-max">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-10 pr-10"
                aria-hidden={copy === 1}
              >
                {PRIZE_ANNOUNCEMENTS.map((announcement) => (
                  <span
                    key={announcement.text}
                    className={`whitespace-nowrap text-sm font-black md:text-base ${announcement.color}`}
                  >
                    {announcement.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <img
          src="/assests/banner/prize-banner.jpeg"
          alt="National topper prizes: cash awards, laptops, tablets, and medals"
          className="block h-auto w-full object-contain"
          loading="eager"
        />
      </section>

      <SchoolModule />

      {/* WHY US */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-7 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-sky-50 border-2 border-sky-100 rounded-full px-3 py-1 mb-3">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-black uppercase tracking-wider text-sky-600">Why Unified Council</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              <span className="block">Scientifically designed.</span>
              <span className="text-gradient block">School-friendly.</span>
            </h2>
            <p className="mt-3 text-slate-600 font-medium md:text-lg">
              Our Olympiads are thoughtfully designed around CBSE, ICSE, ISC and State Board curricula — assessing conceptual understanding, reasoning and skills that truly matter, not rote memorisation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ADVANTAGES.map((a, i) => (
              <div
                key={a.feature}
                className="group relative overflow-hidden rounded-2xl border-2 border-slate-100 bg-white p-5 md:p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(59,130,246,0.23)] hover:border-white"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${a.hoverCard} opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-[1.02]`} />
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex items-start gap-3 md:block md:gap-0">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white md:mb-4 ${a.accent} shadow-md ring-2 ring-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_24px_rgba(59,130,246,0.32)]`}
                  >
                    <BadgeCheck className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-black text-slate-900 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:via-slate-700 group-hover:to-slate-900 group-hover:bg-clip-text group-hover:text-transparent">
                      {a.feature}
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-800">
                      {a.detail}
                    </p>
                    <button type="button" onClick={() => setSelectedTheory({ title: a.feature, text: a.detail })} className="mt-3 text-xs font-black uppercase tracking-wider text-sky-600 underline-offset-4 hover:text-sky-800 hover:underline">Read More</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OLYMPIADS OFFERED */}
      <section className="py-16 md:py-20 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-100 rounded-full px-3 py-1 mb-3">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-600">5 Academic Competitions</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  One Partner.
                </span>
                <span className="block bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                  Five Olympiads.
                </span>
                <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Endless Opportunities.
                </span>
              </h2>
            </div>
            <p className="text-sm text-slate-600 font-medium max-w-md">
              Give your students the opportunity to compete, learn and excel across Science, Mathematics, Cyber, English and General Knowledge — all through one trusted partner.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {OLYMPIADS.map((o) => {
              const Icon = o.icon;
              return (
                <button
                  key={o.name}
                  onClick={() => navigate(o.link)}
                  data-testid={`schools-olympiad-${o.name.toLowerCase()}`}
                  className="group bg-white rounded-2xl border-2 border-slate-100 p-4 text-left hover:-translate-y-1 hover:shadow-xl hover:border-slate-200 transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${o.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-black text-slate-900">{o.name}</p>
                  <p className="text-[11px] text-slate-500 font-semibold leading-tight mt-0.5">{o.full}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* AWARDS FOR SCHOOLS */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-100 rounded-full px-3 py-1 mb-3">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-600">Awards for Schools</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              Recognise your Principal and Teachers on a{" "}
              <span className="text-gradient">National Stage</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {SCHOOL_AWARDS.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.title}
                  className="relative rounded-2xl border-2 border-slate-100 bg-white p-6 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden group"
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${a.color}`} />
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <img src={BRAND_LOGO} alt="Unified Council" className="absolute right-4 top-4 h-8 w-16 object-contain opacity-70" />
                  <h3 className="pr-16 text-lg font-black text-slate-900 mb-3">{a.title}</h3>
                  <ul className="space-y-2">
                    {a.perks.map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-700">
                        <BadgeCheck className="w-4 h-4 mt-0.5 flex-none text-emerald-500" />
                        <span className="font-medium">{p}</span>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => setSelectedTheory({ title: a.title, text: a.perks.join(" ") })} className="mt-4 text-xs font-black uppercase tracking-wider text-sky-600 underline-offset-4 hover:text-sky-800 hover:underline">Read More</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <AwardsImageMarquee />

      {/* PROCESS */}
      <section className="py-16 md:py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-sky-400">How It Works</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400">Simple. Seamless. Stress-Free.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors"
                >
                  <span className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-fuchsia-500 flex items-center justify-center font-black text-sm shadow-lg">
                    {i + 1}
                  </span>
                  <div className="flex items-center justify-between">
                    <Icon className="w-6 h-6 text-sky-300 mb-3" />
                    <img src={BRAND_LOGO} alt="Unified Council" className="h-7 w-14 object-contain opacity-80" />
                  </div>
                  <h3 className="text-lg font-black">{p.title}</h3>
                  <p className="text-sm text-slate-300 font-medium mt-1 leading-relaxed">{p.detail}</p>
                  <button type="button" onClick={() => setSelectedTheory({ title: p.title, text: p.detail })} className="mt-3 text-xs font-black uppercase tracking-wider text-sky-300 underline-offset-4 hover:text-white hover:underline">Read More</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="overflow-hidden bg-slate-50 py-16 md:py-20" data-testid="schools-feedback">
        <div className="mx-auto w-[94%] max-w-[1400px]">
          <div className="mb-8 max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1">
              <Quote className="w-4 h-4 text-pink-600" />
              <span className="text-[11px] font-black uppercase tracking-[0.8px] text-sky-600">What schools say</span>
            </div>
            <h2 className="text-4xl font-black leading-[1.08] tracking-tight text-slate-950 md:text-5xl">
              Trusted by schools.<br />
              <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">Proven by Their Experience.</span>
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-500">
              Hear directly from educators and school leaders who have experienced Unified Council Olympiads in their schools.
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto px-1 pb-5 [scrollbar-color:#7774db_transparent] [scroll-snap-type:x_proximity] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-500 [&::-webkit-scrollbar-track]:bg-transparent">
            {TESTIMONIALS.map((t, i) => {
              const mark = TESTIMONIAL_MARKS[i % TESTIMONIAL_MARKS.length];
              const MarkIcon = mark.icon;

              return (
                <div
                  key={i}
                  className="relative flex min-h-[270px] w-[310px] shrink-0 snap-start flex-col overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-br from-[#12182c] to-[#09172e] p-6 shadow-[0_12px_30px_rgba(7,17,38,0.1)] transition-transform hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(7,17,38,0.18)] after:absolute after:bottom-0 after:left-6 after:right-6 after:h-0.5 after:bg-gradient-to-r after:from-sky-500 after:via-violet-500 after:to-pink-500"
                >
                  <div className="mb-3 flex h-9 items-center">
                    <div
                      className={`testimonial-mark testimonial-mark--${mark.motion}`}
                      style={{
                        "--testimonial-mark-start": mark.colors[0],
                        "--testimonial-mark-end": mark.colors[1],
                        "--testimonial-mark-delay": `${(i % 7) * -0.24}s`,
                      }}
                      aria-hidden="true"
                    >
                      <MarkIcon className="testimonial-mark-icon" />
                      <span className="testimonial-mark-spark testimonial-mark-spark--one" />
                      <span className="testimonial-mark-spark testimonial-mark-spark--two" />
                    </div>
                  </div>
                  <p className="line-clamp-6 flex-1 text-[13.5px] font-medium leading-relaxed text-slate-300">{t.quote}</p>
                  <button type="button" onClick={() => setSelectedTheory({ title: t.name, text: t.quote })} className="mt-3 self-start text-xs font-black uppercase tracking-wider text-sky-300 underline-offset-4 hover:text-white hover:underline">Read More</button>
                  <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-[11px] font-black text-white">{t.initials}</div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black text-white">{t.name}</p>
                      <p className="line-clamp-2 text-[10px] font-medium leading-tight text-slate-400">{t.school}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-center gap-3 text-xs font-semibold text-slate-400">
            <span className="text-sky-500">←</span>
            <span>Scroll to explore school feedback</span>
            <span className="text-pink-500">→</span>
          </div>
        </div>
      </section>

      {/* STUDENT VIDEO TESTIMONIES */}
      <StudentVideosSection />

      {/* MEDIA */}
      <section className="py-12 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Newspaper className="w-4 h-4 text-slate-500" />
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">As featured in</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {MEDIA_LOGOS.map((m) => (
              <span
                key={m}
                className="inline-flex items-center rounded-full bg-white border-2 border-slate-100 px-4 py-2 text-xs font-black text-slate-600 hover:border-slate-200 hover:text-slate-900 transition-colors"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section id="enquire" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border-2 border-emerald-100 rounded-full px-3 py-1 mb-3">
              <Send className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600">School Enquiry</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
              Talk to us — we&apos;ll get your school onboarded in{" "}
              <span className="text-gradient">under a week</span>
            </h2>
            <p className="text-slate-600 font-medium mb-8 md:text-lg">
              Fill this quick form. Our team will call you within 24 hours with the brochure, dates and school-registration
              kit.
            </p>

            <div className="space-y-3">
              <a
                href="tel:+919030007881"
                className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white p-4 hover:border-sky-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-black text-slate-500">Call us</p>
                  <p className="text-base font-black text-slate-900">90300 07881 · 040-4014 7035</p>
                </div>
              </a>
              <a
                href="mailto:support@unifiedcouncil.com"
                className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white p-4 hover:border-pink-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-black text-slate-500">Email us</p>
                  <p className="text-base font-black text-slate-900">support@unifiedcouncil.com</p>
                </div>
              </a>
              <a
                href="https://wa.me/919030007881?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Unified%20Council%20Olympiads%20for%20my%20school."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white p-4 hover:border-emerald-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-black text-slate-500">WhatsApp</p>
                  <p className="text-base font-black text-slate-900">Instant reply</p>
                </div>
              </a>
            </div>
          </div>

          <SchoolEnquiryForm />
        </div>
      </section>

      {selectedTheory && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="theory-dialog-title" onClick={() => setSelectedTheory(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-sky-600">Unified Council</p>
                <h2 id="theory-dialog-title" className="mt-1 text-2xl font-black text-slate-900">{selectedTheory.title}</h2>
              </div>
              <img src={BRAND_LOGO} alt="Unified Council" className="h-10 w-20 object-contain" />
            </div>
            <p className="mt-5 text-base font-medium leading-relaxed text-slate-600">{selectedTheory.text}</p>
            <button type="button" onClick={() => setSelectedTheory(null)} className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">Close</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SchoolsPage;
