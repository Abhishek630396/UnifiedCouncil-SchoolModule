import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Download, Loader2, Pencil, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/services/apiBaseUrl";
import { Checkbox } from "@/components/ui/checkbox";
import SchoolHeader from "../school/components/SchoolHeader";
import AdminSideBar from "./AdminSideBar";
import { AdminPermission } from "./AdminAccess";

const hasStoredValue = (value) => value !== null && value !== undefined && String(value).trim() !== "";
const show = (value) => hasStoredValue(value) ? value : "—";
const isSelected = (value) => value === true || value === 1 || value === "1";
const getExamModes = (value) => String(value || "")
  .split(",")
  .map((mode) => mode.trim().toLowerCase())
  .filter((mode, index, modes) => ["online", "offline"].includes(mode) && modes.indexOf(mode) === index);
const schoolExamFields = [
  { code: "NSTSE", selected: "IsNSTSEselected", date: "NSTSEExamdate", teacher: "NSTSETeachername", mobile: "NSTSETeachermobile", email: "NSTSETeachemail" },
  { code: "UIEO", selected: "IsUIEOSelected", date: "UIEOExamdate", teacher: "UIEOTeachername", mobile: "UIEOTeacherMobile", email: "UIEOTeacherMail" },
  { code: "UIMO", selected: "IsUIMOSelected", date: "UIMOExamdate", teacher: "UIMOTeachername", mobile: "UIMOTeacherMobile", email: "UIMOTeacherMail" },
  { code: "UCO", selected: "IsUCOSelected", date: "UCOExamdate", teacher: "UCOTeacherName", mobile: "UCOTeacherMobile", email: "UCOTeacherMail" },
  { code: "UIGKO", selected: "IsUIGKOSelected", date: "UIGKOExamdate", teacher: "UIGKOTeacherName", mobile: "UIGKOTeacherMobile", email: "UIGKOTeacherMail" },
];

const getFormDefaults = (school) => ({
  SchoolId: school?.SchoolId ?? "",
  SchoolName: school?.SchoolName ?? "",
  Schoolprinciname: school?.Schoolprinciname ?? "",
  PrinciContact: school?.PrinciContact ?? "",
  Exam_Mode: school?.Exam_Mode ?? "Offline",
  SchoolMail: school?.SchoolMail ?? "",
  SchoolContact: school?.SchoolContact ?? "",
  Place: school?.Place ?? "",
  District: school?.District ?? "",
  State: school?.State ?? "",
  Country: school?.Country ?? "",
  Pincode: school?.Pincode ?? "",
  SchoolAddress: school?.SchoolAddress ?? "",
  ...getOlympiadFormDefaults(school),
});
const emptyExamForm = { examName: "", examDate: "", examMode: "Offline", teacherInCharge: "", mobile: "", email: "" };

const emptyOlympiadDetails = {
  selected: false,
  examDate: "",
  teacherTitle: "Mr",
  teacherName: "",
  mobile: "",
  email: "",
};

