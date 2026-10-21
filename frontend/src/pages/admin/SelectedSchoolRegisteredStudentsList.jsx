import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Loader2, Search } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import API_BASE_URL from "@/services/apiBaseUrl";
import SchoolHeader from "../school/components/SchoolHeader";
import AdminSideBar from "./AdminSideBar";
import RegistrationDateFilter, { getDefaultRegistrationDateRange } from "./components/RegistrationDateFilter";
import AdminPageJump from "./components/AdminPageJump";

const EMPTY_PAGINATION = { page: 1, pageSize: 10, total: 0, totalPages: 1 };
const show = (value) => (value === null || value === undefined || value === "" ? "—" : value);
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const DetailItem = ({ label, value, className = "" }) => (
  <div className={`min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-3 ${className}`}>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 break-words text-sm font-medium text-slate-900">{show(value)}</p>
  </div>
);

const DetailSection = ({ title, children }) => (
  <section>
    <h3 className="mb-2 text-sm font-bold text-sky-700">{title}</h3>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
  </section>
);

const StudentDetailsDialog = ({ student, onOpenChange }) => (
  <Dialog open={Boolean(student)} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto text-left">
      <DialogHeader>
        <DialogTitle>Student registration details</DialogTitle>
        <DialogDescription>Complete registration information for {show(student?.SNAME)}.</DialogDescription>
      </DialogHeader>
      {student && <div className="space-y-5">
        <DetailSection title="Student and parent">
          <DetailItem label="Student ID" value={student.StudentId} /><DetailItem label="Student name" value={student.SNAME} />
          <DetailItem label="Class" value={student.Class} /><DetailItem label="Section" value={student.Section} />
          <DetailItem label="Parent name" value={student.FNAME} /><DetailItem label="Mobile" value={student.MOBILE} />
          <DetailItem label="Email" value={student.EMAIL} className="sm:col-span-2" />
        </DetailSection>
        <DetailSection title="Registration and payment">
          <DetailItem label="Transaction code" value={student.transid} /><DetailItem label="Registered date" value={formatDate(student.transdate)} />
          <DetailItem label="Transaction Status" value={student.STATUS} /><DetailItem label="Message Status" value={student.Message} />
          <DetailItem label="Total amount" value={student.AMOUNT} /><DetailItem label="This package" value={student.Separatepackages} />
          <DetailItem label="All packages" value={student.Packagesbought} className="sm:col-span-2" />
        </DetailSection>
        <DetailSection title="Address">
          <DetailItem label="Address line 1" value={student.STUDADD1} className="sm:col-span-2" />
          <DetailItem label="Address line 2" value={student.STUDADD2} className="sm:col-span-2" />
          <DetailItem label="City" value={student.STUDCITY} /><DetailItem label="State" value={student.STUDSTATE} />
          <DetailItem label="Pincode" value={student.STUDPINCODE} />
        </DetailSection>
        {/* <DetailSection title="Fee and tax breakdown">
          <DetailItem label="Exam fee" value={student.EXAMFEE} /><DetailItem label="E-book" value={student.EBOOK} />
          <DetailItem label="SGST" value={student.SGST} /><DetailItem label="CGST" value={student.CGST} /><DetailItem label="IGST" value={student.IGST} />
          <DetailItem label="E-book SGST" value={student.SGSTEB} /><DetailItem label="E-book CGST" value={student.CGSTEB} /><DetailItem label="E-book IGST" value={student.IGSTEB} />
          <DetailItem label="BMALS option" value={student.BMALSOP} /><DetailItem label="Option SGST" value={student.SGSTOP} />
          <DetailItem label="Option CGST" value={student.CGSTOP} /><DetailItem label="Option IGST" value={student.IGSTOP} />
        </DetailSection> */}
      </div>}
    </DialogContent>
  </Dialog>
);

