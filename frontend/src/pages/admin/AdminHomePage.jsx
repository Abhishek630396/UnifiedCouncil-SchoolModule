import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  CircleHelp,
  FileText,
  GraduationCap,
  RefreshCw,
  UsersRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API_BASE_URL from "@/services/apiBaseUrl";
import AdminSideBar from "./AdminSideBar";
import { getAdminAuthorization, hasAdminPermission } from "./adminPermissions";

const overviewCards = [
  {
    key: "schoolStudents",
    permission: "school_students.view",
    title: "School student registrations",
    description: "Students registered through schools",
    to: "/admin/registrations",
    icon: UsersRound,
    colors: "from-sky-500 to-blue-600",
    iconBg: "bg-sky-50 text-sky-700",
  },
  {
    key: "individualStudents",
    permission: "individual_students.view",
    title: "Individual registrations",
    description: "Students registered independently",
    to: "/admin/individual-registrations",
    icon: GraduationCap,
    colors: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-50 text-violet-700",
  },
  {
    key: "schools",
    permission: "registered_schools.view",
    title: "Registered schools",
    description: "Schools in your registration system",
    to: "/admin/registered-schools",
    icon: Building2,
    colors: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "enquiries",
    permission: "enquiries.view",
    title: "School enquiries",
    description: "Enquiries received from schools",
    to: "/admin/enquiries",
    icon: CircleHelp,
    colors: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-50 text-amber-700",
  },
];

const quickLinks = [
  {
    title: "Exam pricing",
    permission: "exam_prices.view",
    description: "Review and manage exam prices",
    to: "/admin/exam-prices",
    icon: BookOpenCheck,
    iconBg: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Pending records",
    permission: "school_students.view",
    description: "Follow up on incomplete registrations",
    to: "/admin/pending-records",
    icon: FileText,
    iconBg: "bg-rose-50 text-rose-700",
  },
  {
    title: "Website content",
    permission: "static_content.view",
    description: "Update hot links and achievers",
    to: "/static-content-admin/hot-links",
    icon: FileText,
    iconBg: "bg-indigo-50 text-indigo-700",
  },
];

const getTotal = (response, title) => {
  const total = Number(response.data?.pagination?.total);
  if (!response.data?.success || !Number.isFinite(total)) {
    throw new Error(`Unable to load ${title.toLowerCase()} total.`);
  }
  return total;
};

const AdminHomePage = () => {
  const navigate = useNavigate();
  const [authorization] = useState(getAdminAuthorization);
  const visibleCards = overviewCards.filter((card) => hasAdminPermission(card.permission, authorization));
  const visibleQuickLinks = quickLinks.filter((item) => hasAdminPermission(item.permission, authorization));
  const [totals, setTotals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("uc_admin_token");
    if (!token) return undefined;

    const controller = new AbortController();
    const config = {
      params: { page: 1, pageSize: 1 },
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    };

    setIsLoading(true);
    const requests = [
      ["schoolStudents", "school_students.view", "/admin/school-students", "school student registrations"],
      ["individualStudents", "individual_students.view", "/admin/individual-registrations", "individual registrations"],
      ["schools", "registered_schools.view", "/school-registration/registered-schools", "registered schools"],
      ["enquiries", "enquiries.view", "/admin/enquiries", "school enquiries"],
    ].filter(([, permission]) => hasAdminPermission(permission, authorization));
    Promise.all(requests.map(async ([key, , path, label]) => {
      const response = await axios.get(`${API_BASE_URL}${path}`, config);
      return [key, getTotal(response, label)];
    }))
      .then((results) => {
        setTotals(Object.fromEntries(results));
      })
      .catch((error) => {
        if (error.code === "ERR_CANCELED") return;
        if (error.response?.status === 401) {
          localStorage.removeItem("uc_admin_token");
          navigate("/school/login", { replace: true });
          return;
        }
        toast.error(error.response?.data?.message || error.message || "Unable to load the admin overview.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [authorization, navigate, refreshKey]);

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="flex flex-col lg:flex-row">
        <AdminSideBar />
        <main className="min-w-0 flex-1 p-3 sm:p-5 lg:pl-6">
          <div className="mx-auto max-w-[1600px] space-y-6">
            <header className="relative isolate overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#101c49] via-[#174a79] to-[#0c8291] px-6 py-8 text-white shadow-xl shadow-sky-950/10 sm:px-9 sm:py-10">
              <div className="pointer-events-none absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="pointer-events-none absolute bottom-[-8rem] right-1/3 -z-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
              <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
                <div className="max-w-2xl">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
                    Admin control center
                  </div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Welcome back</h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-sky-50/85 sm:text-base">
                    Your school registrations, student activity and enquiries — all in one place.
                  </p>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur sm:min-w-56 sm:flex-col sm:items-start">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">Today</span>
                  <span className="text-sm font-bold text-white sm:text-right">{formattedDate}</span>
                </div>
              </div>
            </header>

            <section aria-labelledby="overview-heading">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 id="overview-heading" className="text-xl font-extrabold tracking-tight text-slate-900">Your overview</h2>
                  <p className="mt-1 text-sm text-slate-500">Live totals from your admin records</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTotals(null);
                    setRefreshKey((current) => current + 1);
                  }}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-700 disabled:cursor-wait disabled:opacity-60"
                  aria-label="Refresh overview"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
                  <span className="hidden sm:inline">{isLoading ? "Updating" : "Refresh"}</span>
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {visibleCards.map((card) => {
                  const Icon = card.icon;
                  const total = totals?.[card.key];
                  return (
                    <Link
                      key={card.key}
                      to={card.to}
                      className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className={`rounded-full bg-gradient-to-r ${card.colors} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white`}>
                          Live
                        </span>
                      </div>
                      <p className="mt-5 text-sm font-semibold text-slate-500">{card.title}</p>
                      <p className="mt-1 text-3xl font-black tracking-tight text-slate-900" aria-live="polite">
                        {isLoading ? "—" : total === undefined ? "—" : total.toLocaleString("en-IN")}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-500">{card.description}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-600" aria-hidden="true" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="shortcuts-heading" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 id="shortcuts-heading" className="text-xl font-extrabold tracking-tight text-slate-900">Quick access</h2>
                <p className="mt-1 text-sm text-slate-500">Jump straight to frequently used admin tools</p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {visibleQuickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      to={item.to}
                      className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-sky-200 hover:bg-sky-50/60"
                    >
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-slate-800">{item.title}</span>
                        <span className="mt-1 block text-sm text-slate-500">{item.description}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-600" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHomePage;
