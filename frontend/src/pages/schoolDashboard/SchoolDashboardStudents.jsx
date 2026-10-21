import { useEffect, useState } from "react";
import { Eye, Loader2, Search, X } from "lucide-react";
import schoolDashboardApi from "@/services/schoolDashboardApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const EMPTY_PAGINATION = { page: 1, pageSize: 10, total: 0, totalPages: 1 };
const classOptions = Array.from({ length: 10 }, (_, index) => [String(index + 1), `Class ${index + 1}`]);
const show = (value) => value === null || value === undefined || value === "" ? "—" : value;
const formatClass = (value) => /^\d+$/.test(String(value || "")) ? `Class ${value}` : show(value);
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const examName = (packageName) => {
  const names = [...new Set(
    String(packageName || "")
      .split(",")
      .map((item) => item.split("-")[0].trim())
      .filter(Boolean)
  )];
  return names.length ? names.join(", ") : "—";
};
const getStatusLabel = (value) => show(value);
const getStatusClass = (value) => {
  const status = String(value || "").toLowerCase();
  if (["success", "completed"].includes(status)) return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "pending" || status === "registered") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-slate-200 bg-slate-100 text-slate-700";
};

const Detail = ({ label, value }) => (
  <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-3">
    <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
    <p className="mt-1 break-words text-sm font-semibold text-slate-900">{show(value)}</p>
  </div>
);

