import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  FileText,
  Link2,
  LogOut,
  School2,
  Trophy,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAdminAuthorization, hasAdminPermission } from "./adminPermissions";

const adminSections = [
  {
    id: "school-admin",
    title: "School Admin",
    icon: School2,
    items: [
      { label: "Exam Dates", to: "/admin/exam-dates", permission: "exam_dates.view" },
      { label: "Exam Prices", to: "/admin/exam-prices", permission: "exam_prices.view" },
      { label: "School Students", to: "/admin/registrations", permission: "school_students.view" },
      { label: "Individual Students", to: "/admin/individual-registrations", permission: "individual_students.view" },
      { label: "Registered Schools", to: "/admin/registered-schools", permission: "registered_schools.view" },
      {
        id: "pending-records",
        label: "Pending Records",
        children: [
          { label: "School Students Pending Records", to: "/admin/pending-records", permission: "school_students.view" },
          { label: "Individual Students Pending Records", to: "/admin/pending-records/individual", permission: "individual_students.view" },
        ],
      },
      { label: "Enquiries", to: "/admin/enquiries", permission: "enquiries.view" },
      { label: "Documents", to: "/admin/tools/documents", permission: "documents.view" },
      { label: "Create Tests", to: "/admin/tools/create-tests", permission: "tests.view" },
      { label: "Feedbacks", to: "/admin/tools/feedbacks", permission: "feedbacks.view" },
      { label: "Class Documents for Schools", to: "/admin/tools/class-documents", permission: "class_documents.view" },
      { label: "Register Coordinator", to: "/admin/tools/register-coordinator", permission: "coordinators.manage" },
      { label: "Coordinators List", to: "/admin/tools/coordinators-list", permission: "coordinators.view" },
      { label: "Unsubmitted Registration", to: "/admin/tools/unsubmitted-registration", permission: "unsubmitted_registrations.view" },
      { label: "QrUsers", to: "/admin/tools/qr-users", superAdminOnly: true },
    ],
  },
  {
    id: "individual-admin",
    title: "Individual Admin",
    icon: UserRound,
    items: [],
  },
  {
    id: "static-content-admin",
    title: "Static Content Admin",
    icon: FileText,
    items: [
      { label: "Hot Links", to: "/static-content-admin/hot-links", icon: Link2, permission: "static_content.view" },
      { label: "Achievers", to: "/static-content-admin/achievers", icon: Trophy, permission: "static_content.view" },
    ],
  },
];

const getActiveSection = (pathname) => {
  if (pathname === "/admin/user-management") return null;
  if (pathname.startsWith("/static-content-admin/")) return "static-content-admin";
  return pathname.startsWith("/admin/") ? "school-admin" : null;
};

const AdminSideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const authorization = getAdminAuthorization();
  const [expandedSection, setExpandedSection] = useState(getActiveSection(pathname));
  const [isPendingRecordsOpen, setIsPendingRecordsOpen] = useState(
    pathname.startsWith("/admin/pending-records") || pathname === "/admin/tools/pending-records-individual"
  );

  useEffect(() => {
    const activeSection = getActiveSection(pathname);
    setExpandedSection(activeSection);
    if (pathname.startsWith("/admin/pending-records") || pathname === "/admin/tools/pending-records-individual") {
      setIsPendingRecordsOpen(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("uc_admin_token");
    localStorage.removeItem("uc_admin_permissions");
    navigate("/school/login");
  };

  const handleToggleSection = (sectionId) => {
    setExpandedSection((current) => (current === sectionId ? null : sectionId));
  };

  return (
    <aside className="w-full shrink-0 p-3 pb-0 sm:px-5 lg:w-80 lg:p-5 lg:pr-0">
      <div className="relative isolate flex max-h-[calc(100vh-1.5rem)] flex-col overflow-x-hidden overflow-y-auto overscroll-contain rounded-[1.8rem] border border-violet-400/60 bg-gradient-to-b from-[#111b79] via-[#0d1765] to-[#080f50] p-4 text-white shadow-[0_20px_55px_rgba(23,25,110,0.28)] sm:p-5 lg:sticky lg:top-5 lg:max-h-[calc(100vh-2.5rem)]">
        <div className="pointer-events-none absolute -right-20 top-40 -z-10 h-52 w-52 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-14 -z-10 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />

        <Link
          to="/SuperAdmin"
          aria-label="Go to Admin home"
          className="mb-5 flex items-center gap-3 rounded px-1 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-white p-1 shadow-lg shadow-fuchsia-950/30">
            <img src="/assests/logo/uc_logo.jpeg" alt="Unified Council logo" className="h-full w-full rounded-full object-cover" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold leading-tight tracking-tight text-white">Unified Council</p>
            <p className="mt-1 text-xs font-medium text-indigo-100">Education for a Better Tomorrow</p>
          </div>
        </Link>

        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-violet-300/30 bg-indigo-950/40 p-3 shadow-inner shadow-white/5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-lg shadow-fuchsia-950/30">
            <UserRound className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-indigo-200">Welcome Back</p>
            <p className="mt-0.5 text-base font-extrabold text-white">Admin</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-indigo-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              Online
            </p>
          </div>
          <ChevronDown className="h-5 w-5 text-indigo-100" aria-hidden="true" />
        </div>

        <nav className="space-y-2.5" aria-label="Admin navigation">
          {authorization.isSuperAdmin && (
            <NavLink
              to="/admin/user-management"
              className={({ isActive }) => `group flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition duration-200 sm:px-4 sm:py-3 ${
                isActive
                  ? "border-violet-300/70 bg-gradient-to-br from-violet-600/35 to-indigo-700/40 text-white shadow-[0_8px_24px_rgba(6,10,58,0.22)]"
                  : "border-indigo-200/15 bg-indigo-950/35 text-indigo-50 hover:border-violet-300/40 hover:bg-indigo-900/40"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cyan-200 ring-1 ring-inset ring-white/10 transition group-hover:bg-gradient-to-br group-hover:from-fuchsia-500 group-hover:to-violet-600 group-hover:text-white">
                <UsersRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold tracking-tight text-white sm:text-base">User Management</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-indigo-200 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />
            </NavLink>
          )}
          {adminSections.map((section) => {
            const visibleItems = section.items.filter((item) => {
              if (item.superAdminOnly) return authorization.isSuperAdmin;
              if (item.children) {
                return item.children.some((child) => hasAdminPermission(child.permission, authorization));
              }
              return !item.permission || hasAdminPermission(item.permission, authorization);
            });
            if (section.items.length && !visibleItems.length) return null;
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;
            return (
              <section
                key={section.id}
                className={`overflow-hidden rounded-2xl border transition duration-200 ${
                  isExpanded
                    ? "border-violet-300/70 bg-gradient-to-br from-violet-600/25 to-indigo-700/30 shadow-[0_8px_24px_rgba(6,10,58,0.22)]"
                    : "border-indigo-200/15 bg-indigo-950/35 hover:border-violet-300/40 hover:bg-indigo-900/40"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`${section.id}-menu`}
                  onClick={() => handleToggleSection(section.id)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left sm:px-4 sm:py-3"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                    isExpanded
                      ? "bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow-lg shadow-fuchsia-950/30"
                      : "bg-white/5 text-cyan-200 ring-1 ring-inset ring-white/10"
                  }`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold tracking-tight text-white sm:text-base">{section.title}</span>
                  </span>
                  {isExpanded
                    ? <ChevronDown className="h-5 w-5 shrink-0 text-white" aria-hidden="true" />
                    : <ChevronRight className="h-5 w-5 shrink-0 text-indigo-200" aria-hidden="true" />}
                </button>

                {isExpanded && visibleItems.length > 0 && (
                  <div id={`${section.id}-menu`} className="border-t border-white/10 bg-[#0b1458]/75 p-2.5">
                    <div className="space-y-2 pr-1">
                      {visibleItems.map((item) => (
                        item.children ? (
                          <div key={item.id}>
                            <button
                              type="button"
                              aria-expanded={isPendingRecordsOpen}
                              aria-controls="school-pending-records-menu"
                              onClick={() => setIsPendingRecordsOpen((open) => !open)}
                              className="flex w-full items-center rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-left text-sm font-semibold text-indigo-50 transition hover:border-violet-300/40 hover:bg-white/[0.08]"
                            >
                              <span className="flex-1">{item.label}</span>
                              <ChevronDown className={`h-4 w-4 transition-transform ${isPendingRecordsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                            </button>
                            {isPendingRecordsOpen && (
                              <div id="school-pending-records-menu" className="ml-3 mt-2 space-y-1.5 border-l border-violet-300/40 pl-2">
                                {item.children.filter((child) => hasAdminPermission(child.permission, authorization)).map((child) => (
                                  <NavLink
                                    key={child.to}
                                    to={child.to}
                                    end={child.to === "/admin/pending-records"}
                                    className={({ isActive }) => `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                      isActive || (child.to === "/admin/pending-records/individual" && pathname === "/admin/tools/pending-records-individual")
                                        ? "bg-violet-500/25 text-white ring-1 ring-inset ring-violet-300/30"
                                        : "text-indigo-100 hover:bg-white/10 hover:text-white"
                                    }`}
                                  >
                                    {child.label}
                                  </NavLink>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `group flex items-center gap-3 rounded-xl border px-3 py-3 transition duration-200 ${
                              isActive
                                ? "border-cyan-300/50 bg-gradient-to-r from-blue-600/50 to-violet-600/35 text-white shadow-md shadow-blue-950/20"
                                : "border-white/10 bg-white/[0.04] text-indigo-50 hover:border-cyan-300/30 hover:bg-white/[0.08]"
                            }`}
                          >
                            {item.icon && (
                              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                item.label === "Hot Links"
                                  ? "bg-gradient-to-br from-sky-400 to-blue-600"
                                  : "bg-gradient-to-br from-fuchsia-500 to-purple-600"
                              } text-white shadow-md`}>
                                <item.icon className="h-4 w-4" aria-hidden="true" />
                              </span>
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold">{item.label}</span>
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-indigo-200 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />
                          </NavLink>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </nav>

        <div className="mt-5 border-t border-white/15 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleLogout}
            className="h-12 w-full justify-start gap-3 rounded-xl border border-rose-300/20 bg-rose-950/35 px-3 font-bold text-rose-100 transition hover:border-rose-300/40 hover:bg-rose-900/50 hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md">
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="flex-1 text-left">Logout</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSideBar;
