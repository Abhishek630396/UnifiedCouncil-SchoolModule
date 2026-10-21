import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/App.css";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import RegistrationPage from "./pages/RegistrationPage";
// import RazorpayPaymentPage from "./pages/RazorpayPaymentPage";
import OptionsPage from "./pages/OptionsPage";
import ExamDetailPage from "./pages/ExamDetailPage";
import ExamDetailPageOption2 from "./pages/ExamDetailPageOption2";
import ExamDetailPageOption3 from "./pages/ExamDetailPageOption3";
import TermsandConditions from "./pages/TermsandConditions";
import INDRegistrationPage from "./pages/IND_REGISTER/INDRegistrationPage";
import INDRegistrationPagesm from "./pages/IND_REGISTER/INDRegistrationPagesm";
import InternationalRegistrationPage from "./pages/INTERNATIONAL_REGISTER/InternationalRegistrationPage";
import { Toaster } from "./components/ui/sonner";
import {SchoolRegistration} from "./pages/school/registration/SchoolRegistration";
import ScrollToTop from "./components/ScrollToTop";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHomePage from "./pages/admin/AdminHomePage";
import ManageExamsDates from "./pages/admin/ManageExamsDates";
import ExamPricesAccess from "./pages/admin/ExamPricesAccess";
import StudentRegistrationThroughtSchool from "./pages/school/registration/StudentRegistrationThroughtSchool";
import StudentRegistrationExperience from "./pages/school/registration/StudentRegistrationExperience";
import SchoolRegistrationPaymentResultPage from "./pages/school/registration/SchoolRegistrationPaymentResultPage";
import RegisteredSchools from "./pages/admin/RegisteredSchools";
import SelectedSchoolDetails from "./pages/admin/SelectedSchoolDetails";
import SelectedSchoolRegisteredStudentsList from "./pages/admin/SelectedSchoolRegisteredStudentsList";
import ManageEnquiries from "./pages/admin/ManageEnquiries";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import IndividualStudentRegistrations from "./pages/admin/IndividualStudentRegistrations";
import AdminToolPlaceholder from "./pages/admin/AdminToolPlaceholder";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminStaticContentHotLinksPage from "./pages/admin/AdminStaticContentHotLinksPage";
import AdminStaticContentAchieversPage from "./pages/admin/AdminStaticContentAchieversPage";
import SchoolsPage from "./pages/SchoolsPage";
import SchoolEnquiryPage from "./pages/SchoolEnquiryPage";
import SchoolEnquirySuccessPage from "./pages/SchoolEnquirySuccessPage";
import DownloadsPage from "./pages/DownloadsPage";
import SchoolDashboardLoginPage from "./pages/schoolDashboard/SchoolDashboardLoginPage";
import SchoolDashboardRecoveryPage from "./pages/schoolDashboard/SchoolDashboardRecoveryPage";
import SchoolDashboardLayout from "./pages/schoolDashboard/SchoolDashboardLayout";
import SchoolDashboardOverview from "./pages/schoolDashboard/SchoolDashboardOverview";
import SchoolDashboardStudents from "./pages/schoolDashboard/SchoolDashboardStudents";
import {
  SchoolChangePasswordPage,
  SchoolDashboardPlaceholder,
  SchoolProfilePage,
} from "./pages/schoolDashboard/SchoolDashboardSections";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/schools" replace />} />
          {/* <Route path="/register" element={<RegistrationPage />} /> */}
          <Route path="/register/india" element={<INDRegistrationPage />} />
          <Route path="/indregister" element={<INDRegistrationPage />} />
          <Route path="/options-sm" element={<INDRegistrationPagesm />} />
          {/* <Route path="/register/international" element={<InternationalRegistrationPage />} /> */}
          {/* Razorpay disabled. Keep only CCAvenue payment flow active. */}
          {/* <Route path="/register/payment" element={<RazorpayPaymentPage />} /> */}
          <Route path="/register/payment/failed" element={<PaymentFailedPage />} />
          <Route path="/register/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment-failure" element={<PaymentFailedPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/terms-and-conditions" element={<TermsandConditions />} />
          <Route path="/options" element={<OptionsPage />} />
          <Route path="/landing" element={<Navigate to="/schools" replace />} />
          <Route path="/schoolss" element={<SchoolsPage />} />
          <Route path="/schools" element={<SchoolsPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/school-enquiry" element={<SchoolEnquiryPage />} />
          <Route path="/school-enquiry-success" element={<SchoolEnquirySuccessPage />} />
          <Route path="/exam/:examId" element={<ExamDetailPage />} />
          <Route path="/exam/:examId/option-2" element={<ExamDetailPageOption2 />} />
          <Route path="/exam/:examId/option-3" element={<ExamDetailPageOption3 />} />
          <Route path="/school-registration" element={<SchoolRegistration />} />
          <Route path="/student-registration-through-school" element={<StudentRegistrationThroughtSchool />} />
          <Route
            path="/student-registration-through-school/payment/success"
            element={<SchoolRegistrationPaymentResultPage success />}
          />
          <Route
            path="/student-registration-through-school/payment/failed"
            element={<SchoolRegistrationPaymentResultPage success={false} />}
          />
          <Route path="/register-student" element={<StudentRegistrationExperience />} />
          <Route path="/school-dashboard/login" element={<SchoolDashboardLoginPage />} />
          <Route path="/school-dashboard/forgot-password" element={<SchoolDashboardRecoveryPage mode="forgot" />} />
          <Route path="/school-dashboard/reset-password" element={<SchoolDashboardRecoveryPage mode="reset" />} />
          <Route path="/school-dashboard" element={<SchoolDashboardLayout />}>
            <Route index element={<SchoolDashboardOverview />} />
            <Route path="students" element={<SchoolDashboardStudents />} />
            <Route path="exam-registrations" element={<SchoolDashboardPlaceholder title="Exam Registrations" message="Review Olympiad-by-Olympiad registrations from the Student Registrations section." linkTo="/school-dashboard/students" linkLabel="View student registrations" />} />
            <Route path="results" element={<SchoolDashboardPlaceholder title="Results" message="Results will be available here once published." />} />
            <Route path="profile" element={<SchoolProfilePage />} />
            <Route path="change-password" element={<SchoolChangePasswordPage />} />
          </Route>
          <Route path="/schools/Admin/login" element={<AdminLogin />} />
          <Route path="/school/login" element={<Navigate to="/schools/Admin/login" replace />} />
          <Route path="/admin/login" element={<Navigate to="/schools/Admin/login" replace />} />
          <Route path="/SuperAdmin" element={<AdminHomePage />} />
          <Route path="/Admin" element={<Navigate to="/SuperAdmin" replace />} />
          <Route path="/admin/user-management" element={<AdminUserManagement />} />
          <Route path="/static-content-admin/login" element={<Navigate to="/static-content-admin/hot-links" replace />} />
          <Route path="/static-content-admin" element={<Navigate to="/static-content-admin/hot-links" replace />} />
          <Route path="/static-content-admin/dashboard" element={<Navigate to="/static-content-admin/hot-links" replace />} />
          <Route path="/static-content-admin/profile" element={<Navigate to="/static-content-admin/hot-links" replace />} />
          <Route path="/static-content-admin/hot-links" element={<AdminStaticContentHotLinksPage />} />
          <Route path="/static-content-admin/achievers" element={<AdminStaticContentAchieversPage />} />
          <Route path="/admin/exam-dates" element={<ManageExamsDates />} />
          <Route path="/admin/exam-prices" element={<ExamPricesAccess />} />
          <Route path="/admin/registrations" element={<AdminRegistrations />} />
          <Route path="/admin/individual-registrations" element={<IndividualStudentRegistrations />} />
          <Route path="/admin/tools/:tool" element={<AdminToolPlaceholder />} />
          <Route path="/admin/pending-records" element={<AdminRegistrations pendingOnly />} />
          <Route path="/admin/pending-records/individual" element={<IndividualStudentRegistrations pendingOnly />} />
          <Route path="/admin/tools/pending-records-individual" element={<IndividualStudentRegistrations pendingOnly />} />
          <Route path="/admin/registered-schools" element={<RegisteredSchools />} />
          <Route path="/admin/registered-schools/:schoolId" element={<SelectedSchoolDetails />} />
          <Route path="/admin/registered-schools/:schoolId/students" element={<SelectedSchoolRegisteredStudentsList />} />
          <Route path="/admin/enquiries" element={<ManageEnquiries />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
