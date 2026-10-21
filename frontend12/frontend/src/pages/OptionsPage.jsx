import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Trophy, Award, Gift, Medal, Star, Target, BookOpen, Brain,
  Monitor, Calculator, Globe, Atom, ChevronRight, ChevronDown,
  Users, Building2, GraduationCap, CheckCircle, Sparkles, 
  IndianRupee, Tablet, Ticket, BadgeCheck, ArrowRight, Play,
  FileText, BarChart3, Lightbulb, Shield, Clock, Zap, Calendar,
  MapPin, Home
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import Header from "../components/Header";

// Awards & Rewards Data
const AWARDS = [
  { 
    icon: IndianRupee, 
    count: "699", 
    label: "Cash Awards", 
    color: "sky",
    description: "For top performers"
  },
  { 
    icon: Tablet, 
    count: "20", 
    label: "Tablet PCs", 
    color: "purple",
    description: "National rank holders"
  },
  { 
    icon: Ticket, 
    count: "Free", 
    label: "Online Courses", 
    color: "pink",
    description: "Premium learning access"
  },
  { 
    icon: Star, 
    count: "4200", 
    label: "Top 100 Awards", 
    color: "amber",
    description: "Special recognition"
  },
  { 
    icon: Medal, 
    count: "3000", 
    label: "State Awards", 
    color: "green",
    description: "Regional excellence"
  },
];

// Exams Data
const EXAMS = [
  {
    id: "nstse",
    name: "NSTSE",
    fullName: "National Level Science Talent Search Examination",
    subject: "Science & Mathematics",
    classes: "1-10",
    icon: Atom,
    color: "purple",
    description: "India's largest Science Talent Search Exam testing conceptual understanding and analytical thinking",
    features: ["Curriculum-based questions", "Tests analytical thinking", "National & State rankings"],
    participants: "25 Lakh+",
    examDate: "25-01-2026",
    mockDate: "18-01-2026",
    fee: "₹354"
  },
  {
    id: "uimo",
    name: "UIMO",
    fullName: "Unified International Mathematics Olympiad",
    subject: "Mathematics",
    classes: "1-10",
    icon: Calculator,
    color: "green",
    description: "Comprehensive mathematics olympiad focusing on problem-solving and logical reasoning skills",
    features: ["Logical reasoning", "Mathematical aptitude", "International exposure"],
    participants: "10 Lakh+",
    examDate: "11-01-2026",
    mockDate: "04-01-2026",
    fee: "₹354"
  },
  {
    id: "uieo",
    name: "UIEO",
    fullName: "Unified International English Olympiad",
    subject: "English",
    classes: "1-10",
    icon: BookOpen,
    color: "pink",
    description: "Tests English language proficiency, communication skills, and comprehensive language assessment",
    features: ["Grammar & vocabulary", "Reading comprehension", "Interactive English"],
    participants: "8 Lakh+",
    examDate: "04-01-2026",
    mockDate: "28-12-2025",
    fee: "₹354"
  },
  {
    id: "uco",
    name: "UCO",
    fullName: "Unified Cyber Olympiad",
    subject: "Computer Science",
    classes: "2-10",
    icon: Monitor,
    color: "sky",
    description: "Digital literacy and computer science fundamentals with mental ability and logical reasoning",
    features: ["IT fundamentals", "Logical reasoning", "Mental ability"],
    participants: "5 Lakh+",
    examDate: "28-12-2025",
    mockDate: "21-12-2025",
    fee: "₹354"
  },
  {
    id: "uigko",
    name: "UIGKO",
    fullName: "Unified International General Knowledge Olympiad",
    subject: "General Knowledge",
    classes: "1-10",
    icon: Globe,
    color: "amber",
    description: "Tests awareness about current affairs, static GK, and reasoning ability",
    features: ["Current affairs", "Static GK", "Reasoning ability"],
    participants: "3 Lakh+",
    examDate: "Coming Soon",
    mockDate: "Coming Soon",
    fee: "₹354"
  },
];

