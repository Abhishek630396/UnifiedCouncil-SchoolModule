import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Loader2, RefreshCw, School2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import API_BASE_URL from "@/services/apiBaseUrl";
import SchoolHeader from "../school/components/SchoolHeader";
import AdminSideBar from "./AdminSideBar";
import AdminPageJump from "./components/AdminPageJump";
import AdminListControls from "./components/AdminListControls";
import { AdminPermission } from "./AdminAccess";

const EMPTY_PAGINATION = { page: 1, pageSize: 10, total: 0, totalPages: 1 };
const SCHOOL_REPORT_COLUMNS = [
  ["SchoolId", "ID"],
  ["SchoolName", "School name"],
  ["studentCount", "Students"],
  ["Exam_Mode", "Exam mode"],
  ["IsNSTSEselected", "NSTSE"],
  ["IsUIEOSelected", "UIEO"],
  ["IsUIMOSelected", "UIMO"],
  ["IsUCOSelected", "UCO"],
  ["IsUIGKOSelected", "UIGKO"],
  ["State", "State"],
  ["Updated_Date", "Registration date"],
  ["Country", "Country"],
].map(([name, label]) => ({ name, label }));

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN");
};

const examValue = (value) => (
  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${value ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
    {value ? "Yes" : "No"}
  </span>
);

const RegisteredSchools = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [draftDateFrom, setDraftDateFrom] = useState("");
  const [draftDateTo, setDraftDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [passwordState, setPasswordState] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("uc_admin_token");
    navigate("/school/login");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      handleUnauthorized();
      return undefined;
    }

    const controller = new AbortController();
    setIsLoading(true);
    axios.get(`${API_BASE_URL}/school-registration/registered-schools`, {
      params: { page, pageSize, search, dateFrom, dateTo },
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    }).then((response) => {
      setSchools(Array.isArray(response.data?.data) ? response.data.data : []);
      setPagination(response.data?.pagination || { ...EMPTY_PAGINATION, page, pageSize });
    }).catch((error) => {
      if (error.code === "ERR_CANCELED") return;
      if (error.response?.status === 401) return handleUnauthorized();
      toast.error(error.response?.data?.message || "Unable to load registered schools");
    }).finally(() => {
      if (!controller.signal.aborted) setIsLoading(false);
    });

    return () => controller.abort();
  }, [handleUnauthorized, page, pageSize, search, dateFrom, dateTo, refreshKey]);

  const exportExcel = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/school-registration/registered-schools/export`, {
        params: { search, dateFrom, dateTo },
        headers: { Authorization: `Bearer ${localStorage.getItem("uc_admin_token")}` },
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "registered-schools.xlsx";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      toast.success("Excel report downloaded");
    } catch (error) {
      if (error.response?.status === 401) return handleUnauthorized();
      toast.error("Unable to export registered schools");
    } finally {
      setIsExporting(false);
    }
  };

  const toggleSchoolPassword = async (school, event) => {
    event.stopPropagation();
    const schoolId = school.SchoolId;
    if (passwordState[schoolId]?.visible) {
      setPasswordState((current) => ({ ...current, [schoolId]: { visible: false, password: "" } }));
      return;
    }

    setPasswordState((current) => ({ ...current, [schoolId]: { ...current[schoolId], loading: true } }));
    try {
      const response = await axios.get(
        `${API_BASE_URL}/school-registration/registered-schools/${schoolId}/password`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("uc_admin_token")}` } }
      );
      setPasswordState((current) => ({
        ...current,
        [schoolId]: { visible: true, password: response.data?.data?.password || "", loading: false },
      }));
    } catch (error) {
      if (error.response?.status === 401) return handleUnauthorized();
      setPasswordState((current) => ({ ...current, [schoolId]: { visible: false, password: "", loading: false } }));
      toast.error(error.response?.data?.message || "Unable to show school password");
    }
  };

  const firstEntry = pagination.total ? ((pagination.page - 1) * pagination.pageSize) + 1 : 0;
  const lastEntry = Math.min(pagination.page * pagination.pageSize, pagination.total);

  const applyFilters = () => {
    if (draftDateFrom && draftDateTo && draftDateFrom > draftDateTo) {
      toast.error("From date cannot be later than To date.");
      return;
    }

    setDateFrom(draftDateFrom);
    setDateTo(draftDateTo);
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setDraftDateFrom("");
    setDraftDateTo("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SchoolHeader />
      <div className="flex flex-col bg-slate-50 lg:flex-row">
        <AdminSideBar />
        <main className="min-w-0 flex-1 px-3 py-5 sm:px-5">
          <section className="mx-auto max-w-[1600px] space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-sky-950 to-cyan-900 p-5 text-white shadow-lg shadow-sky-950/10 sm:p-7">
              <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[32px] border-white/5" />
              <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-cyan-400/10 blur-2xl" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200 shadow-inner">
                    <School2 className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Admin workspace</p>
                    <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Registered Schools</h1>
                    <p className="mt-1 text-sm text-sky-100/80">Search and manage registered school records.</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                    <p className="text-xl font-extrabold leading-none">{pagination.total.toLocaleString()}</p>
                    <p className="mt-1 text-xs font-medium text-sky-100/75">Matching schools</p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setRefreshKey((value) => value + 1)}
                    disabled={isLoading}
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    aria-label="Refresh registered schools"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
                    Refresh
                  </Button>
                </div>
              </div>
            </header>

            <AdminListControls
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
              searchPlaceholder="Search ID, school, place, district, contact or email"
              dateFrom={draftDateFrom}
              dateTo={draftDateTo}
              onDateChange={({ dateFrom: from, dateTo: to }) => {
                setDraftDateFrom(from);
                setDraftDateTo(to);
              }}
              pageSize={pageSize}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
              onSubmit={applyFilters}
              onClear={clearFilters}
              isLoading={isLoading}
              rows={schools}
              columns={SCHOOL_REPORT_COLUMNS}
              fileName="registered-schools"
              onDownloadExcel={exportExcel}
              exportPermission="registered_schools.export"
              exportPermission="registered_schools.export"
              title="Filter Registered Schools"
              description="Refine the list by date or school details"
              showEntriesInDateRow
            />

            <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-slate-200">
              <Table className="text-xs sm:text-sm">
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    {["ID", "School name", "Password", "Students", "Exam mode", "NSTSE", "UIEO", "UIMO", "UCO", "UIGKO", "Registration date", "Country"].map((heading) => (
                      <TableHead key={heading} className="whitespace-nowrap font-bold text-slate-700 px-2 sm:px-4 py-2 sm:py-3">{heading}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={12} className="h-24 sm:h-32 text-center"><Loader2 className="mx-auto h-5 sm:h-6 w-5 sm:w-6 animate-spin text-sky-600" /><span className="mt-1 sm:mt-2 block text-xs sm:text-sm text-slate-500">Loading schools...</span></TableCell></TableRow>
                  ) : schools.length === 0 ? (
                    <TableRow><TableCell colSpan={12} className="h-24 sm:h-32 text-center text-xs sm:text-sm text-slate-500">No registered schools found.</TableCell></TableRow>
                  ) : schools.map((school) => (
                    <TableRow
                      key={school.SchoolId}
                      className="cursor-pointer focus:bg-sky-50 focus:outline-none hover:bg-sky-50"
                      tabIndex={0}
                      role="link"
                      aria-label={`View details for ${school.SchoolName}`}
                      onClick={() => navigate(`/admin/registered-schools/${school.SchoolId}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") navigate(`/admin/registered-schools/${school.SchoolId}`);
                      }}
                    >
                      <TableCell className="font-semibold text-sky-700 px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{school.SchoolId}</TableCell>
                      <TableCell className="font-medium text-slate-900 px-2 sm:px-4 py-2 sm:py-3">
                        <div className="w-32 whitespace-normal break-words sm:w-48 md:w-64" title={school.SchoolName || ""}>
                          {school.SchoolName || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                        {school.hasPassword ? (
                          <div className="flex items-center gap-2">
                            <AdminPermission permission="registered_schools.view_credentials">
                            <span className="font-mono font-semibold text-slate-700">
                              {passwordState[school.SchoolId]?.visible ? passwordState[school.SchoolId].password : "••••"}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={passwordState[school.SchoolId]?.loading}
                              aria-label={passwordState[school.SchoolId]?.visible ? "Hide school password" : "Show school password"}
                              onClick={(event) => toggleSchoolPassword(school, event)}
                              onKeyDown={(event) => event.stopPropagation()}
                              className="h-8 px-2"
                            >
                              {passwordState[school.SchoolId]?.loading
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : passwordState[school.SchoolId]?.visible
                                  ? <EyeOff className="h-4 w-4" />
                                  : <Eye className="h-4 w-4" />}
                            </Button>
                            </AdminPermission>
                          </div>
                        ) : "Not available"}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-700 px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{school.studentCount ?? 0}</TableCell>
                      <TableCell className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{school.Exam_Mode || "---"}</TableCell>
                      <TableCell className="px-2 sm:px-4 py-2 sm:py-3">{examValue(school.IsNSTSEselected)}</TableCell>
                      <TableCell className="px-2 sm:px-4 py-2 sm:py-3">{examValue(school.IsUIEOSelected)}</TableCell>
                      <TableCell className="px-2 sm:px-4 py-2 sm:py-3">{examValue(school.IsUIMOSelected)}</TableCell>
                      <TableCell className="px-2 sm:px-4 py-2 sm:py-3">{examValue(school.IsUCOSelected)}</TableCell>
                      <TableCell className="px-2 sm:px-4 py-2 sm:py-3">{examValue(school.IsUIGKOSelected)}</TableCell>
                      <TableCell className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-xs">{formatDate(school.Updated_Date)}</TableCell>
                      <TableCell>{school.Country || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <span>Showing {firstEntry} to {lastEntry} of {pagination.total} entries</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={isLoading || page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button>
                <AdminPageJump
                  page={page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                  disabled={isLoading}
                />
                <Button variant="outline" size="sm" disabled={isLoading || page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)}>Next<ChevronRight className="ml-1 h-4 w-4" /></Button>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RegisteredSchools;
