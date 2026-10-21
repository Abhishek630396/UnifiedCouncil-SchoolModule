import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, Calendar, Clock, Users, Award, Trophy,
  BookOpen, CheckCircle, Download, FileText, Medal, Star, Gift,
  Calculator, Monitor, Atom, Globe, GraduationCap, Target, Brain,
  IndianRupee, Tablet, BadgeCheck, Home, ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const UMO_CLASS_FILES = Array.from({ length: 10 }, (_, index) => {
  const classNumber = index + 1;
  return {
    label: `Class ${classNumber}`,
    href: `/assests/umo_pdfs/umo-syllabus-class-${classNumber}.pdf`
  };
});

const UMORemedialSection = () => (
  <section className="py-16 bg-gradient-to-b from-orange-50 via-white to-orange-50">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 rounded-full px-4 py-2 mb-4">
          <Globe className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-black uppercase tracking-wider text-orange-600">
             Download Syllabus and Schedule here
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-10">
          {UMO_CLASS_FILES.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-orange-100 rounded-3xl p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 block"
            >
              <div className="w-14 h-16 mx-auto mb-3 rounded-2xl border-2 border-slate-300 relative bg-white">
                <div className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md">
                  PDF
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[11px] font-black text-slate-700 uppercase">
                  <span>Class</span>
                  <span>{item.label.replace("Class ", "")}</span>
                </div>
                <div className="absolute -right-2 top-6 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-red-500" />
              </div>
              <p className="text-xs font-bold text-slate-600">{item.label}</p>
              <p className="text-[11px] text-orange-600 font-semibold mt-1">Open PDF</p>
            </a>
          ))}
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-orange-600 mb-4">
          Unified Monthly Olympiad (UMO) online with Remedial Tests:
        </h2>
        <p className="text-2xl font-black text-slate-700">Flow chart of the process:</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-orange-100 shadow-lg p-4 sm:p-6 md:p-10 mb-12">
        <img
          src="/assests/umo_pdfs/umo-flow-chart.png"
          alt="UMO remedial test flow chart"
          className="w-full max-w-4xl mx-auto h-auto rounded-2xl"
        />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-10 space-y-8">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-4">
            We are excited to introduce an innovative feature of our Unified Monthly Olympiad (UMO) designed to enhance your child's learning experience and academic performance.
          </h3>
          <h4 className="text-xl md:text-2xl font-black text-orange-600">
            Sub-Topic Wise Remedial Tests
          </h4>
          <p className="text-base md:text-lg text-slate-600 leading-8 mt-4">
            For every Chapter Olympiad, we provide a detailed sub-topic wise report. This report breaks down your child's performance in each sub-topic, allowing for targeted feedback and improvement.
          </p>
        </div>

        <div>
          <h4 className="text-xl md:text-2xl font-black text-slate-800 mb-4">How It Works:</h4>
          <div className="space-y-5">
            <div className="bg-orange-50 rounded-3xl p-5">
              <h5 className="font-black text-slate-800 mb-2">Detailed Sub-Topic Analysis:</h5>
              <p className="text-slate-600 leading-7">
                After each Chapter Olympiad, your child will receive a comprehensive report detailing their performance in each sub-topic. This analysis helps identify specific areas where your child excels and areas that may need additional focus.
              </p>
            </div>
            <div className="bg-orange-50 rounded-3xl p-5">
              <h5 className="font-black text-slate-800 mb-2">Immediate Remedial Tests:</h5>
              <p className="text-slate-600 leading-7">
                If your child scores less than 80% in any sub-topic, an immediate remedial test is provided. This test includes 10 questions focused on the sub-topic where improvement is needed. The remedial tests are designed to reinforce learning and help your child master challenging areas.
              </p>
            </div>
            <div className="bg-orange-50 rounded-3xl p-5">
              <h5 className="font-black text-slate-800 mb-2">Continuous Improvement:</h5>
              <p className="text-slate-600 leading-7">
                By addressing weaknesses promptly, these remedial tests ensure continuous improvement and a deeper understanding of each subject. This process helps build a strong foundation and boosts overall academic performance.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xl md:text-2xl font-black text-slate-800 mb-4">Benefits of Remedial Tests:</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-3xl p-5">
              <h5 className="font-black text-slate-800 mb-2">Targeted Learning</h5>
              <p className="text-slate-600">Helps your child focus on specific areas that need improvement.</p>
            </div>
            <div className="bg-slate-50 rounded-3xl p-5">
              <h5 className="font-black text-slate-800 mb-2">Boosted Confidence</h5>
              <p className="text-slate-600">By mastering challenging sub-topics, your child will gain confidence in their abilities.</p>
            </div>
            <div className="bg-slate-50 rounded-3xl p-5">
              <h5 className="font-black text-slate-800 mb-2">Enhanced Performance</h5>
              <p className="text-slate-600">Continuous feedback and practice lead to better academic results.</p>
            </div>
          </div>
        </div>

        <p className="text-base md:text-lg text-slate-600 leading-8">
          We believe this new feature will significantly benefit your child's learning journey, providing them with the tools and support needed to excel. Encourage your child to take full advantage of these remedial tests and watch them achieve new heights in their academic pursuits.
        </p>
      </div>
    </div>
  </section>
);