// Why Participate Benefits
const BENEFITS = [
  {
    icon: Target,
    title: "Problem-Solving Approach",
    description: "Questions designed to test analytical abilities"
  },
  {
    icon: BookOpen,
    title: "Command Over Fundamentals",
    description: "Strong foundation through concept-based questions"
  },
  {
    icon: Lightbulb,
    title: "Application of Knowledge",
    description: "Real-world application of theoretical concepts"
  },
  {
    icon: Brain,
    title: "Conceptual Understanding",
    description: "Focus on understanding rather than memorization"
  },
  {
    icon: BarChart3,
    title: "Performance Analysis",
    description: "Detailed SPR report with improvement areas"
  },
  {
    icon: Trophy,
    title: "Recognition & Awards",
    description: "Certificates, medals, and cash prizes"
  },
];

// Why Unified Council
const WHY_UC = [
  { icon: Shield, text: "India's first ISO-9001 certified organisation" },
  { icon: Clock, text: "25+ years of excellence in education" },
  { icon: Users, text: "40+ Million students participated" },
  { icon: Building2, text: "Present in 15+ countries worldwide" },
  { icon: BadgeCheck, text: "Recognized by educational boards" },
  { icon: Zap, text: "Scientifically designed question papers" },
];

const colorMap = {
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600", accent: "bg-purple-500", light: "bg-purple-100", gradient: "from-purple-500 to-purple-600" },
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-600", accent: "bg-green-500", light: "bg-green-100", gradient: "from-green-500 to-green-600" },
  pink: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-600", accent: "bg-pink-500", light: "bg-pink-100", gradient: "from-pink-500 to-pink-600" },
  sky: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-600", accent: "bg-sky-500", light: "bg-sky-100", gradient: "from-sky-500 to-sky-600" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", accent: "bg-amber-500", light: "bg-amber-100", gradient: "from-amber-500 to-amber-600" },
};

const OptionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50" data-testid="options-page">
      <Header />

      {/* NEW Hero Section - Exam Cards Grid */}
      <section className="py-12 md:py-16 bg-white" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-sky-50 border-2 border-sky-100 rounded-full px-4 py-2 mb-4">
              <Trophy className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-black uppercase tracking-wider text-sky-600">
                14 Million+ Students Participated
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-4">
              Choose Your <span className="text-sky-500">Olympiad</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
              Select an exam to learn more and register. All exams can be taken online from home.
            </p>
          </div>

          {/* Exam Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXAMS.map((exam, index) => {
              const colors = colorMap[exam.color];
              const IconComponent = exam.icon;

              return (
                <div
                  key={exam.id}
                  className={`relative bg-white rounded-3xl border-2 ${colors.border} overflow-hidden card-hover animate-slide-up cursor-pointer group`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/exam/${exam.id}`)}
                  data-testid={`exam-card-${exam.id}`}
                >
                  {/* Top Gradient Bar */}
                  <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />
                  
                  <div className="p-6">
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 ${colors.light} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className={`w-8 h-8 ${colors.text}`} />
                      </div>
                      <Badge className={`${colors.bg} ${colors.text} font-semibold`}>
                        Classes {exam.classes}
                      </Badge>
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl font-black text-slate-800 mb-1">{exam.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-3">{exam.fullName}</p>

                    {/* Subject Tag */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-bold mb-4`}>
                      {exam.subject}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500">Participants</p>
                        <p className="font-black text-slate-800">{exam.participants}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500">Exam Fee</p>
                        <p className="font-black text-slate-800">{exam.fee}</p>
                      </div>
                    </div>

                    {/* Exam Date */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Exam: <span className="font-semibold">{exam.examDate}</span></span>
                    </div>

                    {/* CTA */}
                    <Button
                      className={`w-full rounded-full font-bold ${colors.accent} hover:opacity-90 group-hover:shadow-lg transition-all`}
                    >
                      Learn More & Register
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Registration CTA */}
          <div className="mt-10 text-center">
            <p className="text-slate-600 mb-4">Want to register for multiple exams at once?</p>
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="rounded-full font-bold px-8 py-6 bg-slate-900 hover:bg-slate-800"
            >
              Go to Registration Portal
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Awards & Rewards Section */}
      <section className="py-16 md:py-20 bg-slate-50" data-testid="awards-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-100 rounded-full px-4 py-2 mb-4">
              <Gift className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-black uppercase tracking-wider text-amber-600">
                Awards & Rewards
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-4">
              Win Exciting Prizes
            </h2>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
              Top performers are rewarded with cash prizes, tablets, certificates, and more!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {AWARDS.map((award, index) => {
              const colors = colorMap[award.color];
              return (
                <div
                  key={index}
                  className={`${colors.bg} border-2 ${colors.border} rounded-3xl p-6 text-center card-hover animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 ${colors.light} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <award.icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <h3 className={`text-2xl font-black ${colors.text} mb-1`}>{award.count}</h3>
                  <p className="font-bold text-slate-800 text-sm mb-1">{award.label}</p>
                  <p className="text-xs text-slate-500">{award.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Participate Section */}
      <section className="py-16 md:py-20 bg-white" data-testid="benefits-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 border-2 border-green-100 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm font-black uppercase tracking-wider text-green-600">
                  Why Participate
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-6 leading-tight">
                Why Should Students<br />
                <span className="text-green-600">Participate in Olympiads?</span>
              </h2>
              <p className="text-lg text-slate-600 font-medium mb-8">
                Scientifically designed skill-based Olympiads that test true understanding, not just memorization.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {BENEFITS.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-green-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">{benefit.title}</h4>
                      <p className="text-sm text-slate-500">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-50 to-sky-50 rounded-[3rem] p-8 md:p-12">
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-sky-500" />
                    Students' Performance Report (SPR)
                  </h4>
                  <p className="text-slate-600 text-sm mb-4">
                    A detailed graphical analysis of student's performance:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600">Subject-wise performance breakdown</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600">Comparison with state & national average</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600">Strengths and areas for improvement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-slate-600">Detailed chapter-wise analysis</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-sky-500 to-purple-500 rounded-2xl p-6 text-white">
                  <h4 className="font-bold text-lg mb-2">Ready to Excel?</h4>
                  <p className="text-white/80 text-sm mb-4">
                    Join millions of students and discover your true potential
                  </p>
                  <Button
                    onClick={() => navigate('/register')}
                    className="w-full rounded-full font-bold bg-white text-sky-600 hover:bg-slate-100"
                  >
                    Register Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Success Rate</p>
                    <p className="font-black text-slate-800">98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Unified Council Section */}
      <section className="py-16 md:py-20 bg-slate-900" data-testid="why-uc-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-500/30 rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-bold text-sky-400 uppercase tracking-wider">
                Why Unified Council
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              India's Most Trusted<br />
              <span className="text-sky-400">Olympiad Organization</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY_UC.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/15 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-sky-400" />
                </div>
                <p className="font-semibold text-white">{item.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="rounded-full font-bold px-10 py-6 text-lg bg-sky-500 hover:bg-sky-400"
            >
              Start Your Olympiad Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://customer-assets.emergentagent.com/job_kids-edu-new/artifacts/jpg6s12y_logo%20%281%29.png" 
                alt="Unified Council Logo"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
              <span className="font-bold text-white">Unified Council</span>
            </div>
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Unified Council. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="/" className="text-slate-400 hover:text-white text-sm font-medium">Home</a>
              <a href="/awards-celebrations-2025" className="text-slate-400 hover:text-white text-sm font-medium">Awards 2025</a>
              <a href="/register" className="text-slate-400 hover:text-white text-sm font-medium">Register</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm font-medium">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OptionsPage;