const normalizeStoredExamDate = (value, examMode = "Offline") => {
  const normalized = String(value || "").trim();
  if (!normalized) return "";
  if (/^\d{2}-\d{2}-\d{4}\s+\([^)]+\)-(Online|Offline)$/i.test(normalized)) return normalized;
  const date = toInputDate(normalized);
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][parsedDate.getDay()];
  const mode = String(examMode).toLowerCase() === "online" ? "Online" : "Offline";
  return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year} (${dayName})-${mode}`;
};

const getOlympiadFormDefaults = (school) => Object.fromEntries(
  schoolExamFields.map((exam) => {
    const teacher = String(school?.[exam.teacher] || "").trim();
    const titleMatch = teacher.match(/^(Mr|Ms)\.\s*/i);
    return [
      exam.code,
      {
        selected: isSelected(school?.[exam.selected]),
        examDate: normalizeStoredExamDate(school?.[exam.date], school?.Exam_Mode),
        teacherTitle: titleMatch ? titleMatch[1] : "Mr",
        teacherName: titleMatch ? teacher.slice(titleMatch[0].length) : teacher,
        mobile: school?.[exam.mobile] || "",
        email: school?.[exam.email] || "",
      },
    ];
  })
);

const toInputDate = (value) => {
  const textValue = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(textValue)) return textValue.slice(0, 10);
  const match = textValue.match(/^(\d{2})-(\d{2})-(\d{4})/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : "";
};

const Info = ({ label, value }) => (
  !hasStoredValue(value) ? null :
  <div className="min-w-0 text-left">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 break-words text-sm font-medium text-slate-800">{show(value)}</p>
  </div>
);

const SummaryInfo = ({ label, value }) => (
  <div className="min-w-0 text-left">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 break-words text-sm font-medium text-slate-800">{show(value)}</p>
  </div>
);

const SelectedSchoolDetails = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState("school");
  const [editForm, setEditForm] = useState({});
  const [examDateOptions, setExamDateOptions] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSavingSchool, setIsSavingSchool] = useState(false);
  const [examModal, setExamModal] = useState(null);
  const [examForm, setExamForm] = useState(emptyExamForm);
  const [examErrors, setExamErrors] = useState({});
  const [examTouchedFields, setExamTouchedFields] = useState({});
  const [isSavingExam, setIsSavingExam] = useState(false);

  const unauthorized = useCallback(() => {
    localStorage.removeItem("uc_admin_token");
    navigate("/school/login");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      unauthorized();
      return undefined;
    }

    const controller = new AbortController();
    setIsLoading(true);
    axios.get(`${API_BASE_URL}/school-registration/registered-schools/${schoolId}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    }).then((response) => {
      setSchool(response.data?.data?.school || null);
      return axios.get(`${API_BASE_URL}/school-registration/registered-schools/${schoolId}/exams`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
    }).then((response) => {
      if (response?.data?.data) setExams(response.data.data);
    }).catch((error) => {
      if (error.code === "ERR_CANCELED") return;
      if (error.response?.status === 401) return unauthorized();
      toast.error(error.response?.data?.message || "Unable to load school details");
      if (error.response?.status === 404) navigate("/admin/registered-schools");
    }).finally(() => {
      if (!controller.signal.aborted) setIsLoading(false);
    });

    return () => controller.abort();
  }, [schoolId, unauthorized, navigate]);

  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${API_BASE_URL}/school-registration/exam-dates`, {
      signal: controller.signal,
    }).then((response) => {
      const configuredDates = Array.isArray(response.data?.data)
        ? Object.fromEntries(response.data.data.map((exam) => [
            exam.examCode,
            (Array.isArray(exam.dates) ? exam.dates : [])
              .map((date) => typeof date === "string" ? date : date.label)
              .filter(Boolean),
          ]))
        : {};
      setExamDateOptions(configuredDates);
    }).catch((error) => {
      if (error.code !== "ERR_CANCELED") {
        toast.error(error.response?.data?.message || "Unable to load configured exam dates.");
      }
    });
    return () => controller.abort();
  }, []);

  const openEditModal = (tab = "school") => {
    setEditForm(getFormDefaults(school));
    setEditErrors({});
    setTouchedFields({});
    setExamForm(emptyExamForm);
    setExamErrors({});
    setExamTouchedFields({});
    setExamModal(null);
    setEditTab(tab);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({});
    setEditErrors({});
    setTouchedFields({});
    setEditTab("school");
    setExamForm(emptyExamForm);
    setExamErrors({});
    setExamModal(null);
  };

  const openExamEditModal = (exam) => {
    setExamForm({
      examName: exam.examName,
      examDate: toInputDate(exam.examDate),
      examMode: exam.examMode || "Offline",
      teacherInCharge: exam.teacherInCharge || "",
      mobile: exam.mobile || "",
      email: exam.email || "",
    });
    setExamTouchedFields({});
    setExamErrors({});
    setExamModal({ mode: "edit", exam });
    setEditForm(getFormDefaults(school));
    setTouchedFields({});
    setEditErrors({});
    setEditTab("exam");
    setIsEditModalOpen(true);
  };

  const exportSchoolExcel = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/school-registration/registered-schools/${schoolId}/export`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("uc_admin_token")}` },
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `school-${school.REGNO || school.SchoolId}-details.xls`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      toast.success("School Excel report downloaded");
    } catch (error) {
      if (error.response?.status === 401) return unauthorized();
      toast.error(error.response?.data?.message || "Unable to export school details");
    } finally {
      setIsExporting(false);
    }
  };

  const updateEditField = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
    setTouchedFields((current) => ({ ...current, [field]: true }));
    setEditErrors((current) => ({ ...current, [field]: "" }));
  };

  const updateOlympiadField = (examCode, field, value) => {
    setEditForm((current) => ({
      ...current,
      [examCode]: { ...current[examCode], [field]: value },
    }));
  };

  const markAllTouched = () => {
    const nextTouched = {};
    Object.keys(editForm).forEach((field) => {
      nextTouched[field] = true;
    });
    setTouchedFields((current) => ({ ...current, ...nextTouched }));
  };

  const validateEditForm = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9\s\-()]{7,20}$/;
    const pincodePattern = /^\d{6}$/;

    if (!String(editForm.SchoolName || "").trim()) errors.SchoolName = "School name is required.";
    if (!String(editForm.Schoolprinciname || "").trim()) errors.Schoolprinciname = "Principal name is required.";
    if (!String(editForm.PrinciContact || "").trim()) errors.PrinciContact = "Principal contact is required.";
    if (!getExamModes(editForm.Exam_Mode).length) errors.Exam_Mode = "Select at least one exam mode.";
    if (!String(editForm.SchoolMail || "").trim()) errors.SchoolMail = "School email is required.";
    else if (!emailPattern.test(editForm.SchoolMail)) errors.SchoolMail = "Enter a valid email address.";
    if (!String(editForm.SchoolContact || "").trim()) errors.SchoolContact = "School contact is required.";
    else if (!phonePattern.test(editForm.SchoolContact)) errors.SchoolContact = "Enter a valid contact number.";
    if (!String(editForm.Place || "").trim()) errors.Place = "Place is required.";
    if (!String(editForm.District || "").trim()) errors.District = "District is required.";
    if (!String(editForm.State || "").trim()) errors.State = "State is required.";
    if (!String(editForm.Country || "").trim()) errors.Country = "Country is required.";
    if (!String(editForm.Pincode || "").trim()) errors.Pincode = "Pincode is required.";
    else if (!pincodePattern.test(String(editForm.Pincode).trim())) errors.Pincode = "Enter a valid 6-digit pincode.";
    if (!String(editForm.SchoolAddress || "").trim()) errors.SchoolAddress = "Address is required.";

    return errors;
  };

  const handleSaveSchool = async () => {
    markAllTouched();
    const validationErrors = validateEditForm();
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }

    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      unauthorized();
      return;
    }

    const schoolPayload = { ...editForm };
    schoolExamFields.forEach((exam) => delete schoolPayload[exam.code]);
    setIsSavingSchool(true);
    try {
      const response = await axios.patch(`${API_BASE_URL}/school-registration/registered-schools/${schoolId}`, schoolPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedSchool = response.data?.data?.school || schoolPayload;
      setSchool((current) => ({ ...current, ...updatedSchool }));
      closeEditModal();
      toast.success("School details updated successfully.");
    } catch (error) {
      if (error.response?.status === 401) {
        unauthorized();
        return;
      }
      const serverError = error.response?.data?.message || "Unable to save school details.";
      toast.error(serverError);
      setEditErrors((current) => ({ ...current, submit: serverError }));
    } finally {
      setIsSavingSchool(false);
    }
  };

  const handleSaveOlympiads = async () => {
    const token = localStorage.getItem("uc_admin_token");
    if (!token) return unauthorized();

    const olympiadPayload = {};
    schoolExamFields.forEach((exam) => {
      const details = editForm[exam.code] || emptyOlympiadDetails;
      olympiadPayload[exam.selected] = Boolean(details.selected);
      olympiadPayload[exam.date] = details.selected ? details.examDate : "";
      olympiadPayload[exam.teacher] = details.selected && details.teacherName.trim()
        ? `${details.teacherTitle}. ${details.teacherName.trim()}`
        : "";
      olympiadPayload[exam.mobile] = details.selected ? details.mobile.trim() : "";
      olympiadPayload[exam.email] = details.selected ? details.email.trim() : "";
    });

    setIsSavingSchool(true);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/school-registration/registered-schools/${schoolId}`,
        olympiadPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedSchool = response.data?.data?.school || { ...school, ...olympiadPayload };
      setSchool((current) => ({ ...current, ...updatedSchool }));
      setExams(schoolExamFields
        .filter((exam) => isSelected(updatedSchool[exam.selected]))
        .map((exam) => ({
          examCode: exam.code,
          examName: exam.code,
          examDate: updatedSchool[exam.date] || "",
          examMode: updatedSchool.Exam_Mode || "Offline",
          teacherInCharge: updatedSchool[exam.teacher] || "",
          mobile: updatedSchool[exam.mobile] || "",
          email: updatedSchool[exam.email] || "",
        })));
      closeEditModal();
      toast.success("Olympiad selections updated successfully.");
    } catch (error) {
      if (error.response?.status === 401) return unauthorized();
      const message = error.response?.data?.message || "Unable to save Olympiad selections.";
      setEditErrors((current) => ({ ...current, olympiads: message }));
      toast.error(message);
    } finally {
      setIsSavingSchool(false);
    }
  };

  const openExamModal = (exam) => {
    setExamForm({
      examName: exam.examName,
      examDate: toInputDate(exam.examDate),
      examMode: exam.examMode || "Offline",
      teacherInCharge: exam.teacherInCharge || "",
      mobile: exam.mobile || "",
      email: exam.email || "",
    });
    setExamErrors({});
    setExamModal({ mode: "edit", exam });
  };

  const closeExamModal = () => {
    if (isSavingExam) return;
    setExamModal(null);
    setExamForm(emptyExamForm);
    setExamErrors({});
  };

  const updateExamField = (field, value) => {
    setExamForm((current) => ({ ...current, [field]: value }));
    setExamTouchedFields((current) => ({ ...current, [field]: true }));
    setExamErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateExamForm = () => {
    const errors = {};
    if (!examForm.examDate) errors.examDate = "Exam date is required.";
    if (!examForm.teacherInCharge.trim()) errors.teacherInCharge = "Teacher in-charge is required.";
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(examForm.mobile)) errors.mobile = "Enter a valid mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(examForm.email)) errors.email = "Enter a valid email address.";
    return errors;
  };

  const markExamTouched = () => {
    const nextTouched = {};
    Object.keys(examForm).forEach((field) => {
      if (field !== "examName" && field !== "examMode") {
        nextTouched[field] = true;
      }
    });
    setExamTouchedFields((current) => ({ ...current, ...nextTouched }));
  };

  const handleSaveExam = async () => {
    markExamTouched();
    const errors = validateExamForm();
    if (Object.keys(errors).length) {
      setExamErrors(errors);
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }
    const token = localStorage.getItem("uc_admin_token");
    if (!token) return unauthorized();
    setIsSavingExam(true);
    try {
      const response = await axios({
        method: "patch",
        url: `${API_BASE_URL}/school-registration/registered-schools/${schoolId}/exams/${encodeURIComponent(examModal.exam.examCode)}`,
        data: examForm,
        headers: { Authorization: `Bearer ${token}` },
      });
      const savedExam = response.data?.data;
      setExams((current) => current.map((exam) => exam.examCode === savedExam.examCode ? savedExam : exam));
      const schoolExam = schoolExamFields.find((exam) => exam.code === savedExam.examCode);
      if (schoolExam) {
        setSchool((current) => ({
          ...current,
          [schoolExam.date]: savedExam.examDate,
          [schoolExam.teacher]: savedExam.teacherInCharge,
          [schoolExam.mobile]: savedExam.mobile,
          [schoolExam.email]: savedExam.email,
        }));
      }
      closeEditModal();
      toast.success("Exam details updated successfully.");
    } catch (error) {
      if (error.response?.status === 401) return unauthorized();
      const message = error.response?.data?.message || "Unable to save exam details.";
      setExamErrors({ submit: message });
      toast.error(message);
    } finally {
      setIsSavingExam(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SchoolHeader />
      <div className="flex flex-col bg-slate-50 lg:flex-row">
        <AdminSideBar />
        <main className="min-w-0 flex-1 px-3 py-5 sm:px-5">
          <div className="mx-auto max-w-[1500px] space-y-5">
            {isLoading && !school ? (
              <Card><CardContent className="flex h-40 items-center justify-center text-slate-500">Loading school details...</CardContent></Card>
            ) : school && (
              <>
                <Card>
                  <CardHeader className="border-b bg-slate-50 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CardTitle className="text-md font-semibold uppercase tracking-[0.2em] text-sky-600">
                        {school.SchoolName || "Registered School"}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <AdminPermission permission="registered_schools.export">
                        <Button type="button" variant="outline" onClick={exportSchoolExcel} disabled={isExporting}>
                          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                          {isExporting ? "Exporting..." : "Export Excel"}
                        </Button>
                        </AdminPermission>
                        <AdminPermission permission="registered_schools.edit">
                        <Button type="button" onClick={() => openEditModal("school")} aria-label="Edit school details" title="Edit school details">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        </AdminPermission>
                        <Button asChild>
                          <Link to={`/admin/registered-schools/${schoolId}/students`}>
                            <Users className="h-4 w-4" />View students
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => navigate("/admin/registered-schools")} aria-label="Back to registered schools">
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 p-5">
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      <SummaryInfo label="Registration number" value={school.REGNO} />
                      <SummaryInfo label="School name" value={school.SchoolName} />
                      <SummaryInfo label="Place" value={school.Place} />
                      <SummaryInfo label="Country" value={school.Country} />
                      <SummaryInfo label="Principal name" value={school.Schoolprinciname} />
                      <SummaryInfo label="Principal contact" value={school.PrinciContact} />
                      <SummaryInfo label="Exam mode" value={school.Exam_Mode} />
                      <SummaryInfo label="Students" value={school.studentCount ?? 0} />
                    </div>

                    <section className="border-t pt-5">
                      <h3 className="mb-4 text-sm font-semibold text-slate-700">Olympiad coordinators</h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {schoolExamFields.map((exam) => (
                          <div key={exam.code} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <SummaryInfo label={exam.code} value={isSelected(school[exam.selected]) ? "Selected" : "Not selected"} />
                            <SummaryInfo label={`${exam.code} in-charge`} value={school[exam.teacher]} />
                            <SummaryInfo label={`${exam.code} number`} value={school[exam.mobile]} />
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="grid gap-5 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
                      <Info label="School ID" value={school.SchoolId} />
                      <Info label="School email" value={school.SchoolMail} />
                      <Info label="School contact" value={school.SchoolContact} />
                      <Info label="District" value={school.District} />
                      <Info label="State" value={school.State} />
                      <Info label="Pincode" value={school.Pincode} />
                      <Info label="Coordinator" value={school.Coor} />
                      <Info label="Syllabus" value={school.Syllabus} />
                      <Info label="Last updated" value={school.Updated_Date ? new Date(school.Updated_Date).toLocaleString("en-IN") : ""} />
                      {hasStoredValue(school.SchoolAddress) && (
                        <div className="sm:col-span-2 lg:col-span-4"><Info label="Address" value={school.SchoolAddress} /></div>
                      )}
                    </section>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  {exams.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold text-slate-700">Exam Details</h3>
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        {exams.map((exam) => (
                          <Card key={exam.examCode} className="text-left">
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                              <CardTitle className="text-base text-sky-700">{exam.examName}</CardTitle>
                              <AdminPermission permission="registered_schools.edit">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => openExamEditModal(exam)}
                                aria-label={`Edit ${exam.examName}`}
                                title={`Edit ${exam.examName}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              </AdminPermission>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <Info label="Status" value="Selected by school" />
                              <Info label="Exam date" value={exam.examDate} />
                              <Info label="Exam mode" value={exam.examMode} />
                              <Info label="Teacher in-charge" value={exam.teacherInCharge} />
                              <Info label="Mobile" value={exam.mobile} />
                              <Info label="Email" value={exam.email} />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />

      <Dialog open={isEditModalOpen} onOpenChange={(open) => (open ? setIsEditModalOpen(true) : closeEditModal())}>
        <DialogContent className="max-h-[90vh] w-[min(95vw,1100px)] overflow-y-auto p-0 sm:rounded-2xl">
          <div className="px-5 py-4 sm:px-6">
            <DialogHeader className="mb-4 text-left">
              <DialogTitle className="text-xl font-bold text-slate-900">
                {editTab === "school" ? "Edit School Details" : examModal ? `Edit ${examModal.exam.examName} Details` : "Edit Exam Details"}
              </DialogTitle>
              <DialogDescription>
                {editTab === "school" ? "Update the school information below." : examModal ? "Update this Olympiad's details." : "Select Olympiads and update exam dates and teacher-in-charge details."}
              </DialogDescription>
            </DialogHeader>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 border-b border-slate-200">
              <button
                onClick={() => setEditTab("school")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  editTab === "school"
                    ? "border-b-2 border-sky-600 text-sky-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                School Details
              </button>
              <button
                onClick={() => {
                  setExamModal(null);
                  setEditTab("exam");
                }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  editTab === "exam"
                    ? "border-b-2 border-sky-600 text-sky-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Exam Details
              </button>
            </div>

            {/* School Details Tab */}
            {editTab === "school" && (
              <div className="space-y-5 text-left">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="SchoolId">School ID</Label>
                    <Input id="SchoolId" value={editForm.SchoolId ?? ""} onChange={(event) => updateEditField("SchoolId", event.target.value)} disabled />
                  </div>
                  <div>
                    <Label htmlFor="SchoolName">School Name</Label>
                    <Input id="SchoolName" value={editForm.SchoolName ?? ""} onChange={(event) => updateEditField("SchoolName", event.target.value)} />
                    {touchedFields.SchoolName && editErrors.SchoolName && <p className="mt-1 text-xs text-red-600">{editErrors.SchoolName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="Schoolprinciname">Principal Name</Label>
                    <Input id="Schoolprinciname" value={editForm.Schoolprinciname ?? ""} onChange={(event) => updateEditField("Schoolprinciname", event.target.value)} />
                    {touchedFields.Schoolprinciname && editErrors.Schoolprinciname && <p className="mt-1 text-xs text-red-600">{editErrors.Schoolprinciname}</p>}
                  </div>
                  <div>
                    <Label htmlFor="PrinciContact">Principal Contact</Label>
                    <Input id="PrinciContact" value={editForm.PrinciContact ?? ""} onChange={(event) => updateEditField("PrinciContact", event.target.value)} />
                    {touchedFields.PrinciContact && editErrors.PrinciContact && <p className="mt-1 text-xs text-red-600">{editErrors.PrinciContact}</p>}
                  </div>
                  <div>
                    <Label>Exam Mode</Label>
                    <div className="mt-2 flex flex-wrap gap-4">
                      {["Online", "Offline"].map((mode) => {
                        const checked = getExamModes(editForm.Exam_Mode).includes(mode.toLowerCase());
                        return (
                          <label key={mode} htmlFor={`school-exam-mode-${mode.toLowerCase()}`} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                            <Checkbox
                              id={`school-exam-mode-${mode.toLowerCase()}`}
                              checked={checked}
                              onCheckedChange={(isChecked) => {
                                const modes = getExamModes(editForm.Exam_Mode);
                                if (!isChecked && modes.length === 1 && checked) {
                                  toast.error("Select at least one exam mode.");
                                  return;
                                }
                                const nextModes = isChecked
                                  ? [...new Set([...modes, mode.toLowerCase()])]
                                  : modes.filter((selectedMode) => selectedMode !== mode.toLowerCase());
                                const orderedModes = ["online", "offline"]
                                  .filter((candidate) => nextModes.includes(candidate))
                                  .map((candidate) => candidate === "online" ? "Online" : "Offline");
                                updateEditField("Exam_Mode", orderedModes.join(", "));
                              }}
                            />
                            {mode}
                          </label>
                        );
                      })}
                    </div>
                    {touchedFields.Exam_Mode && editErrors.Exam_Mode && <p className="mt-1 text-xs text-red-600">{editErrors.Exam_Mode}</p>}
                  </div>
                  <div>
                    <Label htmlFor="SchoolMail">School Email</Label>
                    <Input id="SchoolMail" type="email" value={editForm.SchoolMail ?? ""} onChange={(event) => updateEditField("SchoolMail", event.target.value)} />
                    {touchedFields.SchoolMail && editErrors.SchoolMail && <p className="mt-1 text-xs text-red-600">{editErrors.SchoolMail}</p>}
                  </div>
                  <div>
                    <Label htmlFor="SchoolContact">School Contact</Label>
                    <Input id="SchoolContact" type="tel" value={editForm.SchoolContact ?? ""} onChange={(event) => updateEditField("SchoolContact", event.target.value)} />
                    {touchedFields.SchoolContact && editErrors.SchoolContact && <p className="mt-1 text-xs text-red-600">{editErrors.SchoolContact}</p>}
                  </div>
                  <div>
                    <Label htmlFor="Place">Place</Label>
                    <Input id="Place" value={editForm.Place ?? ""} onChange={(event) => updateEditField("Place", event.target.value)} />
                    {touchedFields.Place && editErrors.Place && <p className="mt-1 text-xs text-red-600">{editErrors.Place}</p>}
                  </div>
                  <div>
                    <Label htmlFor="District">District</Label>
                    <Input id="District" value={editForm.District ?? ""} onChange={(event) => updateEditField("District", event.target.value)} />
                    {touchedFields.District && editErrors.District && <p className="mt-1 text-xs text-red-600">{editErrors.District}</p>}
                  </div>
                  <div>
                    <Label htmlFor="State">State</Label>
                    <Input id="State" value={editForm.State ?? ""} onChange={(event) => updateEditField("State", event.target.value)} />
                    {touchedFields.State && editErrors.State && <p className="mt-1 text-xs text-red-600">{editErrors.State}</p>}
                  </div>
                  <div>
                    <Label htmlFor="Country">Country</Label>
                    <Input id="Country" value={editForm.Country ?? ""} onChange={(event) => updateEditField("Country", event.target.value)} />
                    {touchedFields.Country && editErrors.Country && <p className="mt-1 text-xs text-red-600">{editErrors.Country}</p>}
                  </div>
                  <div>
                    <Label htmlFor="Pincode">Pincode</Label>
                    <Input id="Pincode" type="number" value={editForm.Pincode ?? ""} onChange={(event) => updateEditField("Pincode", event.target.value)} />
                    {touchedFields.Pincode && editErrors.Pincode && <p className="mt-1 text-xs text-red-600">{editErrors.Pincode}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="SchoolAddress">Address</Label>
                  <Textarea id="SchoolAddress" value={editForm.SchoolAddress ?? ""} onChange={(event) => updateEditField("SchoolAddress", event.target.value)} className="min-h-24" />
                  {touchedFields.SchoolAddress && editErrors.SchoolAddress && <p className="mt-1 text-xs text-red-600">{editErrors.SchoolAddress}</p>}
                </div>

                {editErrors.submit && <p className="text-sm text-red-600">{editErrors.submit}</p>}
              </div>
            )}

            {/* Exam Details Tab */}
            {editTab === "exam" && (
              !examModal ? (
                <div className="space-y-4 text-left">
                  {schoolExamFields.map((exam) => {
                    const details = editForm[exam.code] || emptyOlympiadDetails;
                    const dateOptions = [...new Set([
                      details.examDate,
                      ...(examDateOptions[exam.code] || []),
                    ].filter(Boolean))];
                    return (
                      <section key={exam.code} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <Label className="flex items-center gap-3 text-base font-semibold text-slate-900">
                          <Checkbox
                            checked={Boolean(details.selected)}
                            onCheckedChange={(checked) => updateOlympiadField(exam.code, "selected", Boolean(checked))}
                          />
                          {exam.code}
                        </Label>
                        {details.selected && (
                          <div className="mt-4 space-y-4 border-t border-slate-200 pt-4">
                            <div>
                              <Label htmlFor={`${exam.code}-exam-date`}>Exam Date</Label>
                              {dateOptions.length ? (
                                <select
                                  id={`${exam.code}-exam-date`}
                                  value={details.examDate}
                                  onChange={(event) => updateOlympiadField(exam.code, "examDate", event.target.value)}
                                  className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                                >
                                  <option value="">Select an exam date</option>
                                  {dateOptions.map((date) => <option key={date} value={date}>{date}</option>)}
                                </select>
                              ) : (
                                <p className="mt-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500">
                                  No exam dates configured yet.
                                </p>
                              )}
                            </div>
                            <div className="space-y-3">
                              <Label>Teacher-in-Charge</Label>
                              <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                                <select
                                  aria-label={`${exam.code} teacher title`}
                                  value={details.teacherTitle}
                                  onChange={(event) => updateOlympiadField(exam.code, "teacherTitle", event.target.value)}
                                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                                >
                                  <option value="Mr">Mr.</option>
                                  <option value="Ms">Ms.</option>
                                </select>
                                <Input
                                  aria-label={`${exam.code} teacher name`}
                                  placeholder="Enter teacher name"
                                  value={details.teacherName}
                                  onChange={(event) => updateOlympiadField(exam.code, "teacherName", event.target.value)}
                                />
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                <Input
                                  aria-label={`${exam.code} teacher mobile`}
                                  type="tel"
                                  placeholder="Enter mobile number"
                                  value={details.mobile}
                                  onChange={(event) => updateOlympiadField(exam.code, "mobile", event.target.value)}
                                />
                                <Input
                                  aria-label={`${exam.code} teacher email`}
                                  type="email"
                                  placeholder="Enter email address"
                                  value={details.email}
                                  onChange={(event) => updateOlympiadField(exam.code, "email", event.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </section>
                    );
                  })}
                  {editErrors.olympiads && <p className="text-sm text-red-600">{editErrors.olympiads}</p>}
                </div>
              ) : (
              <div className="space-y-5 text-left">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="examDate">Exam Date</Label>
                    <Input
                      id="examDate"
                      type="date"
                      value={examForm.examDate}
                      onChange={(event) => updateExamField("examDate", event.target.value)}
                    />
                    {examTouchedFields.examDate && examErrors.examDate && <p className="mt-1 text-xs text-red-600">{examErrors.examDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="teacherInCharge">Teacher In-Charge</Label>
                    <Input
                      id="teacherInCharge"
                      value={examForm.teacherInCharge}
                      onChange={(event) => updateExamField("teacherInCharge", event.target.value)}
                    />
                    {examTouchedFields.teacherInCharge && examErrors.teacherInCharge && <p className="mt-1 text-xs text-red-600">{examErrors.teacherInCharge}</p>}
                  </div>
                  <div>
                    <Label htmlFor="examMobile">Mobile</Label>
                    <Input
                      id="examMobile"
                      type="tel"
                      value={examForm.mobile}
                      onChange={(event) => updateExamField("mobile", event.target.value)}
                    />
                    {examTouchedFields.mobile && examErrors.mobile && <p className="mt-1 text-xs text-red-600">{examErrors.mobile}</p>}
                  </div>
                  <div>
                    <Label htmlFor="examEmail">Email</Label>
                    <Input
                      id="examEmail"
                      type="email"
                      value={examForm.email}
                      onChange={(event) => updateExamField("email", event.target.value)}
                    />
                    {examTouchedFields.examEmail && examErrors.email && <p className="mt-1 text-xs text-red-600">{examErrors.email}</p>}
                  </div>
                </div>
                {examErrors.submit && <p className="text-sm text-red-600">{examErrors.submit}</p>}
              </div>
              )
            )}

            {/* Footer */}
            <DialogFooter className="mt-6 gap-2 border-t border-slate-200 pt-4 sm:justify-end">
              <Button type="button" variant="outline" onClick={closeEditModal} disabled={isSavingSchool || isSavingExam}>
                Cancel
              </Button>
              <AdminPermission permission="registered_schools.edit">
              <Button
                type="button"
                onClick={editTab === "school" ? handleSaveSchool : examModal ? handleSaveExam : handleSaveOlympiads}
                disabled={isSavingSchool || isSavingExam}
              >
                <Pencil className="h-4 w-4" />
                {editTab === "school"
                  ? isSavingSchool ? "Saving..." : "Save Changes"
                  : isSavingSchool || isSavingExam ? "Saving..." : "Save Changes"}
              </Button>
              </AdminPermission>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectedSchoolDetails;
