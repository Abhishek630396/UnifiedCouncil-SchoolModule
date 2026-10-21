import { useState } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import ExamsSection from "../components/ExamsSection";
import SchoolModule from "../components/SchoolModule";
import ResourcesSection from "../components/ResourcesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ParticipatingSchools from "../components/ParticipatingSchools";
import Footer from "../components/Footer";
import RegistrationModal from "../components/RegistrationModal";
import ResultsModal from "../components/ResultsModal";

// Static Data
const EXAMS = [
  {
    id: "uco",
    name: "UCO",
    full_name: "Unified Cyber Olympiad",
    subject: "Computer Science",
    classes: "1-12",
    color: "sky",
    offline_date: "10-09-2025",
    online_date: "27-12-2026",
    icon: "Monitor"
  },
  {
    id: "uigko",
    name: "UIGKO",
    full_name: "Unified International General Knowledge Olympiad",
    subject: "General Knowledge",
    classes: "1-10",
    color: "amber",
    offline_date: "09-10-2025",
    online_date: null,
    icon: "Globe"
  },
  {
    id: "uieo",
    name: "UIEO",
    full_name: "Unified International English Olympiad",
    subject: "English",
    classes: "1-12",
    color: "pink",
    offline_date: "11-11-2025",
    online_date: "04-01-2026",
    icon: "BookOpen"
  },
  {
    id: "uimo",
    name: "UIMO",
    full_name: "Unified International Mathematics Olympiad",
    subject: "Mathematics",
    classes: "1-12",
    color: "green",
    offline_date: "30-01-2026",
    online_date: "11-01-2026",
    icon: "Calculator"
  },
  {
    id: "nstse",
    name: "NSTSE",
    full_name: "National Science Talent Search Examination",
    subject: "Science",
    classes: "1-12",
    color: "purple",
    offline_date: "05-12-2025",
    online_date: "25-01-2026",
    icon: "Atom"
  },
  {
    id: "umo",
    name: "UMO",
    full_name: "Unified Mathematics Olympiad",
    subject: "Advanced Mathematics",
    classes: "6-12",
    color: "orange",
    offline_date: null,
    online_date: "15-02-2026",
    icon: "Sigma"
  }
];

const RESOURCES = [
  {
    id: "stepup",
    name: "Step-Up Series",
    description: "Progressive learning materials for classes 1-10",
    classes: "1-10",
    icon: "TrendingUp",
    color: "sky"
  },
  {
    id: "crossword",
    name: "Crossword Puzzles",
    description: "Fun vocabulary building games for young learners",
    classes: "1-5",
    icon: "Grid3X3",
    color: "pink"
  },
  {
    id: "aptitude",
    name: "Aptitude Test",
    description: "Brain teasers and logical reasoning exercises",
    classes: "1-5",
    icon: "Brain",
    color: "amber"
  },
  {
    id: "mocktest",
    name: "Mock Test",
    description: "Practice tests simulating real exam conditions",
    classes: "1-10",
    icon: "FileText",
    color: "green"
  }
];

const TESTIMONIALS = [
  {
    id: "1",
    name: "Mr. R. Jagan",
    school: "Kennedy High School, Narendra Puram",
    text: "It is very good for the children to develop their knowledge in English. Our children show so much interest for the preparation which I had never noticed. I appreciate the efforts made to improve English standards.",
    role: "Principal"
  },
  {
    id: "2",
    name: "Ms. Namrata Gupta",
    school: "Bishop Conrod Sr. Sec. School, Dohna",
    text: "The examinations undoubtedly inculcates the understanding of the fundamentals of education & helps in bringing out effective change on the talent pool of the students.",
    role: "Vice Principal"
  },
  {
    id: "3",
    name: "Mrs. Saroj Gupta",
    school: "Somerville School, Greater Noida",
    text: "These exams are a launch pad for students enabling them to prepare for future competitions. Unified Council is doing a tremendous job.",
    role: "Principal"
  },
  {
    id: "4",
    name: "Dr. Bhavana Shukla",
    school: "Imperial Public School, Varanasi",
    text: "The need of the hour is to build a fundamental base as strong as possible. These tests are scientifically designed to test concepts in an interesting manner.",
    role: "Director"
  },
  {
    id: "5",
    name: "Mrs. Seema Sharma",
    school: "Nehru International Public School, Noida",
    text: "I appreciate your commitment in moulding young talent through their intellectual competency. The standard of the question papers are exceptional.",
    role: "Principal"
  }
];

const STATS = [
  { label: "ISO Certified", value: "1st", icon: "Award" },
  { label: "Years of Excellence", value: "29+", icon: "Award" },
  { label: "Students Reached", value: "14M+", icon: "Users" },
  { label: "Partner Schools", value: "5000+", icon: "Building2" },
  { label: "Countries", value: "30+", icon: "Globe2" }
];

const HomePage = () => {
  // Modal states
  const [showRegistration, setShowRegistration] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [registrationType, setRegistrationType] = useState("student");

  const openRegistration = (type, exam = null) => {
    setRegistrationType(type);
    setSelectedExam(exam);
    setShowRegistration(true);
  };

  const openResults = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero" data-testid="homepage">
      <Header 
        onRegister={() => openRegistration("student")} 
        onResults={openResults}
      />
      
      <main>
        {/* { <StatsSection stats={STATS} /> } */}

        <HeroSection 
          onRegister={() => openRegistration("student")}
          onResults={openResults}
        />
        
        <ExamsSection 
          exams={EXAMS} 
          onEnroll={(exam) => openRegistration("student", exam)}
        />
        
        <SchoolModule 
          onSchoolRegister={() => openRegistration("school")}
        />
        
        <ResourcesSection resources={RESOURCES} />
        
        <TestimonialsSection testimonials={TESTIMONIALS} />
        
        <ParticipatingSchools />
        
        <Footer />
      </main>

      {/* Modals */}
      {showRegistration && (
        <RegistrationModal
          type={registrationType}
          exam={selectedExam}
          exams={EXAMS}
          onClose={() => setShowRegistration(false)}
        />
      )}

      {showResults && (
        <ResultsModal
          exams={EXAMS}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
