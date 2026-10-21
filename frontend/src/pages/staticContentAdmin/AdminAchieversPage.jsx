import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  Globe,
  LoaderCircle,
  Medal,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Trophy,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { staticContentAdminApi } from "@/services/staticContentPublicApi";

const ACHIEVER_CATEGORIES = [
  { key: "uco-offline", label: "UCO Offline", icon: BookOpen, color: "from-sky-500 to-blue-700" },
  { key: "uco-online", label: "UCO Online", icon: Sparkles, color: "from-cyan-500 to-teal-600" },
  { key: "uigko-offline", label: "UIGKO Offline", icon: Globe, color: "from-emerald-500 to-teal-700" },
  { key: "uieo-offline", label: "UIEO Offline", icon: Brain, color: "from-violet-500 to-purple-700" },
  { key: "uieo-online", label: "UIEO Online", icon: Sparkles, color: "from-fuchsia-500 to-pink-700" },
  { key: "nstse-offline", label: "NSTSE Offline", icon: GraduationCap, color: "from-orange-500 to-amber-600" },
  { key: "nstse-online", label: "NSTSE Online", icon: Trophy, color: "from-rose-500 to-red-700" },
  { key: "uimo-offline", label: "UIMO Offline", icon: Medal, color: "from-indigo-500 to-blue-800" },
  { key: "uimo-online", label: "UIMO Online", icon: UsersRound, color: "from-amber-500 to-orange-700" },
];
const YEARS = Array.from({ length: 8 }, (_value, index) => String(2026 - index));
const CLASSES = Array.from({ length: 10 }, (_value, index) => index + 1);
const RESULT_LIMITS = [
  { value: "all", label: "All achievers" },
  { value: "5", label: "Top 5" },
  { value: "10", label: "Top 10" },
  { value: "50", label: "Top 50" },
  { value: "100", label: "Top 100" },
];
const inputClassName = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10";

const AchieverPhoto = ({ name, photo }) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400">
      {(!photo || imageFailed) && <UserRound className="h-6 w-6" aria-hidden="true" />}
      {photo && !imageFailed && (
        <img
          src={photo}
          alt={`${name} photo`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      )}
    </span>
  );
};

