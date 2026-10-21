import { Fragment, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Download, FileSpreadsheet, LoaderCircle, RefreshCw, Search, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SchoolHeader from "../school/components/SchoolHeader";
import AdminSideBar from "./AdminSideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import API_BASE_URL from "@/services/apiBaseUrl";
import RegistrationDateFilter, { getDefaultRegistrationDateRange } from "./components/RegistrationDateFilter";
import AdminPageJump from "./components/AdminPageJump";
import { AdminPermission } from "./AdminAccess";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["Pending", "Success", "Failure"];
const PACKAGE_OPTIONS = ["NSTSE", "UCO", "UIEO", "UIMO", "UIGKO", "UMO"];
const COLUMNS = [
  ["id", "ID"],
  ["StudentName", "STUDENT NAME"],
  ["Class", "CLASS"],
  ["Mobile", "MOBILE"],
  ["Email", "EMAIL"],
  ["Number", "NUMBER"],
  ["TransDate", "TRANSDATE"],
  ["Status", "STATUS"],
  ["Packages", "PACKAGE / OLYMPIAD"],
  ["State", "STATE"],
  ["SchoolName", "SCHOOL NAME"],
];

const waveButtonStyles = {
  search: {
    background: "linear-gradient(135deg, #0a2d7f 0%, #0c68d9 38%, #0bbef5 100%)",
    boxShadow: "0 10px 18px rgba(12, 90, 214, 0.24)",
  },
  download: {
    background: "linear-gradient(135deg, #ff7a00 0%, #ff9b00 25%, #ff5d3a 100%)",
    boxShadow: "0 10px 18px rgba(255, 111, 0, 0.25)",
  },
  gst: {
    background: "linear-gradient(135deg, #00b14c 0%, #14d06e 30%, #0ec0b6 100%)",
    boxShadow: "0 10px 18px rgba(17, 184, 126, 0.22)",
  },
  gstState: {
    background: "linear-gradient(135deg, #7d2af5 0%, #b93ae9 32%, #ee4ab6 100%)",
    boxShadow: "0 10px 18px rgba(146, 54, 233, 0.22)",
  },
};

const waveActionButtonClass = "group relative isolate inline-flex h-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 px-3 py-2 text-sm font-bold tracking-tight text-white transition duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60 before:absolute before:-left-[8%] before:top-[-30%] before:h-[180%] before:w-[120%] before:rounded-[46%] before:bg-white/10 before:content-[''] after:absolute after:-bottom-[18%] after:left-[8%] after:h-[42%] after:w-[90%] after:rounded-[50%] after:bg-white/10 after:blur-[12px] after:content-['']";

function formatCellValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function exportStudentRows(rows, fileName, { includeGst = false, includeState = false } = {}) {
  if (!rows.length) {
    toast.error("There are no individual students on this page to export.");
    return;
  }

  const reportColumns = [
    ...(includeState ? COLUMNS : COLUMNS.filter(([field]) => field !== "State")),
    ...(includeGst
      ? [
          ["Examfee", "EXAM FEE"],
          ["SGST", "SGST"],
          ["CGST", "CGST"],
          ["IGST", "IGST"],
          ["BMALSOP", "ONLINE PACKAGE"],
          ["CGSTOP", "PACKAGE CGST"],
          ["SGSTOP", "PACKAGE SGST"],
          ["IGSTOP", "PACKAGE IGST"],
          ["PackageGST", "PACKAGE GST"],
        ]
      : []),
  ];

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
  const header = reportColumns.map(([, label]) => `<th>${escapeHtml(label)}</th>`).join("");
  const body = rows.map((row) => (
    `<tr>${reportColumns.map(([field]) => `<td>${escapeHtml(field === "TransDate" ? formatCellValue(row[field]) : row[field])}</td>`).join("")}</tr>`
  )).join("");
  const workbook = `\uFEFF<html><head><meta charset="utf-8"></head><body><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></body></html>`;
  const blob = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  toast.success("The student list was exported.");
}

function IndividualStudentRegistrations({ pendingOnly = false }) {
  const navigate = useNavigate();
  const defaultDateRange = getDefaultRegistrationDateRange();
  const [registrations, setRegistrations] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [draftFilters, setDraftFilters] = useState({
    ...defaultDateRange,
    status: pendingOnly ? "Pending" : "",
    packageName: "",
  });
  const [filters, setFilters] = useState({
    search: "",
    ...defaultDateRange,
    status: pendingOnly ? "Pending" : "",
    packageName: "",
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [markingRegistrationCode, setMarkingRegistrationCode] = useState("");

  const loadRegistrations = useCallback(async (targetPage, activeFilters) => {
    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      navigate("/school/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/individual-registrations`, {
        params: {
          page: targetPage,
          pageSize: PAGE_SIZE,
          search: activeFilters.search,
          dateFrom: activeFilters.dateFrom,
          dateTo: activeFilters.dateTo,
          status: pendingOnly ? "Pending" : activeFilters.status,
          packageName: activeFilters.packageName,
          _t: Date.now(),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data?.success) {
        toast.error(response.data?.message || "Unable to load individual student registrations.");
        return;
      }

      setRegistrations(Array.isArray(response.data.data) ? response.data.data : []);
      setPage(response.data.pagination?.page || targetPage);
      setTotal(response.data.pagination?.total || 0);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      } else {
        toast.error(error.response?.data?.message || "Unable to load individual student registrations.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, pendingOnly]);

  useEffect(() => {
    loadRegistrations(page, filters);
  }, [loadRegistrations, page, filters]);

  const firstEntry = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const lastEntry = Math.min(page * PAGE_SIZE, total);

  const handleSearch = (event) => {
    event.preventDefault();
    if (draftFilters.dateFrom && draftFilters.dateTo && draftFilters.dateFrom > draftFilters.dateTo) {
      toast.error("From date cannot be later than To date.");
      return;
    }

    setFilters({
      search: searchInput.trim(),
      dateFrom: draftFilters.dateFrom,
      dateTo: draftFilters.dateTo,
      status: pendingOnly ? "Pending" : draftFilters.status,
      packageName: draftFilters.packageName,
    });
    setPage(1);
  };

  const markRegistrationSuccess = async (registration) => {
    const registrationCode = String(registration.registrationCode || registration.Number || "").trim();
    if (!registrationCode) {
      toast.error("This record does not have a registration code.");
      return;
    }

    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      navigate("/school/login");
      return;
    }

    setMarkingRegistrationCode(registrationCode);
    try {
      const response = await axios.post(`${API_BASE_URL}/registrations/admin/mark-success`, {
        registrationCode,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to mark this registration successful.");
      }

      toast.success(response.data.message || "Registration marked successful.");
      const nextPage = Math.min(page, Math.max(1, Math.ceil((total - 1) / PAGE_SIZE)));
      if (nextPage === page) {
        await loadRegistrations(nextPage, filters);
      } else {
        setPage(nextPage);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      } else {
        toast.error(error.response?.data?.message || error.message || "Unable to mark this registration successful.");
      }
    } finally {
      setMarkingRegistrationCode("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolHeader />
      <div className="flex flex-col lg:flex-row">
        <AdminSideBar />
        <main className="min-w-0 flex-1 p-3 sm:p-5">
          <section className="mx-auto max-w-[1600px] space-y-5">
            <header className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-950 via-sky-950 to-cyan-900 p-5 text-white shadow-lg shadow-sky-950/10 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200">
                  <UserRound className="h-7 w-7" aria-hidden="true" />
                </span>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Admin workspace</p>
                  <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                    {pendingOnly ? "Individual Students Pending Records" : "Individual Students"}
                  </h1>
                  <p className="mt-1 text-sm text-sky-100/80">
                    {pendingOnly
                      ? "Review individual student registrations awaiting payment confirmation."
                      : "Student records from the student database table."}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                  <p className="text-xl font-extrabold leading-none">{total.toLocaleString()}</p>
                  <p className="mt-1 text-xs font-medium text-sky-100/75">Matching students</p>
                </div>
                <Button
                  type="button"
                  onClick={() => loadRegistrations(page, filters)}
                  disabled={isLoading}
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  aria-label="Refresh individual student records"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
                  Refresh
                </Button>
              </div>
            </header>

            <form onSubmit={handleSearch} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="h-5 w-1 rounded-full bg-cyan-500" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Filter registrations</h2>
                <span className="text-xs text-slate-400">Refine the list by date, status or Olympiad</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <RegistrationDateFilter
                  className="sm:col-span-2 xl:col-span-3"
                  dateFrom={draftFilters.dateFrom}
                  dateTo={draftFilters.dateTo}
                  onChange={(range) => setDraftFilters((current) => ({ ...current, ...range }))}
                />
                <label className="block text-sm font-semibold text-slate-600">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Status</span>
                  <select
                    value={draftFilters.status}
                    onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value }))}
                    disabled={pendingOnly}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
                    aria-label="Filter by status"
                  >
                    <option value="">All</option>
                    {(pendingOnly ? ["Pending"] : STATUS_OPTIONS).map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-slate-600">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Package / Olympiad</span>
                  <select
                    value={draftFilters.packageName}
                    onChange={(event) => setDraftFilters((current) => ({ ...current, packageName: event.target.value }))}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    aria-label="Filter by package or Olympiad"
                  >
                    <option value="">ALL</option>
                    {PACKAGE_OPTIONS.map((packageName) => <option key={packageName} value={packageName}>{packageName}</option>)}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 2xl:flex-nowrap">
                <div className="relative min-w-[220px] flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <Input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search ID, name, transaction or package"
                    aria-label="Search registrations"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/70 pl-10 shadow-sm transition placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:bg-white focus-visible:ring-sky-100"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className={`${waveActionButtonClass} w-[140px]`} style={waveButtonStyles.search}>
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b2d73] text-white shadow-inner">
                      <Search className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>Search</span>
                    <span className="text-xl font-light leading-none">›</span>
                  </span>
                </Button>
                <AdminPermission permission={pendingOnly ? "pending_records.export" : "individual_students.export"}>
                <Button
                  type="button"
                  onClick={() => exportStudentRows(registrations, `individual-students-${Date.now()}.xls`)}
                  disabled={isLoading || registrations.length === 0}
                  className={`${waveActionButtonClass} w-[190px]`}
                  style={waveButtonStyles.download}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e07000] text-white shadow-inner">
                      <Download className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>Download Excel</span>
                    <span className="text-xl font-light leading-none">›</span>
                  </span>
                </Button>
                <Button
                  type="button"
                  onClick={() => exportStudentRows(registrations, `individual-students-gst-${Date.now()}.xls`, { includeGst: true })}
                  disabled={isLoading || registrations.length === 0}
                  className={`${waveActionButtonClass} w-[190px]`}
                  style={waveButtonStyles.gst}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e9d61] text-white shadow-inner">
                      <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>GST Excel Report</span>
                    <span className="text-xl font-light leading-none">›</span>
                  </span>
                </Button>
                <Button
                  type="button"
                  onClick={() => exportStudentRows(registrations, `individual-students-gst-state-${Date.now()}.xls`, { includeGst: true, includeState: true })}
                  disabled={isLoading || registrations.length === 0}
                  className={`${waveActionButtonClass} w-[210px]`}
                  style={waveButtonStyles.gstState}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7a2fd0] text-white shadow-inner">
                      <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>GST State Report</span>
                    <span className="text-xl font-light leading-none">›</span>
                  </span>
                </Button>
                </AdminPermission>
              </div>
            </form>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-1 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div>
                  <h2 className="font-extrabold text-slate-900">
                    {pendingOnly ? "Individual Students Pending Records" : "Individual Students"}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">Showing records and fields available in Tbl_Students.</p>
                </div>
                <span className="text-xs font-semibold text-slate-500">{total.toLocaleString()} students found</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max border-collapse text-left text-sm">
                  <thead className="bg-slate-50/90 text-[11px] uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-3.5 font-extrabold">#</th>
                      {COLUMNS.map(([field, label]) => (
                        <Fragment key={field}>
                          <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5 font-extrabold">{label}</th>
                          {pendingOnly && field === "Status" && (
                            <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5 font-extrabold">ACTION</th>
                          )}
                        </Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan={COLUMNS.length + 1 + Number(pendingOnly)} className="px-4 py-14 text-center font-semibold text-slate-500">Loading individual student records…</td></tr>
                    ) : registrations.length === 0 ? (
                      <tr><td colSpan={COLUMNS.length + 1 + Number(pendingOnly)} className="px-4 py-14 text-center font-semibold text-slate-500">No individual students found.</td></tr>
                    ) : registrations.map((registration, index) => (
                      <tr key={registration.id ?? index} className="transition-colors even:bg-slate-50/40 hover:bg-sky-50/70">
                        <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3.5 text-xs font-semibold text-slate-400">{firstEntry + index}</td>
                        {COLUMNS.map(([field]) => (
                          <Fragment key={field}>
                            <td className="max-w-xs whitespace-nowrap border-b border-slate-100 px-4 py-3.5 text-slate-600">
                              {field === "Status" ? (
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                                String(registration[field] || "").toLowerCase().includes("success")
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                  : String(registration[field] || "").toLowerCase().includes("fail")
                                    ? "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20"
                                    : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                              }`}>
                                {formatCellValue(registration[field])}
                              </span>
                            ) : field === "Packages" ? (
                              <span className="inline-flex rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-100">
                                {formatCellValue(registration[field])}
                              </span>
                            ) : formatCellValue(registration[field])}
                            </td>
                            {pendingOnly && field === "Status" && (
                              <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3">
                                <AdminPermission permission="individual_students.mark_success">
                                <Button
                                  type="button"
                                  onClick={() => markRegistrationSuccess(registration)}
                                  disabled={isLoading || Boolean(markingRegistrationCode)}
                                  className="group h-10 rounded-xl border border-emerald-500/70 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-4 font-bold text-white shadow-[0_8px_18px_rgba(5,150,105,0.20)] transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 hover:shadow-[0_12px_24px_rgba(5,150,105,0.28)] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:translate-y-0 disabled:opacity-60"
                                >
                                  {Boolean(markingRegistrationCode) && markingRegistrationCode === (registration.registrationCode || registration.Number) ? (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                  ) : (
                                    <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 ring-1 ring-inset ring-white/30 transition-transform group-hover:scale-110">
                                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                                    </span>
                                  )}
                                  {Boolean(markingRegistrationCode) && markingRegistrationCode === (registration.registrationCode || registration.Number) ? "Updating…" : "Mark Success"}
                                  {(!markingRegistrationCode || markingRegistrationCode !== (registration.registrationCode || registration.Number)) && (
                                    <CheckCircle2 className="ml-2 h-4 w-4 opacity-80" aria-hidden="true" />
                                  )}
                                </Button>
                                </AdminPermission>
                              </td>
                            )}
                          </Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <p>Showing {firstEntry}–{lastEntry} of {total.toLocaleString()} students</p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setPage((current) => current - 1)} disabled={isLoading || page <= 1}>
                  <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" /> Previous
                </Button>
                <AdminPageJump page={page} totalPages={totalPages} onPageChange={setPage} disabled={isLoading} />
                <Button type="button" variant="outline" size="sm" onClick={() => setPage((current) => current + 1)} disabled={isLoading || page >= totalPages}>
                  Next <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default IndividualStudentRegistrations;
