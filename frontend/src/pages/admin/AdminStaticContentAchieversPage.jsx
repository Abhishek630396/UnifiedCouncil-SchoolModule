import SchoolHeader from "../school/components/SchoolHeader";
import StaticContentAdminAchieversPage from "../staticContentAdmin/AdminAchieversPage";
import AdminSideBar from "./AdminSideBar";

const AdminStaticContentAchieversPage = () => (
  <div className="min-h-screen bg-slate-50">
    <SchoolHeader />
    <div className="flex flex-col lg:flex-row">
      <AdminSideBar />
      <main className="min-w-0 flex-1 px-3 py-5 sm:px-5">
        <StaticContentAdminAchieversPage />
      </main>
    </div>
  </div>
);

export default AdminStaticContentAchieversPage;