// Exam Data
const EXAM_DATA = {
  nstse: {
    id: "nstse",
    name: "NSTSE",
    fullName: "National Level Science Talent Search Examination",
    tagline: "India's Largest Science Talent Search Exam",
    subject: "Science & Mathematics",
    classes: "1-10",
    icon: Atom,
    color: "purple",
    participants: "25 Lakh+",
    mockDate: "17-01-2027",
    examDate: "24-01-2027",
    fee: "350",
    resultsIn: "1 - 10",
    description: "NSTSE is a diagnostic test which helps students improve their overall learning ability and educational performance. Unlike other tests which may only find out how much a student knows or has memorised, NSTSE measures how well a student has understood the concepts and provides detailed feedback to help improve.",
    whyExam: [
      "Has interesting questions that require thinking, not simply recall",
      "Provides detailed skill-wise feedback highlighting strengths and weaknesses", 
      "Provides a benchmark of student's performance compared to peers",
      "Reduces stress by checking 'understanding and reasoning' rather than just 'knowing'",
      "Focus on fundamentals prepares students for IIT-JEE, NEET, GRE, GMAT, CAT etc."
    ],
    eligibility: "Students of classes 1, 2, 3, 4, 5, 6, 7, 8, 9 and 10 are eligible to participate.",
    examPattern: [
      { classes: "Class 1", questions: 40, marks: 40, duration: "1 hour" },
      { classes: "Class 2", questions: 50, marks: 50, duration: "1 hour" },
      { classes: "Classes 3-10", questions: 60, marks: 60, duration: "1 hour" }
    ],
    syllabusSections: [
      { name: "Class 1", subjects: [{ name: "Mathematics", marks: 15 }, { name: "General Science", marks: 25 }] },
      { name: "Class 2", subjects: [{ name: "Mathematics", marks: 20 }, { name: "General Science", marks: 30 }] },
      { name: "Classes 3-5", subjects: [{ name: "Mathematics", marks: 25 }, { name: "General Science", marks: 30 }, { name: "Critical Thinking", marks: 5 }] },
      { name: "Classes 6-10", subjects: [{ name: "Mathematics", marks: 25 }, { name: "Physics", marks: 10 }, { name: "Chemistry", marks: 10 }, { name: "Biology", marks: 10 }, { name: "Critical Thinking", marks: 5 }] }
    ],
    awards: [
      { rank: "Top 3", prize: "₹20,000 + Tablet PC + Olympiad Coach Subscription", icon: Trophy },
      { rank: "Rank 4-10", prize: "₹2,000 Cash + Olympiad Coach Subscription", icon: IndianRupee },
      { rank: "Rank 11-25", prize: "Olympiad Coach Subscription + Medal + Certificate", icon: Medal },
      { rank: "Rank 26-50", prize: "Olympiad Coach Subscription + Medal + Certificate", icon: Award },
      { rank: "Zone Top 5", prize: "Special Award + Medal + Certificate", icon: Star }
    ],
    certificates: [
      { name: "Certificate of Scholar", score: "91-100%" },
      { name: "Certificate of Distinction", score: "81-90%" },
      { name: "Certificate of Brilliance", score: "71-80%" }
    ],
    feeIncludes: [
      "Examination Fee",
      "Student's Performance Report (SPR)",
      "2 Previous Question Papers (E-Book)",
      "Success Series E-Book",
      "Online payment service charges"
    ]
  },
  uimo: {
    id: "uimo",
    name: "UIMO",
    fullName: "Unified International Mathematics Olympiad",
    tagline: "Master Mathematics with Competitive Excellence",
    subject: "Mathematics",
    classes: "1-10",
    icon: Calculator,
    color: "green",
    participants: "10 Lakh+",
    mockDate: "03-01-2027",
    examDate: "10-01-2027",
    fee: "350",
    resultsIn: "1 - 10",
    description: "UIMO is a curriculum-based examination designed to assess students' strength & weakness in Maths. Developed by highly experienced educational specialists, it provides a conquering charm to young minds with a competitive spirit through skill-based analysis at individual, class, school and country levels.",
    whyExam: [
      "Curriculum-based examination assessing mathematical strength",
      "Designed by highly experienced educational specialists",
      "Skill-blueprint analysis at individual, class, school and country levels",
      "Tests logical reasoning and mathematical aptitude",
      "International exposure and recognition"
    ],
    eligibility: "Students of classes 1, 2, 3, 4, 5, 6, 7, 8, 9 and 10 are eligible to participate.",
    examPattern: [
      { classes: "Classes 1-2", questions: 40, marks: 40, duration: "1 hour" },
      { classes: "Classes 3-5", questions: 50, marks: 50, duration: "1 hour" },
      { classes: "Classes 6-10", questions: 50, marks: 60, duration: "1 hour" }
    ],
    syllabusSections: [
      { name: "Classes 1-2", subjects: [{ name: "Mathematics", marks: 30 }, { name: "Logical Reasoning", marks: 10 }] },
      { name: "Classes 3-5", subjects: [{ name: "Mathematics", marks: 35 }, { name: "Logical Reasoning", marks: 10 }, { name: "Critical Thinking", marks: 5 }] },
      { name: "Classes 6-10", subjects: [{ name: "Mathematics-1", marks: 30 }, { name: "Mathematics-2 (Multiple Correct)", marks: 15 }, { name: "Logical Reasoning", marks: 10 }, { name: "Critical Thinking", marks: 5 }] }
    ],
    awards: [
      { rank: "Top 3", prize: "₹20,000 + Tablet PC + Olympiad Coach Subscription", icon: Trophy },
      { rank: "Rank 4-10", prize: "₹1,500 Cash + Olympiad Coach Subscription", icon: IndianRupee },
      { rank: "Rank 11-25", prize: "Olympiad Coach Subscription + Medal + Certificate", icon: Medal },
      { rank: "Rank 26-50", prize: "Olympiad Coach Subscription + Medal + Certificate", icon: Award },
      { rank: "Zone Top 5", prize: "Special Award + Medal + Certificate", icon: Star }
    ],
    certificates: [
      { name: "Certificate of Scholar", score: "91-100%" },
      { name: "Certificate of Distinction", score: "81-90%" },
      { name: "Certificate of Brilliance", score: "71-80%" }
    ],
    feeIncludes: [
      "Examination Fee",
      "Student's Performance Report (SPR)",
      "2 Previous Question Papers (E-Book)",
      "Maths Success E-Book",
      "Online payment service charges"
    ]
  },
  uieo: {
    id: "uieo",
    name: "UIEO",
    fullName: "Unified International English Olympiad",
    tagline: "Master the Global Language of Communication",
    subject: "English",
    classes: "1-10",
    icon: BookOpen,
    color: "pink",
    participants: "8 Lakh+",
    mockDate: "27-12-2026",
    examDate: "03-01-2027",
    fee: "350",
    resultsIn: "1 - 10",
    description: "English is the most widely used language for communication and the first global lingua franca. UIEO presents students with an all-encompassing assessment that places them at the threshold of easier learning and mastering the language of the world in the easiest and quickest way.",
    whyExam: [
      "Assessment of language skills - key to measuring educational achievement",
      "Holistic assessment helps shape future and career foundation",
      "Tests vocabulary, grammar, comprehension and interactive English",
      "Children who know English excel in all aspects of their dealings",
      "Comprehensive language proficiency evaluation"
    ],
    eligibility: "Students of classes 1, 2, 3, 4, 5, 6, 7, 8, 9 and 10 are eligible to participate.",
    examPattern: [
      { classes: "Classes 1-4", questions: 35, marks: 35, duration: "1 hour" },
      { classes: "Classes 5-10", questions: 50, marks: 50, duration: "1 hour" }
    ],
    syllabusSections: [
      { name: "Classes 1-4", subjects: [{ name: "Vocabulary & Functional Grammar", marks: 25 }, { name: "Reading Comprehension", marks: 5 }, { name: "Interactive English", marks: 5 }] },
      { name: "Classes 5-10", subjects: [{ name: "Vocabulary & Functional Grammar", marks: 35 }, { name: "Reading Comprehension", marks: 10 }, { name: "Interactive English", marks: 5 }] }
    ],
    awards: [
      { rank: "Top Ranker", prize: "₹10,000 + Olympiad Coach Subscription", icon: Trophy },
      { rank: "Rank 2-3", prize: "₹5,000 + Olympiad Coach Subscription", icon: IndianRupee },
      { rank: "Rank 4-10", prize: "₹1,500 Cash + Olympiad Coach Subscription", icon: Medal },
      { rank: "Rank 11-25", prize: "Olympiad Coach Subscription + Medal + Certificate", icon: Award },
      { rank: "Zone Top 3", prize: "Special Award + Medal + Certificate", icon: Star }
    ],
    certificates: [
      { name: "Certificate of Scholar", score: "91-100%" },
      { name: "Certificate of Distinction", score: "81-90%" },
      { name: "Certificate of Brilliance", score: "71-80%" }
    ],
    feeIncludes: [
      "Examination Fee",
      "Student's Performance Report (SPR)",
      "2 Previous Question Papers (E-Book)",
      "English Success E-Book",
      "Online payment service charges"
    ]
  },
  uico: {
    id: "uico",
    name: "UICO",
    fullName: "Unified International Cyber Olympiad",
    tagline: "Building Digital Leaders of Tomorrow",
    subject: "Computer Science",
    classes: "2-10",
    icon: Monitor,
    color: "sky",
    participants: "5 Lakh+",
    mockDate: "20-12-2026",
    examDate: "27-12-2026",
    fee: "350",
    resultsIn: "1 - 10",
    description: "India has seen spectacular success in IT and computers acknowledged worldwide. UICO motivates children to strengthen their knowledge using mental ability, logical reasoning & computer knowledge. Proficiency in these areas helps overcome problems related to software, management crises, and decision-making.",
    whyExam: [
      "Streamlining and fortifying computer education in India",
      "Instilling competitiveness in computer education",
      "Including logic, reasoning and mental ability in learning",
      "Identifying talent on a nationwide platform",
      "Exposing students to latest technology and computer studies"
    ],
    eligibility: "Students of classes 2, 3, 4, 5, 6, 7, 8, 9 and 10 are eligible to participate.",
    examPattern: [
      { classes: "All Classes", questions: 50, marks: 50, duration: "1 hour" }
    ],
    syllabusSections: [
      { name: "All Classes", subjects: [{ name: "Mental Ability", marks: 15 }, { name: "Reasoning", marks: 15 }, { name: "Computers", marks: 15 }, { name: "English", marks: 5 }] }
    ],
    awards: [
      { rank: "Top Ranker", prize: "₹10,000 + Olympiad Coach Subscription", icon: Trophy },
      { rank: "Rank 2-3", prize: "₹5,000 + Olympiad Coach Subscription", icon: IndianRupee },
      { rank: "Rank 4-10", prize: "₹1,000 Cash + Olympiad Coach Subscription", icon: Medal },
      { rank: "Rank 11-25", prize: "Olympiad Coach Subscription + Medal + Certificate", icon: Award },
      { rank: "Zone Top 3", prize: "Special Award + Medal + Certificate", icon: Star }
    ],
    certificates: [
      { name: "Certificate of Scholar", score: "91-100%" },
      { name: "Certificate of Distinction", score: "81-90%" },
      { name: "Certificate of Brilliance", score: "71-80%" }
    ],
    feeIncludes: [
      "Examination Fee",
      "Student's Performance Report (SPR)",
      "2 Previous Question Papers (E-Book)",
      "Cyber Success E-Book",
      "Online payment service charges"
    ]
  },
  umo: {
    id: "umo",
    name: "UMO",
    fullName: "Unified Monthly Olympiad",
    tagline: "Strengthen Every Chapter, Every Month",
    subject: "Mathematics Only",
    classes: "1-10",
    icon: Globe,
    color: "amber",
    participants: "3 Lakh+",
    mockDate: "Ongoing",
    examDate: "Ongoing",
    fee: "650",
    resultsIn: "1 - 10",
    description: `Unified Monthly Olympiads (UMO) is a unique monthly Olympiad programme. These Olympiads are conducted online, per chapter, per subject, per month. The UMO provides a short, quick tour through sub-topics and details to check how deep and firm the roots of learning the fundamentals are.

    This works like a refresher course on topics a student already knows. As it deals thoroughly with all sub-topics of a chapter, it brings about a truly all-round progress for every participant. A regular upkeep of this kind instils in them an attitude to be on their toes at all times, ready to take on a challenge, with a high degree of confidence and strive for the better each time.

    After the test, an analysis is provided on the progress, sub-topic wise of that chapter. This helps a student know, where he/she stands chapter-wise and focus on sub-topics where he/she is weak. This helps a student strengthen command over each chapter thoroughly and be prepared for the annual Olympiad with confidence.

    NOTE: A student who joins the UMO programme at a later date/time in its cycle, can still avail of the past exams from the programme, as those will be kept active on his/her dashboard. This is done in order not to deprive him/her of the benefit. Moreover, the past exams can be given at any time as per the student’s convenience.`,

    whyExam: [
      "Strengthens chapter-wise concepts and fundamentals",
      "Provides detailed sub-topic wise performance analysis",
      "Helps students identify and improve weak areas",
      "Includes remedial tests for sub-topics scoring below 80%",
      "Builds confidence through continuous monthly practice",
      "Prepares students effectively for annual Olympiads",
      "Encourages regular learning and academic discipline"
    ],

    eligibility:
      "Students of classes 1, 2, 3, 4, 5, 6, 7, 8, 9 and 10 are eligible to participate.",

    examPattern: [
      {
        classes: "All Classes",
        questions: 20,
        marks: 20,
        duration: "30 minutes"
      }
    ],

    syllabusSections: [
      {
        name: "All Classes",
        subjects: [
          { name: "Mathematics", marks: 10 },
          { name: "Science", marks: 10 }
        ]
      }
    ],

    awards: [
      {
        rank: "Top Performers",
        prize: "Medal + Certificate + Recognition",
        icon: Trophy
      },
      {
        rank: "Outstanding Students",
        prize: "Certificate of Excellence",
        icon: IndianRupee
      },
      {
        rank: "High Achievers",
        prize: "Merit Certificate",
        icon: Medal
      },
      {
        rank: "Active Participants",
        prize: "Participation Certificate",
        icon: Star
      }
    ],

    certificates: [
      {
        name: "Certificate of Scholar",
        score: "91-100%"
      },
      {
        name: "Certificate of Distinction",
        score: "81-90%"
      },
      {
        name: "Certificate of Brilliance",
        score: "71-80%"
      }
    ],

    feeIncludes: [
      "Online Monthly Olympiad Examination",
      "Detailed Sub-Topic Wise Performance Report",
      "Immediate Remedial Tests for Weak Sub-Topics",
      "Chapter-Wise Practice and Analysis",
      "Performance Tracking Dashboard",
      "Previous Exams Access",
      "Online payment service charges"
    ]
  }
};