const SelectedSchoolRegisteredStudentsList = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(() => getDefaultRegistrationDateRange().dateFrom);
  const [dateTo, setDateTo] = useState(() => getDefaultRegistrationDateRange().dateTo);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const unauthorized = useCallback(() => {
    localStorage.removeItem("uc_admin_token");
    navigate("/school/login");
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      unauthorized();
      return undefined;
    }

    const controller = new AbortController();
    const requestOptions = { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal };
    setIsLoading(true);
    Promise.all([
      axios.get(`${API_BASE_URL}/school-registration/registered-schools/${schoolId}`, requestOptions),
      axios.get(`${API_BASE_URL}/school-registration/registered-schools/${schoolId}/students`, {
        ...requestOptions,
        params: { page, pageSize, search, dateFrom, dateTo },
      }),
    ]).then(([schoolResponse, studentsResponse]) => {
      setSchool(schoolResponse.data?.data?.school || null);
      setStudents(Array.isArray(studentsResponse.data?.data) ? studentsResponse.data.data : []);
      setPagination(studentsResponse.data?.pagination || EMPTY_PAGINATION);
    }).catch((error) => {
      if (error.code === "ERR_CANCELED") return;
      if (error.response?.status === 401) return unauthorized();
      toast.error(error.response?.data?.message || "Unable to load registered students");
      if (error.response?.status === 404) navigate("/admin/registered-schools");
    }).finally(() => {
      if (!controller.signal.aborted) setIsLoading(false);
    });

    return () => controller.abort();
  }, [page, pageSize, schoolId, search, dateFrom, dateTo, unauthorized, navigate]);

  const first = pagination.total ? ((pagination.page - 1) * pagination.pageSize) + 1 : 0;
  const last = Math.min(pagination.page * pagination.pageSize, pagination.total);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SchoolHeader />
      <div className="flex flex-col bg-slate-50 lg:flex-row">
        <AdminSideBar />
        <main className="min-w-0 flex-1 px-3 py-5 sm:px-5">
          <Card className="mx-auto max-w-[1500px]">
            <CardHeader className="space-y-4 border-b text-left">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Registered students</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">{school ? `${school.SchoolName} (${school.SchoolId})` : "Loading school..."}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/admin/registered-schools/${schoolId}`}><ArrowLeft className="h-4 w-4" />School details</Link>
                </Button>
              </div>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                <div className="relative w-full lg:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className="pl-9" placeholder="Search students, class or exam" />
                </div>
                <RegistrationDateFilter
                  className="w-full lg:flex-1"
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onChange={(range) => { setDateFrom(range.dateFrom); setDateTo(range.dateTo); setPage(1); }}
                />
              </div>
            </CardHeader>
            <CardContent className="min-w-0 overflow-x-auto p-0">
              <Table className="min-w-[1000px]">
                <TableHeader className="bg-slate-50"><TableRow>{["#", "Student name", "Class", "Section", "Registered date", "Status", "Package", "Parent name", "Mobile", "Email", "Actions"].map((heading) => <TableHead key={heading} className="whitespace-nowrap font-bold text-slate-700">{heading}</TableHead>)}</TableRow></TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={11} className="h-28 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-sky-600" /></TableCell></TableRow>
                  ) : students.length === 0 ? (
                    <TableRow><TableCell colSpan={11} className="h-28 text-center text-slate-500">No registered students found.</TableCell></TableRow>
                  ) : students.map((student, index) => (
                    <TableRow key={student.StudentId}>
                      <TableCell>{((pagination.page - 1) * pagination.pageSize) + index + 1}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{show(student.SNAME)}</TableCell>
                      <TableCell>{show(student.Class)}</TableCell><TableCell>{show(student.Section)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(student.transdate)}</TableCell>
                      <TableCell><Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{show(student.STATUS)}</Badge></TableCell>
                      <TableCell>{show(student.Separatepackages)}</TableCell><TableCell>{show(student.FNAME)}</TableCell>
                      <TableCell>{show(student.MOBILE)}</TableCell><TableCell>{show(student.EMAIL)}</TableCell>
                      <TableCell><Button type="button" variant="outline" size="sm" onClick={() => setSelectedStudent(student)}><Eye className="h-4 w-4" />View</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex flex-col gap-3 border-t p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}>
                    <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                    <SelectContent>{[5, 10, 25, 50].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent>
                  </Select>
                  <span>Showing {first}–{last} of {pagination.total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={isLoading || page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft className="h-4 w-4" />Previous</Button>
                  <AdminPageJump
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                    disabled={isLoading}
                  />
                  <Button variant="outline" size="sm" disabled={isLoading || page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)}>Next<ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      <StudentDetailsDialog student={selectedStudent} onOpenChange={(open) => { if (!open) setSelectedStudent(null); }} />
      <Footer />
    </div>
  );
};

export default SelectedSchoolRegisteredStudentsList;
