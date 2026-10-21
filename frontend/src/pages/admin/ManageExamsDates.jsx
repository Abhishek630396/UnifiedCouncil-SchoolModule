import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarPlus, ChevronLeft, ChevronRight, Pencil, Plus, Power, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SchoolHeader from "../school/components/SchoolHeader";
import AdminSideBar from "./AdminSideBar";
import { AdminPermission } from "./AdminAccess";
import API_BASE_URL from "@/services/apiBaseUrl";
import AdminPageJump from "./components/AdminPageJump";

const EXAMS = ["NSTSE", "UIEO", "UIMO", "UCO", "UIGKO"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PAGE_SIZE = 5;
const EMPTY_FORM = { examCode: "", date: "", dateTo: "", mode: "Offline", modes: ["Offline"], isActive: true };

const getDayName = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  return DAYS[new Date(year, month - 1, day).getDay()] || "";
};

const formatExamDateLabel = (row) => {
  if (row?.label) {
    return row.label;
  }

  if (!row?.date) {
    return "";
  }

  const [year, month, day] = row.date.split("-");
  return `${day}-${month}-${year} (${row.day || getDayName(row.date)})-${row.mode || "Offline"}`;
};

const createEmptyExamColumns = (page = 1) =>
  EXAMS.map((examCode) => ({
    examCode,
    page,
    pageSize: PAGE_SIZE,
    total: 0,
    totalPages: 1,
    dates: [],
  }));

const createEmptyExamColumn = (examCode, page = 1) => ({
  examCode,
  page,
  pageSize: PAGE_SIZE,
  total: 0,
  totalPages: 1,
  dates: [],
});

