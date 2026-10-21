import { useEffect, useState } from "react";
import { Building2, ClipboardList, GraduationCap, LayoutDashboard, LogOut, Loader2, LockKeyhole, School, Trophy } from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import schoolDashboardApi from "@/services/schoolDashboardApi";
import { Button } from "@/components/ui/button";

const LOGO_SRC = "/assests/logo/uc_logo.jpeg";
const navigation = [
  { to: "/school-dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/school-dashboard/students", label: "Student Registrations", icon: GraduationCap },
  { to: "/school-dashboard/exam-registrations", label: "Exam Registrations", icon: ClipboardList },
  { to: "/school-dashboard/results", label: "Results", icon: Trophy },
  { to: "/school-dashboard/profile", label: "School Profile", icon: Building2 },
  { to: "/school-dashboard/change-password", label: "Change Password", icon: LockKeyhole },
];

const SchoolDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const currentYear = new Date().getFullYear();
    setIsLoading(true);
    schoolDashboardApi.get("/school-dashboard/overview", {
      params: { year: currentYear },
      signal: controller.signal,
    })
      .then((response) => {
        setOverview(response.data?.data || null);
        setLoadError("");
      })
      .catch((error) => {
        if (error.code === "ERR_CANCELED") return;
        if (error.response?.status === 401) {
          navigate("/school-dashboard/login", { replace: true, state: { sessionExpired: true } });
          return;
        }
        setLoadError(error.response?.data?.message || "Unable to load your school dashboard.");
      })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false); });
    return () => controller.abort();
  }, [navigate]);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await schoolDashboardApi.post("/school-auth/logout");
      navigate("/school-dashboard/login", { replace: true });
    } catch (error) {
      setLoadError(error.response?.data?.message || "Unable to sign out. Please retry.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const refreshOverview = async (year = new Date().getFullYear()) => {
    const response = await schoolDashboardApi.get("/school-dashboard/overview", { params: { year } });
    setOverview(response.data?.data || null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img src={LOGO_SRC} alt="Unified Council" className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-950">Unified Council</p>
              <p className="text-xs font-medium text-slate-500">School Dashboard</p>
            </div>
          </Link>
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <p className="truncate text-sm font-bold text-slate-800">{overview?.school?.schoolName || "School account"}</p>
              <p className="text-xs text-slate-500">{overview?.school?.registrationId || ""}</p>
            </div>
            <Button type="button" variant="outline" onClick={logout} disabled={isLoggingOut} className="shrink-0 border-slate-300">
              {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-5 px-3 py-4 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-8 lg:py-7">
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-6">
          <div className="mb-3 flex items-center gap-2 px-2 py-2 text-sm font-bold text-slate-800 lg:mb-4">
            <School className="h-4 w-4 text-sky-700" /> School workspace
          </div>
          <nav aria-label="School dashboard" className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-h-10 items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors sm:text-sm ${isActive ? "bg-sky-50 text-sky-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0">{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          {isLoading ? (
            <div className="flex min-h-72 items-center justify-center gap-3 text-sm font-medium text-slate-600"><Loader2 className="h-5 w-5 animate-spin text-sky-700" />Loading your dashboard...</div>
          ) : loadError ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-800">
              <p className="font-semibold">{loadError}</p>
              <Button type="button" variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : overview ? (
            <Outlet context={{ school: overview.school, statistics: overview.statistics, recentStudents: overview.recentStudents || [], refreshOverview }} />
          ) : null}
        </main>
      </div>
      <div className="mx-auto max-w-[1600px] px-4 pb-6 text-xs text-slate-500 sm:px-6 lg:px-8">Unified Council · School administration</div>
    </div>
  );
};

export default SchoolDashboardLayout;