const AdminAchieversPage = () => {
  const [customExams, setCustomExams] = useState([]);
  const [showAddExam, setShowAddExam] = useState(false);
  const [newExamName, setNewExamName] = useState("");
  const [addingExam, setAddingExam] = useState(false);
  const [pendingDeleteExam, setPendingDeleteExam] = useState(null);
  const [deletingExamId, setDeletingExamId] = useState(null);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [addingRecord, setAddingRecord] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [pendingDeleteRecord, setPendingDeleteRecord] = useState(null);
  const [deletingRecordId, setDeletingRecordId] = useState(null);
  const [newRecord, setNewRecord] = useState({
    name: "",
    school: "",
    year: "",
    studentClass: "",
    rank: "",
    photo: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState(null);
  const [categoryCountsLoading, setCategoryCountsLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLimit, setSelectedLimit] = useState("all");
  const categoryRequestId = useRef(0);
  const deleteActionRef = useRef(null);
  const examOptions = [
    ...ACHIEVER_CATEGORIES,
    ...customExams.map((exam) => ({
      key: `custom-${exam.id}`,
      label: exam.name,
      customId: exam.id,
      icon: Trophy,
      color: "from-sky-500 to-indigo-700",
    })),
  ];

  useEffect(() => {
    let isCurrent = true;
    staticContentAdminApi.getAchieverCounts()
      .then((response) => {
        if (isCurrent) {
          setCategoryCounts(response.data);
        }
      })
      .catch((error) => {
        if (isCurrent) {
          toast.error(error.message || "Unable to load achiever record counts.");
        }
      })
      .finally(() => {
        if (isCurrent) {
          setCategoryCountsLoading(false);
        }
      });
    staticContentAdminApi.getAchieverExams()
      .then((response) => {
        if (isCurrent) setCustomExams(response.data || []);
      })
      .catch((error) => {
        if (isCurrent) toast.error(error.message || "Unable to load custom exams.");
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleAddExam = async (event) => {
    event.preventDefault();
    setAddingExam(true);
    try {
      const response = await staticContentAdminApi.createAchieverExam({ name: newExamName });
      const exam = response.data;
      setCustomExams((current) => [...current, exam]);
      setCategoryCounts((current) => current
        ? [...current, { category: `custom-${exam.id}`, count: 0 }]
        : current);
      setNewExamName("");
      setShowAddExam(false);
      handleCategorySelect(`custom-${exam.id}`);
      toast.success("Exam added.");
    } catch (error) {
      toast.error(error.message || "Unable to add this exam.");
    } finally {
      setAddingExam(false);
    }
  };

  const handleDeleteExam = async () => {
    if (!pendingDeleteExam) return;
    const exam = pendingDeleteExam;
    setPendingDeleteExam(null);
    setDeletingExamId(exam.id);
    try {
      await staticContentAdminApi.deleteAchieverExam(exam.id);
      setCustomExams((current) => current.filter((item) => String(item.id) !== String(exam.id)));
      setCategoryCounts((current) => current?.filter((item) => item.category !== `custom-${exam.id}`));
      if (selectedCategory === `custom-${exam.id}`) {
        categoryRequestId.current += 1;
        setSelectedCategory(null);
        setCategoryData(null);
        setSelectedYear("");
        setSelectedClass("");
      }
      setShowAddRecord(false);
      setEditingRecordId(null);
      toast.success("Exam and its achiever records deleted.");
    } catch (error) {
      toast.error(error.message || "Unable to delete this exam.");
    } finally {
      setDeletingExamId(null);
    }
  };

  const handleSaveRecord = async (event) => {
    event.preventDefault();
    const exam = examOptions.find((item) => item.key === selectedCategory && item.customId);
    if (!selectedCategory || !selectedCategoryLabel) {
      toast.error("Choose an exam before adding an achiever.");
      return;
    }
    setAddingRecord(true);
    try {
      const yearStart = Number(newRecord.year);
      const recordData = {
        ...newRecord,
        year: `${newRecord.year}-${String((yearStart + 1) % 100).padStart(2, "0")}`,
        exam: selectedCategoryLabel,
      };
      if (editingRecordId) {
        await staticContentAdminApi.updateAchiever(editingRecordId, recordData);
      } else if (exam) {
        await staticContentAdminApi.createExamAchiever(exam.customId, recordData);
        setCategoryCounts((current) => current?.map((item) => (
          item.category === selectedCategory ? { ...item, count: Number(item.count) + 1 } : item
        )));
      } else {
        await staticContentAdminApi.createAchiever(recordData);
        setCategoryCounts((current) => current?.map((item) => (
          item.category === selectedCategory ? { ...item, count: Number(item.count) + 1 } : item
        )));
      }
      setSelectedYear(newRecord.year);
      setSelectedClass(newRecord.studentClass);
      setNewRecord({
        name: "",
        school: "",
        year: "",
        studentClass: "",
        rank: "",
        photo: "",
      });
      setShowAddRecord(false);
      const wasEditing = Boolean(editingRecordId);
      setEditingRecordId(null);
      try {
        const response = await staticContentAdminApi.getTopAchievers({
          category: selectedCategory,
          year: newRecord.year,
          studentClass: newRecord.studentClass,
          limit: selectedLimit,
        });
        setCategoryData(response.data);
      } catch (error) {
        toast.error(`Achiever was saved, but the results could not be refreshed: ${error.message}`);
      }
      toast.success(wasEditing ? "Achiever updated." : "Achiever added.");
    } catch (error) {
      toast.error(error.message || "Unable to save this achiever.");
    } finally {
      setAddingRecord(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!pendingDeleteRecord) return;
    const record = pendingDeleteRecord;
    setPendingDeleteRecord(null);
    setDeletingRecordId(record.id);
    try {
      await staticContentAdminApi.deleteAchiever(record.id);
      setCategoryCounts((current) => current?.map((item) => (
        item.category === selectedCategory
          ? { ...item, count: Math.max(0, Number(item.count) - 1) }
          : item
      )));
      setCategoryData(null);
      toast.success("Achiever deleted.");
      if (selectedYear && selectedClass) {
        try {
          const response = await staticContentAdminApi.getTopAchievers({
            category: selectedCategory,
            year: selectedYear,
            studentClass: selectedClass,
            limit: selectedLimit,
          });
          setCategoryData(response.data);
        } catch (error) {
          toast.error(`Achiever was deleted, but the results could not be refreshed: ${error.message}`);
        }
      } else {
        setCategoryData(null);
      }
    } catch (error) {
      toast.error(error.message || "Unable to delete this achiever.");
    } finally {
      setDeletingRecordId(null);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryData(null);
    setShowAddRecord(false);
    setEditingRecordId(null);
    setSelectedYear("");
    setSelectedClass("");
    setSelectedLimit("all");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedCategory || !selectedYear || !selectedClass || !selectedLimit) {
      toast.error("Choose an exam, year, class, and result range to view achievers.");
      return;
    }

    const requestId = categoryRequestId.current + 1;
    categoryRequestId.current = requestId;
    setCategoryLoading(true);
    setCategoryData(null);

    try {
      const response = await staticContentAdminApi.getTopAchievers({
        category: selectedCategory,
        year: selectedYear,
        studentClass: selectedClass,
        limit: selectedLimit,
      });
      if (requestId === categoryRequestId.current) {
        setCategoryData(response.data);
      }
    } catch (error) {
      if (requestId === categoryRequestId.current) {
        toast.error(error.message || "Unable to load this exam's achievers");
      }
    } finally {
      if (requestId === categoryRequestId.current) {
        setCategoryLoading(false);
      }
    }
  };

  const selectedCategoryLabel = examOptions.find(
    (category) => category.key === selectedCategory
  )?.label;
  const selectedLimitLabel = RESULT_LIMITS.find(
    (limit) => limit.value === selectedLimit
  )?.label;
  const selectedCategoryCount = categoryCounts?.find(
    (item) => item.category === selectedCategory
  )?.count;

  return (
    <div className="w-full space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">Static Content</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Achievers</h1>
        <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
          Choose an exam, year, and class to view all achievers.
        </p>
      </header>

      <section aria-labelledby="exam-category-heading" className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">Browse results</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="exam-category-heading" className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Choose an exam category
              </h2>
              <p className="mt-1 text-sm text-slate-500">Select an exam to view its achievers, or add a custom exam.</p>
            </div>
            <Button
              type="button"
              onClick={() => setShowAddExam((visible) => !visible)}
              className="h-11 rounded-xl bg-sky-600 px-5 font-bold text-white hover:bg-sky-700"
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Add exam
            </Button>
          </div>
        </div>
        {showAddExam && (
          <form onSubmit={handleAddExam} className="mb-5 flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="new-achiever-exam" className="mb-2 block text-sm font-bold text-slate-700">Exam name</label>
              <input
                id="new-achiever-exam"
                value={newExamName}
                onChange={(event) => setNewExamName(event.target.value)}
                maxLength={50}
                className={inputClassName}
                placeholder="Enter exam name"
                required
              />
            </div>
            <Button type="submit" disabled={addingExam} className="h-11 rounded-xl bg-indigo-600 px-5 font-bold text-white hover:bg-indigo-700 disabled:opacity-60">
              {addingExam ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="mr-2 h-4 w-4" aria-hidden="true" />}
              {addingExam ? "Adding..." : "Save exam"}
            </Button>
          </form>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {examOptions.map((category) => {
            const isSelected = selectedCategory === category.key;
            const Icon = category.icon;
            return (
              <div key={category.key} className="flex min-h-[5.25rem] gap-2">
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleCategorySelect(category.key)}
                  className={`group relative flex min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 sm:p-4 ${
                    isSelected
                      ? `border-transparent bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300"
                  }`}
                >
                  {!isSelected && <span className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${category.color}`} />}
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isSelected ? "bg-white/20 text-white" : `bg-gradient-to-br ${category.color} text-white shadow-md`
                  }`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold sm:text-base">{category.label}</span>
                    <span className={`mt-1 block text-xs font-medium ${isSelected ? "text-white/80" : "text-slate-500"}`}>
                      {category.customId ? "Custom exam" : category.key.endsWith("online") ? "Online Olympiad" : "Offline Olympiad"}
                    </span>
                  </span>
                  {isSelected && <CheckCircle2 className="h-5 w-5 shrink-0 text-white" aria-hidden="true" />}
                </button>
                {category.customId && (
                  <Button
                    type="button"
                    variant="outline"
                    aria-label={`Delete ${category.label}`}
                    title={`Delete ${category.label}`}
                    disabled={deletingExamId === category.customId}
                    onClick={() => setPendingDeleteExam({ id: category.customId, name: category.label })}
                    className="h-auto w-12 shrink-0 rounded-2xl border-red-200 px-0 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                  >
                    {deletingExamId === category.customId
                      ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                      : <Trash2 className="h-5 w-5" aria-hidden="true" />}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {selectedCategory && (
        <section aria-labelledby="selected-exam-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">Achievers</p>
              <h2 id="selected-exam-heading" className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                {selectedCategoryLabel} · {selectedLimitLabel || "All achievers"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">All achiever records are selected by default. Choose a year and class, then select Show Achievers.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-sky-800">
                <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
                {selectedLimitLabel || "All achievers"}
              </span>
              <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700" aria-live="polite">
                {categoryCountsLoading
                  ? "Loading exam count…"
                  : categoryCounts
                    ? `${Number(selectedCategoryCount || 0).toLocaleString()} records in this exam`
                    : "Exam count unavailable"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div>
                <label htmlFor="achiever-year" className="mb-2 block text-sm font-bold text-slate-700">Select year</label>
                <select
                  id="achiever-year"
                  value={selectedYear}
                  onChange={(event) => {
                    setSelectedYear(event.target.value);
                    setCategoryData(null);
                  }}
                  className={inputClassName}
                  disabled={categoryLoading}
                  required
                >
                  <option value="">Choose a year</option>
                  {YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="achiever-class" className="mb-2 block text-sm font-bold text-slate-700">Select class</label>
                <select
                  id="achiever-class"
                  value={selectedClass}
                  onChange={(event) => {
                    setSelectedClass(event.target.value);
                    setCategoryData(null);
                  }}
                  className={inputClassName}
                  disabled={categoryLoading}
                  required
                >
                  <option value="">Choose a class</option>
                  {CLASSES.map((studentClass) => (
                    <option key={studentClass} value={studentClass}>Class {studentClass}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="achiever-limit" className="mb-2 block text-sm font-bold text-slate-700">Select result range</label>
                <select
                  id="achiever-limit"
                  value={selectedLimit}
                  onChange={(event) => {
                    setSelectedLimit(event.target.value);
                    setCategoryData(null);
                  }}
                  className={inputClassName}
                  disabled={categoryLoading}
                  required
                >
                  {RESULT_LIMITS.map((limit) => (
                    <option key={limit.value} value={limit.value}>{limit.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="submit"
                disabled={categoryLoading || !selectedYear || !selectedClass || !selectedLimit}
                className="h-12 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-7 font-bold text-white shadow-lg shadow-indigo-200 transition hover:from-sky-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {categoryLoading
                  ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  : <Search className="mr-2 h-4 w-4" aria-hidden="true" />}
                {categoryLoading ? "Loading achievers..." : "Show Achievers"}
              </Button>
              <p className="text-xs text-slate-500">All records are shown by default. Photos appear in the first column when a matching photo is available.</p>
            </div>

            {categoryLoading && (
              <div className="flex items-center gap-2 py-3 text-sm font-medium text-slate-500" role="status">
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading Class {selectedClass} achievers for {selectedYear}…
              </div>
            )}

            {!categoryLoading && categoryData && !categoryData.available && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center" role="status">
                <Trophy className="mx-auto h-8 w-8 text-amber-500" aria-hidden="true" />
                <p className="mt-2 font-bold text-amber-950">No achiever records available yet</p>
                <p className="mt-1 text-sm text-amber-800">
                  {selectedCategoryLabel} records for {selectedYear}, Class {selectedClass}, are not connected yet.
                </p>
              </div>
            )}

            {!categoryLoading && categoryData?.available && categoryData.records?.length === 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center" role="status">
                <Trophy className="mx-auto h-8 w-8 text-amber-500" aria-hidden="true" />
                <p className="mt-2 font-bold text-amber-950">No achiever records available yet</p>
                <p className="mt-1 text-sm text-amber-800">
                  No {selectedCategoryLabel} records were found for {selectedYear}, Class {selectedClass}.
                </p>
              </div>
            )}

            {!categoryLoading && categoryData?.records?.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-sky-50 to-indigo-50 px-4 py-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900">{selectedYear} · Class {selectedClass}</h3>
                    <p className="mt-1 text-sm text-slate-600">{selectedCategoryLabel}</p>
                  </div>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800">
                    {categoryData.records.length} {categoryData.records.length === 1 ? "achiever" : "achievers"}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-bold">Photo</th>
                        <th className="px-4 py-3 font-bold">Rank</th>
                        <th className="px-4 py-3 font-bold">Student</th>
                        <th className="px-4 py-3 font-bold">School</th>
                        <th className="px-4 py-3 font-bold">Score</th>
                        <th className="px-4 py-3 font-bold">Place</th>
                        <th className="px-4 py-3 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {categoryData.records.map((record, index) => (
                        <tr key={`${selectedCategory}-${selectedYear}-${selectedClass}-${record.isManaged ? "managed" : "legacy"}-${record.id}`} className="transition hover:bg-sky-50/50">
                          <td className="px-4 py-3">
                            <AchieverPhoto name={record.name} photo={record.photo} />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex min-w-10 items-center justify-center rounded-full px-2.5 py-1 font-extrabold ${
                              index === 0 ? "bg-amber-100 text-amber-800" : "bg-indigo-50 text-indigo-700"
                            }`}>
                              {record.rank}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{record.name}</td>
                          <td className="px-4 py-3 text-slate-600">{record.school}</td>
                          <td className="px-4 py-3 font-semibold text-slate-700">{record.score ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-600">{record.location || "—"}</td>
                          <td className="px-4 py-3">
                            {record.isManaged ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  aria-label={`Edit ${record.name}`}
                                  title={`Edit ${record.name}`}
                                  onClick={() => {
                                    setEditingRecordId(record.id);
                                    setNewRecord({
                                      name: record.name || "",
                                      school: record.school || "",
                                      year: String(record.year || "").slice(0, 4),
                                      studentClass: String(record.studentClass || ""),
                                      rank: String(record.rank || ""),
                                      photo: record.photo || "",
                                    });
                                    setShowAddRecord(true);
                                  }}
                                  className="h-9 w-9 rounded-lg px-0 text-sky-700"
                                >
                                  <Pencil className="h-4 w-4" aria-hidden="true" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  aria-label={`Delete ${record.name}`}
                                  title={`Delete ${record.name}`}
                                  disabled={deletingRecordId === record.id}
                                  onClick={() => setPendingDeleteRecord(record)}
                                  className="h-9 w-9 rounded-lg border-red-200 px-0 text-red-600 hover:bg-red-50"
                                >
                                  {deletingRecordId === record.id
                                    ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                                    : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">Legacy record</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </form>
        </section>
      )}
      {selectedCategory && (
        <section aria-labelledby="custom-exam-record-heading" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">Manage results</p>
              <h2 id="custom-exam-record-heading" className="mt-1 text-xl font-extrabold text-slate-900">
                {editingRecordId ? "Edit achiever" : `Add an achiever to ${selectedCategoryLabel}`}
              </h2>
            </div>
            <Button
              type="button"
              disabled={Boolean(editingRecordId)}
              onClick={() => {
                const shouldOpen = !showAddRecord;
                setShowAddRecord(shouldOpen);
                if (shouldOpen) {
                  setEditingRecordId(null);
                  setNewRecord({
                    name: "",
                    school: "",
                    year: selectedYear,
                    studentClass: selectedClass,
                    rank: "",
                    photo: "",
                  });
                }
              }}
              className="h-11 rounded-xl bg-indigo-600 px-5 font-bold text-white hover:bg-indigo-700"
            >
              {editingRecordId
                ? <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                : <Plus className="mr-2 h-4 w-4" aria-hidden="true" />}
              {editingRecordId ? "Editing achiever" : "Add achiever"}
            </Button>
          </div>
          {showAddRecord && (
            <form onSubmit={handleSaveRecord} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label htmlFor="achiever-record-name" className="mb-2 block text-sm font-bold text-slate-700">Student name</label>
                  <input id="achiever-record-name" value={newRecord.name} onChange={(event) => setNewRecord({ ...newRecord, name: event.target.value })} className={inputClassName} maxLength={200} required />
                </div>
                <div>
                  <label htmlFor="achiever-record-school" className="mb-2 block text-sm font-bold text-slate-700">School</label>
                  <input id="achiever-record-school" value={newRecord.school} onChange={(event) => setNewRecord({ ...newRecord, school: event.target.value })} className={inputClassName} maxLength={300} required />
                </div>
                <div>
                  <label htmlFor="achiever-record-year" className="mb-2 block text-sm font-bold text-slate-700">Year</label>
                  <select id="achiever-record-year" value={newRecord.year} onChange={(event) => setNewRecord({ ...newRecord, year: event.target.value })} className={inputClassName} required>
                    <option value="">Choose a year</option>
                    {YEARS.map((year) => <option key={year} value={year}>{year}-{String((Number(year) + 1) % 100).padStart(2, "0")}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="achiever-record-class" className="mb-2 block text-sm font-bold text-slate-700">Class</label>
                  <select id="achiever-record-class" value={newRecord.studentClass} onChange={(event) => setNewRecord({ ...newRecord, studentClass: event.target.value })} className={inputClassName} required>
                    <option value="">Choose a class</option>
                    {CLASSES.map((studentClass) => <option key={studentClass} value={studentClass}>Class {studentClass}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="achiever-record-rank" className="mb-2 block text-sm font-bold text-slate-700">Rank</label>
                  <input id="achiever-record-rank" type="number" min="1" step="1" value={newRecord.rank} onChange={(event) => setNewRecord({ ...newRecord, rank: event.target.value })} className={inputClassName} required />
                </div>
                <div>
                  <label htmlFor="achiever-record-photo" className="mb-2 block text-sm font-bold text-slate-700">Photo URL (optional)</label>
                  <input id="achiever-record-photo" type="url" value={newRecord.photo} onChange={(event) => setNewRecord({ ...newRecord, photo: event.target.value })} className={inputClassName} maxLength={1000} />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={addingRecord} className="h-11 rounded-xl bg-sky-600 px-5 font-bold text-white hover:bg-sky-700 disabled:opacity-60">
                  {addingRecord ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="mr-2 h-4 w-4" aria-hidden="true" />}
                  {addingRecord ? "Saving..." : editingRecordId ? "Update achiever" : "Save achiever"}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowAddRecord(false);
                  setEditingRecordId(null);
                }} disabled={addingRecord} className="h-11 rounded-xl">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </section>
      )}
      <AlertDialog
        open={Boolean(pendingDeleteRecord)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteRecord(null);
        }}
      >
        <AlertDialogContent className="rounded-2xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pendingDeleteRecord?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes this achiever record. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRecord}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete achiever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={Boolean(pendingDeleteExam)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteExam(null);
        }}
      >
        <AlertDialogContent
          className="rounded-2xl border-slate-200"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            deleteActionRef.current?.focus();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pendingDeleteExam?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes this exam and all achiever records added to it. Press Enter to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              ref={deleteActionRef}
              onClick={handleDeleteExam}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAchieversPage;