const sortExamDates = (dates = []) =>
  [...dates].sort((a, b) => {
    const activeCompare = Number(b.isActive) - Number(a.isActive);
    if (activeCompare !== 0) {
      return activeCompare;
    }

    const dateA = a?.date ? new Date(a.date).getTime() : 0;
    const dateB = b?.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

const ManageExamsDates = () => {
  const navigate = useNavigate();
  const [examColumns, setExamColumns] = useState(createEmptyExamColumns);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const getToken = () => localStorage.getItem("uc_admin_token");

  const loadExamDates = async (targetPage = page) => {
    const token = getToken();
    if (!token) {
      navigate("/school/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/exam-dates`, {
        params: { page: targetPage, pageSize: PAGE_SIZE },
        headers: { Authorization: `Bearer ${token}` },
      });

      const loadedColumns = Array.isArray(response.data?.data) ? response.data.data : [];
      setExamColumns(
        EXAMS.map((examCode) => {
          const found = loadedColumns.find((item) => item.examCode === examCode) || createEmptyExamColumn(examCode, targetPage);
          return {
            ...found,
            dates: sortExamDates(found.dates || []),
          };
        })
      );
      setPage(targetPage);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      }
      toast.error(error.response?.data?.message || "Unable to load exam dates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExamDates(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxTotalPages = Math.max(...examColumns.map((exam) => exam.totalPages || 1), 1);

  const openInsertModal = (examCode, mode) => {
    setFormData({ ...EMPTY_FORM, examCode, day: "", mode, modes: [mode] });
    setIsModalOpen(true);
  };

  const openEditModal = (dateRow) => {
    setFormData({
      id: dateRow.id,
      examCode: dateRow.examCode,
      date: dateRow.date,
      dateTo: dateRow.dateTo && dateRow.dateTo !== dateRow.date ? dateRow.dateTo : "",
      day: dateRow.day || getDayName(dateRow.date),
      mode: dateRow.mode,
      modes: [dateRow.mode],
      isActive: dateRow.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(EMPTY_FORM);
  };

  const handleSave = async () => {
    const token = getToken();
    const day = formData.day || getDayName(formData.date);

    if (!formData.examCode || !formData.date || !day) {
      toast.error("Please select an exam date");
      return;
    }
    if (formData.dateTo && formData.dateTo < formData.date) {
      toast.error("End date cannot be earlier than the start date.");
      return;
    }
    if (!formData.id && (!Array.isArray(formData.modes) || formData.modes.length === 0)) {
      toast.error("Select Online, Offline, or both exam modes.");
      return;
    }
    if (formData.dateTo) {
      const rangeDays = (Date.parse(`${formData.dateTo}T00:00:00Z`) - Date.parse(`${formData.date}T00:00:00Z`)) / 86400000 + 1;
      if (rangeDays > 366) {
        toast.error("A date range cannot contain more than 366 days.");
        return;
      }
    }

    setIsSaving(true);
    try {
      await axios({
        method: formData.id ? "put" : "post",
        url: formData.id
          ? `${API_BASE_URL}/admin/exam-dates/${formData.id}`
          : `${API_BASE_URL}/admin/exam-dates`,
        data: {
          examCode: formData.examCode,
          date: formData.date,
          day,
          ...(formData.id
            ? { mode: formData.mode, dateTo: formData.dateTo || formData.date }
            : { dateTo: formData.dateTo || formData.date, modes: formData.modes }),
          isActive: formData.isActive,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`${formData.examCode} exam date${formData.id ? "" : "s"} ${formData.id ? "updated" : "added"}`);
      closeModal();
      await loadExamDates(page);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      }
      toast.error(error.response?.data?.message || `Unable to ${formData.id ? "update" : "insert"} exam date`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (dateRow) => {
    const token = getToken();
    const nextStatus = !dateRow.isActive;

    setExamColumns((currentColumns) =>
      currentColumns.map((exam) => {
        if (exam.examCode !== dateRow.examCode) {
          return exam;
        }

        return {
          ...exam,
          dates: sortExamDates(
            (exam.dates || []).map((item) =>
              item.id === dateRow.id ? { ...item, isActive: nextStatus } : item
            )
          ),
        };
      })
    );

    try {
      await axios.patch(
        `${API_BASE_URL}/admin/exam-dates/${dateRow.id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Date marked ${nextStatus ? "active" : "inactive"}`);
    } catch (error) {
      setExamColumns((currentColumns) =>
        currentColumns.map((exam) => {
          if (exam.examCode !== dateRow.examCode) {
            return exam;
          }

          return {
            ...exam,
            dates: sortExamDates(
              (exam.dates || []).map((item) =>
                item.id === dateRow.id ? { ...item, isActive: dateRow.isActive } : item
              )
            ),
          };
        })
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
        return;
      }
      toast.error(error.response?.data?.message || "Unable to update status");
    }
  };

  const handleDeleteDate = async (dateRow) => {
    if (!window.confirm(`Delete the ${dateRow.mode.toLowerCase()} ${dateRow.examCode} date ${formatExamDateLabel(dateRow)}?`)) {
      return;
    }

    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/admin/exam-dates/${dateRow.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Exam date deleted successfully.");
      await loadExamDates(page);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
        return;
      }
      toast.error(error.response?.data?.message || "Unable to delete exam date.");
    }
  };

  const renderModeSection = (mode) => (
    <section key={mode} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{mode} Exam Dates</h2>
          <p className="text-sm text-slate-500">Manage dates for {mode.toLowerCase()} examinations.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        {examColumns.map((exam) => {
          const modeDates = exam.dates.filter((dateRow) => dateRow.mode === mode);
          return (
            <div key={mode + "-" + exam.examCode} className="flex min-h-[260px] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-left">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{exam.examCode}</h3>
                  <p className="text-xs text-slate-500">{modeDates.length} shown on this page</p>
                </div>
                <AdminPermission permission="exam_dates.create">
                <Button type="button" size="sm" onClick={() => openInsertModal(exam.examCode, mode)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
                </AdminPermission>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {modeDates.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">No {mode.toLowerCase()} dates on this page.</div>
                ) : (
                  modeDates.map((dateRow) => (
                    <div
                      key={dateRow.id}
                      className={"rounded-xl border p-3 shadow-sm " + (
                        dateRow.isActive
                          ? "border-emerald-200 bg-emerald-50/70"
                          : "border-rose-200 bg-rose-50/70"
                      )}
                    >
                      <div className="text-sm font-semibold text-slate-900">{formatExamDateLabel(dateRow)}</div>
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="whitespace-nowrap rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold leading-4 text-slate-700">{dateRow.mode}</span>
                        <span className={"whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-4 " + (dateRow.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
                          {dateRow.isActive ? "Active" : "Inactive"}
                        </span>
                        <AdminPermission permission="exam_dates.activate">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(dateRow)}
                          className={"h-6 w-6 shrink-0 rounded-full p-0 text-xs font-semibold " + (dateRow.isActive ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800")}
                          title={dateRow.isActive ? "Mark inactive" : "Mark active"}
                        >
                          <Power className="h-3 w-3" />
                        </Button>
                        </AdminPermission>
                        <AdminPermission permission="exam_dates.edit">
                        <Button type="button" variant="outline" size="sm" onClick={() => openEditModal(dateRow)} className="h-6 w-6 shrink-0 rounded-full border-sky-200 bg-sky-50 p-0 text-sky-700 hover:bg-sky-100" title={"Edit " + exam.examCode + " date"}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        </AdminPermission>
                        <AdminPermission permission="exam_dates.delete">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDate(dateRow)}
                          className="h-6 w-6 shrink-0 rounded-full border-rose-200 bg-rose-50 p-0 text-rose-700 hover:bg-rose-100"
                          title={"Delete " + exam.examCode + " date"}
                          aria-label={"Delete " + exam.examCode + " " + dateRow.mode + " date"}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        </AdminPermission>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SchoolHeader />
      <div className="flex flex-col bg-slate-50 lg:flex-row">
      <AdminSideBar />
      <main className="min-w-0 flex-1 px-3 py-5 sm:px-5">
        <section className="mx-auto max-w-7xl space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-2 text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Admin</p>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Manage Exam Dates</h1>
              <p className="text-sm text-slate-600">Add dates per exam and review active or inactive entries.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => loadExamDates(Math.max(1, page - 1))} disabled={isLoading || page <= 1}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Button>
              <AdminPageJump
                page={page}
                totalPages={maxTotalPages}
                onPageChange={loadExamDates}
                disabled={isLoading}
              />
              <Button type="button" variant="outline" onClick={() => loadExamDates(Math.min(maxTotalPages, page + 1))} disabled={isLoading || page >= maxTotalPages}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">Loading exam dates...</div>
          ) : (
            <div className="space-y-5">
              {renderModeSection("Online")}
              {renderModeSection("Offline")}
            </div>
          )}
        </section>
      </main>
      </div>
      <Footer />

      <Dialog open={isModalOpen} onOpenChange={(open) => (open ? setIsModalOpen(true) : closeModal())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit" : "Add"} {formData.examCode} Exam Date</DialogTitle>
              <DialogDescription>
                {formData.id
                  ? "Update the date, day, mode, or status for this exam."
                  : "Add one date or an inclusive date range for Online, Offline, or both exam modes."}
              </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-left">
            <div>
              <Label>{formData.id ? "Date" : "Start date"}</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(event) => setFormData((current) => ({
                  ...current,
                  date: event.target.value,
                  day: getDayName(event.target.value),
                  dateTo: current.dateTo && current.dateTo < event.target.value ? "" : current.dateTo,
                }))}
              />
            </div>

            (
              <div>
                <Label>End date (optional)</Label>
                <Input
                  type="date"
                  min={formData.date || undefined}
                  value={formData.dateTo}
                  onChange={(event) => setFormData((current) => ({ ...current, dateTo: event.target.value }))}
                />
                <p className="mt-1 text-xs text-slate-500">Leave blank to add just the start date. The range includes both dates.</p>
              </div>
            )

            {formData.id && <div>
              <Label>Day</Label>
              <div className="mt-1 flex h-10 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700">
                <Input value={formData.day || getDayName(formData.date)} onChange={(event) => setFormData((current) => ({ ...current, day: event.target.value }))} placeholder="Enter day" />
              </div>
            </div>}

            <div>
              <Label>Exam mode{formData.id ? "" : "s"}</Label>
              {formData.id ? (
                <RadioGroup
                  value={formData.mode}
                  onValueChange={(value) => setFormData((current) => ({ ...current, mode: value }))}
                  className="mt-2 flex gap-4"
                >
                  {["Offline", "Online"].map((mode) => (
                    <Label key={mode} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <RadioGroupItem value={mode} />
                      {mode}
                    </Label>
                  ))}
                </RadioGroup>
              ) : (
                <div className="mt-2 flex gap-4">
                  {["Offline", "Online"].map((mode) => (
                    <Label key={mode} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Checkbox
                        checked={formData.modes.includes(mode)}
                        onCheckedChange={(checked) => setFormData((current) => ({
                          ...current,
                          modes: checked
                            ? [...new Set([...current.modes, mode])]
                            : current.modes.filter((selectedMode) => selectedMode !== mode),
                        }))}
                      />
                      {mode}
                    </Label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Status</Label>
              <RadioGroup
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) => setFormData((current) => ({ ...current, isActive: value === "active" }))}
                className="mt-2 flex gap-4"
              >
                {[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ].map((status) => (
                  <Label key={status.value} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <RadioGroupItem value={status.value} />
                    {status.label}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal} disabled={isSaving}>
              Cancel
            </Button>
            <AdminPermission permission={formData.id ? "exam_dates.edit" : "exam_dates.create"}>
            <Button type="button" onClick={handleSave} disabled={isSaving}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : formData.id ? "Save Changes" : "Insert Date"}
            </Button>
            </AdminPermission>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageExamsDates;
