import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Download,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PlayCircle,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/apiBaseUrl";

const USER_SESSION_KEY = "uc-user-session";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCurrency(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Not available";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getExamCode(examName) {
  return String(examName || "").match(/\b(NSTSE|UIEO|UIMO|UCO|UIGKO)\b/i)?.[0]?.toUpperCase() || "";
}

function UserDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [examSchedules, setExamSchedules] = useState([]);
  const [examDateError, setExamDateError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSession = window.sessionStorage.getItem(USER_SESSION_KEY);
    if (!storedSession) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedSession = JSON.parse(storedSession);
      if (!parsedSession.mobileNumber) {
        throw new Error("The saved login session is invalid.");
      }
      setUser(parsedSession);
    } catch {
      window.sessionStorage.removeItem(USER_SESSION_KEY);
      navigate("/login", { replace: true });
      return;
    } finally {
      setIsLoading(false);
    }

    const loadExamDates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/school-registration/exam-dates`, {
          cache: "no-store",
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success || !Array.isArray(payload.data)) {
          throw new Error(payload?.message || "Unable to load exam dates.");
        }
        setExamSchedules(payload.data);
      } catch (requestError) {
        setExamDateError(requestError instanceof Error ? requestError.message : "Unable to load exam dates.");
      }
    };

    loadExamDates();
  }, [navigate]);

  const logout = () => {
    window.sessionStorage.removeItem(USER_SESSION_KEY);
    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-600">Loading your dashboard...</div>;
  }

  if (!user) {
    return null;
  }

  const profile = user.existingUser || {};
  const registrations = Array.isArray(profile.registrations) ? profile.registrations : [];
  const navigationItems = [
    { label: "User Dashboard", to: "/user-dashboard", icon: LayoutDashboard, end: true },
    { label: "Free Resources", to: "/downloads", icon: Sparkles },
    { label: "User Materials", to: "/stepup", icon: BookOpen },
    { label: "Practice Tests", to: "/mocktests", icon: ClipboardCheck },
    { label: "Daily Challenge", to: "/crosswords", icon: Flame },
    { label: "Video Lessons", to: "/#student-videos", icon: PlayCircle },
    { label: "My Progress", to: "/user-dashboard#my-progress", end: true, icon: Target },
  ];
  const isPaidRegistration = (registration) => String(registration.status || "").toLowerCase() === "success";
  const paidRegistrationCount = registrations.filter(isPaidRegistration).length;
  const otherRegistrationCount = registrations.length - paidRegistrationCount;

  return (
    <main className="min-h-screen bg-[#f5f7fb] lg:flex">
      <aside className="relative z-10 flex w-full flex-col bg-[#101a3a] text-white shadow-xl lg:sticky lg:top-0 lg:h-screen lg:w-[280px] lg:shrink-0 lg:overflow-hidden lg:shadow-none">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5 sm:px-7 lg:px-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-sky-500 text-[#101a3a] shadow-lg shadow-sky-950/30">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold tracking-wide">UNIFIED COUNCIL</p>
            <p className="mt-0.5 text-xs font-medium text-slate-400">Student learning portal</p>
          </div>
        </div>

        <div className="px-5 pt-5 sm:px-7 lg:px-5">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-sm font-extrabold text-white">
              {String(profile.studentName || "S").trim().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{profile.studentName || "Student account"}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">+91 {user.mobileNumber}</p>
            </div>
            <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400 ring-4 ring-emerald-400/15" aria-label="Online" />
          </div>
        </div>

        <nav aria-label="Student portal" className="flex gap-2 overflow-x-auto px-5 py-5 sm:px-7 lg:min-h-0 lg:flex-1 lg:flex-col lg:gap-1.5 lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-contain lg:px-4">
          <p className="hidden px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500 lg:block">
            Portal menu
          </p>
          {navigationItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => {
                const hash = to.includes("#") ? to.slice(to.indexOf("#")) : "";
                const isCurrentItem = hash
                  ? location.pathname === "/user-dashboard" && location.hash === hash
                  : isActive;
                return `group flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${
                isCurrentItem
                  ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-[#101a3a] shadow-lg shadow-sky-950/20"
                  : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
              }`;
              }}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                (to.includes("#")
                  ? location.pathname === "/user-dashboard" && location.hash === to.slice(to.indexOf("#"))
                  : location.pathname === to)
                  ? "bg-white/25"
                  : "bg-white/[0.07] group-hover:bg-white/10"
              }`}>
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="whitespace-nowrap">{label}</span>
              {to === "/downloads" && (
                <Download className="ml-auto hidden h-4 w-4 opacity-60 lg:block" aria-hidden="true" />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden shrink-0 border-t border-white/10 bg-[#101a3a] p-4 lg:block">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex shrink-0 items-center gap-2 border-t border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-rose-500/10 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-300 lg:hidden"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-[5] border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-[72px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Student portal</p>
              <h1 className="mt-0.5 text-lg font-extrabold text-slate-900 sm:text-xl">Your learning space</h1>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Account active
            </div>
          </div>
        </header>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
        <div className="relative mb-8 overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-white to-sky-50 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-700">Your account</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {profile.studentName ? `Welcome, ${profile.studentName}` : "Your exam registrations"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {profile.parentName ? `Parent: ${profile.parentName} · ` : ""}
                  {profile.email ? `${profile.email} · ` : ""}
                  <span className="font-semibold text-slate-700">+91 {user.mobileNumber}</span>
                </p>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Verified account
            </div>
          </div>
        </div>

        <section id="my-progress" className="mb-8 scroll-mt-24">
          <div className="mb-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-700">My Progress</p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-950">Your exam registration snapshot</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Exams registered</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{registrations.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Successful payments</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">{paidRegistrationCount}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Other payment statuses</p>
              <p className="mt-2 text-3xl font-black text-amber-700">{otherRegistrationCount}</p>
            </div>
          </div>
        </section>

        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="progress-dashboard" className="scroll-mt-24 text-2xl font-bold text-slate-950">Progress dashboard</h2>
            <p className="mt-1 text-sm text-slate-600">
              Review each exam registration, payment status, and exam date.
            </p>
          </div>
        </div>

        {registrations.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            No exam registrations were found for this mobile number.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {registrations.map((registration, index) => {
              const examCode = getExamCode(registration.examName);
              const schedule = examSchedules.find((item) => item.examCode === examCode);
              const dates = Array.isArray(schedule?.dates) ? schedule.dates : [];
              const status = String(registration.status || "Unknown");
              const isPaid = status.toLowerCase() === "success";
              const paymentDate = formatDate(registration.paymentDate);
              const detailItems = [
                ["Mobile", registration.mobile],
                ["Email", registration.email],
                ["Board", registration.board],
                ["Exam fee", registration.examFee === null ? "" : formatCurrency(registration.examFee)],
                ["Package amount", registration.packageAmount === null ? "" : formatCurrency(registration.packageAmount)],
                ["Stored transaction amount", registration.recordedAmount === null ? "" : formatCurrency(registration.recordedAmount)],
                ["CGST", registration.cgst === null ? "" : formatCurrency(registration.cgst)],
                ["SGST", registration.sgst === null ? "" : formatCurrency(registration.sgst)],
                ["IGST", registration.igst === null ? "" : formatCurrency(registration.igst)],
                ["Package CGST", registration.packageCgst === null ? "" : formatCurrency(registration.packageCgst)],
                ["Package SGST", registration.packageSgst === null ? "" : formatCurrency(registration.packageSgst)],
                ["Package IGST", registration.packageIgst === null ? "" : formatCurrency(registration.packageIgst)],
                ["Full amount", registration.fullAmount === null ? "" : formatCurrency(registration.fullAmount)],
                ["Online package MRP", registration.onlinePackageMrp === null ? "" : formatCurrency(registration.onlinePackageMrp)],
                ["Online package discount", registration.onlinePackageDiscount === null ? "" : formatCurrency(registration.onlinePackageDiscount)],
                ["Combo offer discount", registration.comboOfferDiscount === null ? "" : formatCurrency(registration.comboOfferDiscount)],
                ["Package GST", registration.packageGst === null ? "" : formatCurrency(registration.packageGst)],
                ["Packages bought", registration.packagesBought],
                ["Payment message", registration.message],
                ["Reference number", registration.referenceNumber],
                ["Transaction ID", registration.transactionId],
                ["Invoice number", registration.invoiceNumber],
                ["Exam center", registration.centerName],
                ["Coordinator ID", registration.coordinatorId],
                ["School phone", registration.schoolPhone],
                ["School address", registration.schoolAddress],
                ["School city", registration.schoolCity],
                ["School state", registration.schoolState],
                ["School PIN code", registration.schoolPincode],
                ["Principal", registration.principalName],
                ["Address", [registration.address1, registration.address2, registration.city, registration.state, registration.pincode].filter(Boolean).join(", ")],
                ["Information source", Array.isArray(registration.source) ? registration.source.join(", ") : registration.source],
              ].filter(([, value]) => value !== null && value !== undefined && value !== "");

              return (
                <article
                  key={registration.registrationId || registration.registrationCode || `${registration.examName}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-700">Exam {index + 1}</p>
                      <h3 className="mt-1 text-xl font-bold text-slate-950">
                        {registration.examName || "Exam details unavailable"}
                      </h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isPaid
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border border-amber-200 bg-amber-50 text-amber-800"
                    }`}>
                      {status}
                    </span>
                  </div>

                  <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Student</dt>
                      <dd className="mt-1 font-semibold text-slate-900">{registration.studentName || "Not available"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Class</dt>
                      <dd className="mt-1 font-semibold text-slate-900">{registration.className || "Not available"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {isPaid ? "Amount paid" : "Registration amount"}
                      </dt>
                      <dd className="mt-1 font-semibold text-slate-900">{formatCurrency(registration.amount)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {isPaid ? "Paid on" : "Transaction date"}
                      </dt>
                      <dd className="mt-1 font-semibold text-slate-900">{paymentDate || "Not available"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Parent</dt>
                      <dd className="mt-1 font-semibold text-slate-900">{registration.parentName || "Not available"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">School</dt>
                      <dd className="mt-1 font-semibold text-slate-900">{registration.schoolName || "Not available"}</dd>
                    </div>
                    {registration.registrationCode && (
                      <div className="sm:col-span-2">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Registration / transaction ID</dt>
                        <dd className="mt-1 break-all font-semibold text-slate-900">{registration.registrationCode}</dd>
                      </div>
                    )}
                  </dl>

                  {detailItems.length > 0 && (
                    <details className="mt-5 border-t border-slate-200 pt-4">
                      <summary className="cursor-pointer text-sm font-semibold text-sky-700">
                        View all saved registration details
                      </summary>
                      <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                        {detailItems.map(([label, value]) => (
                          <div key={label}>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                            <dd className="mt-1 break-words font-semibold text-slate-900">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </details>
                  )}

                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <CalendarDays className="h-4 w-4 text-sky-700" />
                      Exam date{dates.length === 1 ? "" : "s"}
                    </p>
                    {dates.length > 0 ? (
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        {dates.map((date, dateIndex) => (
                          <li key={`${date.date}-${date.mode}-${dateIndex}`}>
                            {date.label || `${date.date}${date.day ? ` (${date.day})` : ""}${date.mode ? ` · ${date.mode}` : ""}`}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        {examDateError ? "Exam date is currently unavailable." : "No exam date has been published yet."}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {examDateError && registrations.length > 0 && (
          <p role="alert" className="mt-4 text-sm text-amber-800">
            Exam dates could not be loaded. Please refresh or contact Unified Council.
          </p>
        )}
      </section>
      </div>
    </main>
  );
}

export default UserDashboardPage;
