import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/App.css";
import HomePage from "./pages/HomePage";
import OptionsPage from "./pages/OptionsPage";
import ExamDetailPage from "./pages/ExamDetailPage";
import OfflineExamPage from "./pages/OfflineExamPage";
import AwardsCelebrationsPage from "./pages/AwardsCelebrationsPage";
import AwardsArchivePage from "./pages/AwardsArchivePage";
import AchieversPage from "./pages/AchieversPage";
import StepUpPage from "./pages/StepUpPage";
import StepUpSubjectPage from "./pages/StepUpSubjectPage";
import CrosswordPage from "./pages/CrosswordPage";
import AptitudePage from "./pages/AptitudePage";
import MockTestPage from "./pages/MockTestPage";
import AboutPage from "./pages/AboutPage";
import MissionPage from "./pages/MissionPage";
import SuccessSeriesPage from "./pages/SuccessSeriesPage";
import FAQPage from "./pages/FAQPage";
import DownloadsPage from "./pages/DownloadsPage";
import ContactPage from "./pages/ContactPage";
import SchoolAwards from "./pages/SchoolAwards";
import MakeQuestions from "./pages/MakeQuestions";
import CareersPage from "./pages/Carrers";
import PreviousQuestionPapers from "./pages/PreviousQuestionPapers";
import ExamArchivers from "./pages/ExamArchivers";
import ParentsPage from "./pages/Parents";
import CoordinatorPage from "./pages/Coordinator";
import UserLoginPage from "./pages/UserLoginPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import { Toaster } from "./components/ui/sonner";

function RegisterRedirect() {
  useEffect(() => {
    window.location.replace("https://register.unifiedcouncil.com");
  }, []);

  return null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <FloatingSocialTools /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/user-dashboard" element={<UserDashboardPage />} />
          <Route path="/register" element={<RegisterRedirect />} />
          <Route path="/options" element={<OptionsPage />} />
          <Route path="/exam/:examId" element={<ExamDetailPage />} />
          <Route path="/exam/:examId/offline" element={<OfflineExamPage />} />
          <Route path="/awards-celebrations-2025" element={<AwardsCelebrationsPage year={2025} />} />
          <Route path="/awards-celebrations" element={<Navigate to="/awards-celebrations-2025" replace />} />
          <Route path="/events" element={<AwardsArchivePage />} />
          <Route path="/achievers" element={<AchieversPage />} />
          <Route path="/stepup" element={<StepUpPage />} />
          <Route path="/stepup/:subject" element={<StepUpSubjectPage />} />
          <Route path="/crosswords" element={<CrosswordPage />} />
          <Route path="/aptitude" element={<AptitudePage />} />
          <Route path="/mocktests" element={<MockTestPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/success-series" element={<SuccessSeriesPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/school-awards" element={<SchoolAwards />} />
          <Route path="/make-questions" element={<MakeQuestions />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/previous-question-papers" element={<PreviousQuestionPapers />} />
          <Route path="/exam-archives" element={<ExamArchivers />} />
          <Route path="/parents" element={<ParentsPage />} />
          <Route path="/coordinator" element={<CoordinatorPage />} />
          <Route path="/events/:slug" element={<AwardsCelebrationsPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