const SchoolDashboardStudents = () => {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [className, setClassName] = useState("all");
  const [exam, setExam] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setLoadError("");
    schoolDashboardApi.get("/school-dashboard/students", {
      signal: controller.signal,
      params: {
        page,
        pageSize,
        search,
        className: className === "all" ? "" : className,
        exam: exam === "all" ? "" : exam,
        status: status === "all" ? "" : status,
        dateFrom,
        dateTo,
      },
    }).then((response) => {
      setRows(Array.isArray(response.data?.data) ? response.data.data : []);
      setPagination(response.data?.pagination || EMPTY_PAGINATION);
    }).catch((error) => {
      if (error.code !== "ERR_CANCELED") setLoadError(error.response?.data?.message || "Unable to load student registrations.");
    }).finally(() => { if (!controller.signal.aborted) setIsLoading(false); });
    return () => controller.abort();
  }, [page, pageSize, search, className, exam, status, dateFrom, dateTo]);

  useEffect(() => {
    if (!selectedStudent) return undefined;
    const controller = new AbortController();
    setStudentDetails(null);
    setDetailError("");
    setIsDetailLoading(true);
    schoolDashboardApi.get(`/school-dashboard/students/${selectedStudent.StudentId}`, { signal: controller.signal })
      .then((response) => setStudentDetails(response.data?.data || null))
      .catch((error) => { if (error.code !== "ERR_CANCELED") setDetailError(error.response?.data?.message || "Unable to load student details."); })
      .finally(() => { if (!controller.signal.aborted) setIsDetailLoading(false); });
    return () => controller.abort();
  }, [selectedStudent]);

  const clearFilters = () => {
    setClassName("all");
    setExam("all");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    setSearchInput("");
    setSearch("");
    setPage(1);
  };
  const hasFilters = Boolean(search || className !== "all" || exam !== "all" || status !== "all" || dateFrom || dateTo);
  const first = pagination.total ? (pagination.page - 1) * pagination.pageSize + 1 : 0;
  const last = Math.min(pagination.page * pagination.pageSize, pagination.total);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-sky-700">School workspace</p>
        <h1 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">Student Registrations</h1>
        <p className="mt-1 text-sm text-slate-600">Search and review registrations associated with your school.</p>
      </div>

      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardHeader className="space-y-4 border-b border-slate-200 p-4 sm:p-5">
          <CardTitle className="text-base">Search and filters</CardTitle>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search student or registration ID" aria-label="Search by student name or registration ID" className="pl-9" />
            </div>
            <Select value={className} onValueChange={(value) => { setClassName(value); setPage(1); }}>
              <SelectTrigger aria-label="Filter by class"><SelectValue placeholder="All classes" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All classes</SelectItem>{classOptions.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={exam} onValueChange={(value) => { setExam(value); setPage(1); }}>
              <SelectTrigger aria-label="Filter by Olympiad"><SelectValue placeholder="All Olympiads" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Olympiads</SelectItem>{["NSTSE", "UIEO", "UIMO", "UCO", "UIGKO"].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
              <SelectTrigger aria-label="Filter by registration status"><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent>{[["all", "All statuses"], ["Pending", "Pending"], ["Registered", "Registered"], ["Completed", "Completed"], ["Failed", "Failed"]].map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>
            <label className="text-xs font-semibold text-slate-600">From date<Input type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} className="mt-1" /></label>
            <label className="text-xs font-semibold text-slate-600">To date<Input type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }} className="mt-1" /></label>
          </div>
          {hasFilters && <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="w-fit text-slate-600"><X className="h-4 w-4" />Clear filters</Button>}
        </CardHeader>

        <CardContent className="p-0">
          {loadError && <div role="alert" className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{loadError}</div>}
          <div className="overflow-x-auto">
            <Table className="min-w-[850px]">
              <TableHeader className="bg-slate-50"><TableRow>{["Student Name", "Student Registration ID", "Class / Grade", "Exam / Olympiad", "Registration Date", "Status", "Actions"].map((heading) => <TableHead key={heading} className="whitespace-nowrap font-bold text-slate-700">{heading}</TableHead>)}</TableRow></TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} className="h-32 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-sky-700" /><span className="sr-only">Loading student registrations</span></TableCell></TableRow>
                ) : rows.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="h-36 text-center">
                    <p className="font-semibold text-slate-800">{hasFilters ? "No matching registrations found." : "No student registrations found."}</p>
                    <p className="mt-1 text-sm text-slate-500">{hasFilters ? "Try changing or clearing your search and filters." : "Students registered under your school will appear here."}</p>
                  </TableCell></TableRow>
                ) : rows.map((student) => (
                  <TableRow key={student.StudentId}>
                    <TableCell className="font-semibold text-slate-900">{show(student.SNAME)}</TableCell>
                    <TableCell className="font-mono text-xs">{show(student.transid)}</TableCell>
                    <TableCell>{formatClass(student.Class)}</TableCell>
                    <TableCell>{examName(student.Separatepackages)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(student.transdate)}</TableCell>
                    <TableCell><Badge variant="outline" className={getStatusClass(student.STATUS)}>{getStatusLabel(student.STATUS)}</Badge></TableCell>
                    <TableCell><Button type="button" variant="outline" size="sm" onClick={() => setSelectedStudent(student)}><Eye className="h-4 w-4" />View details</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-200 p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="student-page-size">Rows</label>
              <Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}>
                <SelectTrigger id="student-page-size" className="w-[76px]"><SelectValue /></SelectTrigger>
                <SelectContent>{[10, 25, 50].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent>
              </Select>
              <span>Showing {first}–{last} of {pagination.total}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" disabled={isLoading || page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
              <span className="whitespace-nowrap">Page {pagination.page} of {pagination.totalPages}</span>
              <Button type="button" variant="outline" size="sm" disabled={isLoading || page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedStudent)} onOpenChange={(open) => { if (!open) setSelectedStudent(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student registration details</DialogTitle>
            <DialogDescription>Registration information for {show(selectedStudent?.SNAME)}.</DialogDescription>
          </DialogHeader>
          {isDetailLoading ? <div className="flex h-36 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-sky-700" /></div>
            : detailError ? <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{detailError}</div>
              : studentDetails && <div className="grid gap-3 sm:grid-cols-2">
                <Detail label="Student name" value={studentDetails.SNAME} />
                <Detail label="Student Registration ID" value={studentDetails.transid} />
                <Detail label="Class / Grade" value={formatClass(studentDetails.Class)} />
                <Detail label="Section" value={studentDetails.Section} />
                <Detail label="Exam / Olympiad" value={examName(studentDetails.Separatepackages)} />
                <Detail label="Package" value={studentDetails.Separatepackages} />
                <Detail label="Registration date" value={formatDate(studentDetails.transdate)} />
                <Detail label="Status" value={getStatusLabel(studentDetails.STATUS)} />
                <Detail label="All selected packages" value={studentDetails.Packagesbought} />
                <Detail label="Parent/guardian" value={studentDetails.FNAME} />
                <Detail label="Mobile" value={studentDetails.MOBILE} />
                <Detail label="Email" value={studentDetails.EMAIL} />
                <Detail label="Address line 1" value={studentDetails.STUDADD1} />
                <Detail label="Address line 2" value={studentDetails.STUDADD2} />
                <Detail label="City" value={studentDetails.STUDCITY} />
                <Detail label="State" value={studentDetails.STUDSTATE} />
                <Detail label="Postal code" value={studentDetails.STUDPINCODE} />
              </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolDashboardStudents;
