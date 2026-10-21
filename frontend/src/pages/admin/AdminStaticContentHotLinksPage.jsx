import SchoolHeader from "../school/components/SchoolHeader";
import StaticContentAdminHotLinksPage from "../staticContentAdmin/AdminHotLinksPage";
import AdminSideBar from "./AdminSideBar";

const AdminStaticContentHotLinksPage = () => (
  <div className="min-h-screen bg-slate-50">
    <SchoolHeader />
    <div className="flex flex-col lg:flex-row">
      <AdminSideBar />
      <main className="min-w-0 flex-1 px-3 py-5 sm:px-5">
        <StaticContentAdminHotLinksPage />
      </main>
    </div>
  </div>
);

export default AdminStaticContentHotLinksPage;