const colorMap = {
  purple: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-600", accent: "bg-violet-400", light: "bg-violet-100", gradient: "from-violet-300 to-fuchsia-400", dark: "bg-violet-800" },
  green: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", accent: "bg-emerald-400", light: "bg-emerald-100", gradient: "from-emerald-300 to-teal-400", dark: "bg-emerald-800" },
  pink: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-600", accent: "bg-rose-400", light: "bg-rose-100", gradient: "from-rose-300 to-pink-400", dark: "bg-rose-800" },
  sky: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-600", accent: "bg-sky-400", light: "bg-sky-100", gradient: "from-sky-300 to-cyan-400", dark: "bg-sky-800" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", accent: "bg-amber-400", light: "bg-amber-100", gradient: "from-amber-300 to-orange-400", dark: "bg-amber-800" },
};

const ExamDetailPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Normalize examId to lowercase for lookup
  const exam = EXAM_DATA[examId?.toLowerCase()];
  const returnToRegister = location.state?.returnToRegister;

  const navigateBack = () => {
    if (returnToRegister) {
      navigate("/indregister", {
        state: {
          fromExamDetails: true,
          ...returnToRegister,
        },
      });
      return;
    }

    navigate("/options");
  };

  const navigateToRegister = () => {
    if (returnToRegister) {
      navigate("/indregister", {
        state: {
          fromExamDetails: true,
          ...returnToRegister,
        },
      });
      return;
    }

    navigate("/indregister");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [examId]);

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Exam not found</h1>
          <Button onClick={navigateBack} className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Options
          </Button>
        </div>
      </div>
    );
  }

  const colors = colorMap[exam.color];
  const IconComponent = exam.icon;

  return (
    <div className="min-h-screen bg-slate-50" data-testid={`exam-detail-${examId}`}>
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_kids-edu-new/artifacts/jpg6s12y_logo%20%281%29.png" 
              alt="Unified Council Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="font-black text-lg text-slate-800">Unified Council</h1>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={navigateBack}
              className="rounded-full font-semibold border-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Exams
            </Button>
            <Button
              onClick={navigateToRegister}
              className={`rounded-full font-bold ${colors.accent} hover:opacity-90`}
            >
              Register Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative py-16 md:py-24 bg-gradient-to-br ${colors.gradient} overflow-hidden`}>
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-white/70 text-sm mb-6 justify-center lg:justify-start">
                <a href="/" className="hover:text-white">Home</a>
                <ChevronRight className="w-4 h-4" />
                <a href="/options" className="hover:text-white">Options</a>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white font-semibold">{exam.name}</span>
              </div>

              <div className={`inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-6`}>
                <Users className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">{exam.participants} Students Participated</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                {exam.name}
              </h1>
              <p className="text-xl text-white/90 font-medium mb-2">{exam.fullName}</p>
              <p className="text-lg text-white/70 mb-8">{exam.tagline}</p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <Badge className="bg-white/20 text-white font-semibold px-4 py-2 text-sm">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Classes {exam.classes}
                </Badge>
                <Badge className="bg-white/20 text-white font-semibold px-4 py-2 text-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {exam.subject}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={navigateToRegister}
                  className="rounded-full font-bold px-8 py-6 text-lg bg-white text-slate-800 hover:bg-slate-100"
                >
                  Register for {exam.name}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full font-bold px-8 py-6 text-lg border-2 border-white text-white hover:bg-white/10"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Syllabus
                </Button>
              </div>
            </div>

            {/* Quick Info Cards */}
            {exam.id === "umo" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
                  <p className="text-white font-black text-3xl mb-3">UMO</p>
                  <p className="text-white/90 font-semibold leading-relaxed mb-4">
                    Math Chapter-wise &amp; with Remedial Tests
                  </p>
                  <div className="space-y-2">
                    <p className="text-white/90 font-black text-3xl line-through decoration-red-500 decoration-[5px]">
                      Rs. 1250
                    </p>
                    <p className="text-white font-black text-4xl">Rs. 650</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
                  <p className="text-white font-black text-3xl mb-3">UMO</p>
                  <p className="text-white/90 font-semibold leading-relaxed mb-4">
                    Science Chapter-wise &amp; with Remedial Tests
                  </p>
                  <div className="space-y-2">
                    <p className="text-white/90 font-black text-3xl line-through decoration-red-500 decoration-[5px]">
                      Rs. 1250
                    </p>
                    <p className="text-white font-black text-4xl">Rs. 651</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
                  <p className="text-white font-black text-3xl mb-3">UMO</p>
                  <p className="text-white/90 font-semibold leading-relaxed mb-4">
                    Math &amp; Science Chapter-wise &amp; with Remedial Tests
                  </p>
                  <div className="space-y-2">
                    <p className="text-white/90 font-black text-3xl line-through decoration-red-500 decoration-[5px]">
                      Rs. 2000
                    </p>
                    <p className="text-white font-black text-4xl">Rs. 850</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center flex items-center justify-center min-h-[180px]">
                  <p className="text-white font-black text-3xl">Ongoing</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
                  <Calendar className="w-8 h-8 text-white mx-auto mb-3" />
                  <p className="text-white/70 text-sm mb-1">Mock Exam</p>
                  <p className="text-white font-bold">{exam.mockDate}</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
                  <Calendar className="w-8 h-8 text-white mx-auto mb-3" />
                  <p className="text-white/70 text-sm mb-1">Final Exam</p>
                  <p className="text-white font-bold">{exam.examDate}</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
                  <IndianRupee className="w-8 h-8 text-white mx-auto mb-3" />
                  <p className="text-white/70 text-sm mb-1">Exam Fee</p>
                  <p className="text-white font-bold text-2xl">₹{exam.fee}</p>
                </div>    
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6 text-center">
                  <BookOpen className="w-8 h-8 text-white mx-auto mb-3" />
                  <p className="text-white/70 text-sm mb-1">Classes</p>
                  <p className="text-white font-bold">{exam.resultsIn}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            <div>
              <div className={`inline-flex items-center gap-2 ${colors.bg} border-2 ${colors.border} rounded-full px-4 py-2 mb-4`}>
                <IconComponent className={`w-4 h-4 ${colors.text}`} />
                <span className={`text-sm font-black uppercase tracking-wider ${colors.text}`}>
                  About {exam.name}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6">
                Why {exam.name}?
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {exam.description}
              </p>
              
              <ul className="space-y-4">
                {exam.whyExam.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className={`w-6 h-6 ${colors.text} flex-shrink-0 mt-0.5`} />
                    <span className="text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Eligibility */}
              <div className={`${colors.bg} rounded-3xl p-8 mb-6`}>
                <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                  <GraduationCap className={`w-6 h-6 ${colors.text}`} />
                  Eligibility
                </h3>
                <p className="text-slate-700">{exam.eligibility}</p>
              </div>

              {/* Fee Includes */}
              <div className="bg-slate-50 rounded-3xl p-8">
                <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                  <Gift className={`w-6 h-6 ${colors.text}`} />
                  Fee Includes (₹{exam.fee})
                </h3>
                <ul className="space-y-3">
                  {exam.feeIncludes.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Pattern Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 ${colors.bg} border-2 ${colors.border} rounded-full px-4 py-2 mb-4`}>
              <FileText className={`w-4 h-4 ${colors.text}`} />
              <span className={`text-sm font-black uppercase tracking-wider ${colors.text}`}>
                Exam Structure
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              Exam Pattern & Syllabus
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              All questions are objective-type with no negative marking for wrong answers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Exam Pattern Table */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6">Exam Pattern</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${colors.bg}`}>
                      <th className="px-4 py-3 text-left font-bold text-slate-800 rounded-tl-xl">Classes</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-800">Questions</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-800">Marks</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-800 rounded-tr-xl">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam.examPattern.map((pattern, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="px-4 py-4 font-semibold text-slate-700">{pattern.classes}</td>
                        <td className="px-4 py-4 text-center text-slate-600">{pattern.questions}</td>
                        <td className="px-4 py-4 text-center text-slate-600">{pattern.marks}</td>
                        <td className="px-4 py-4 text-center text-slate-600">{pattern.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Syllabus Breakdown */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6">Marks Distribution</h3>
              <div className="space-y-6">
                {exam.syllabusSections.map((section, index) => (
                  <div key={index}>
                    <h4 className={`font-bold ${colors.text} mb-3`}>{section.name}</h4>
                    <div className="space-y-2">
                      {section.subjects.map((subject, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                          <span className="text-slate-700">{subject.name}</span>
                          <Badge className={`${colors.bg} ${colors.text} font-bold`}>{subject.marks} marks</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      {exam.id === "umo" ? (
        <UMORemedialSection />
      ) : (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-100 rounded-full px-4 py-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-black uppercase tracking-wider text-amber-600">
                Awards & Recognition
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              Prizes for Achievers
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Top performers are rewarded with exciting prizes, and recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {exam.awards.map((award, index) => (
              <div key={index} className={`${colors.bg} border-2 ${colors.border} rounded-3xl p-6 text-center`}>
                <div className={`w-16 h-16 ${colors.light} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <award.icon className={`w-8 h-8 ${colors.text}`} />
                </div>
                <h3 className="font-black text-slate-800 mb-2">{award.rank}</h3>
                <p className="text-slate-600 text-sm">{award.prize}</p>
              </div>
            ))}
          </div>

          {/* Certificates */}
          <div className="bg-slate-50 rounded-3xl p-8">
            <h3 className="text-xl font-black text-slate-800 mb-6 text-center">Performance Certificates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {exam.certificates.map((cert, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 text-center border-2 border-slate-100">
                  <BadgeCheck className={`w-10 h-10 ${colors.text} mx-auto mb-3`} />
                  <h4 className="font-bold text-slate-800 mb-1">{cert.name}</h4>
                  <p className="text-slate-500 text-sm">Score: {cert.score}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-500 text-sm mt-6">
              Digital Certificate and Student's Performance Report (SPR) are given to every participant.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* CTA Section */}
      <section className={`py-16 bg-gradient-to-r ${colors.gradient}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Take the Challenge?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Register now for {exam.name} and unlock your potential!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={navigateToRegister}
              className="rounded-full font-bold px-10 py-6 text-lg bg-white text-slate-800 hover:bg-slate-100"
            >
              Register for {exam.name}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={navigateBack}
              className="rounded-full font-bold px-10 py-6 text-lg border-2 border-white text-white hover:bg-white/10"
            >
              Explore Other Exams
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8">
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
              <a href="/options" className="text-slate-400 hover:text-white text-sm font-medium">Options</a>
              <a href="/indregister" className="text-slate-400 hover:text-white text-sm font-medium">Register</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ExamDetailPage;
