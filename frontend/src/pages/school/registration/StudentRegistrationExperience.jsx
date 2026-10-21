import { useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  GraduationCap,
  IndianRupee,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SchoolHeader from "../components/SchoolHeader";
import SchoolDatabaseDetails from "../components/SchoolDatabaseDetails";
import API_BASE_URL from "@/services/apiBaseUrl";

const EXAMS = [
  { code: "NSTSE", name: "National Level Science Talent Search Examination", selected: "isNSTSESelected", date: "nstseExamDate", color: "violet" },
  { code: "UIMO", name: "Unified International Mathematics Olympiad", selected: "isUIMOSelected", date: "uimoExamDate", color: "blue" },
  { code: "UIEO", name: "Unified International English Olympiad", selected: "isUIEOSelected", date: "uieoExamDate", color: "amber" },
  { code: "UCO", name: "Unified International Cyber Olympiad", selected: "isUCOSelected", date: "ucoExamDate", color: "cyan" },
  { code: "UIGKO", name: "Unified International General Knowledge Olympiad", selected: "isUIGKOSelected", date: "uigkoExamDate", color: "emerald" },
];

const OPTION_TEXT = {
  1: "Exam fee",
  2: "Exam fee + previous question papers and revision material (E-Book)",
  3: "Option 2 features + online chapter-wise tests and previous question papers",
};

const EMPTY_STUDENT = {
  className: "",
  section: "",
  studentName: "",
};

const colorClasses = {
  violet: "bg-violet-100 text-violet-700 ring-violet-200",
  blue: "bg-blue-100 text-blue-700 ring-blue-200",
  amber: "bg-amber-100 text-amber-700 ring-amber-200",
  cyan: "bg-cyan-100 text-cyan-700 ring-cyan-200",
  emerald: "bg-emerald-100 text-emerald-700 ring-emerald-200",
};

const Field = ({ id, label, required = true, hint, className = "", children }) => (
  <div className={className}>
    <Label htmlFor={id} className="text-sm font-semibold text-slate-700">
      {label}{required && <span className="ml-1 text-rose-500" aria-hidden="true">*</span>}
    </Label>
    {children}
    {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
  </div>
);

const StudentRegistrationExperience = () => {
  const [schoolId, setSchoolId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [verifiedStudentId, setVerifiedStudentId] = useState("");
  const [school, setSchool] = useState(null);
  const [prices, setPrices] = useState([]);
  const [selections, setSelections] = useState({});
  const [student, setStudent] = useState(EMPTY_STUDENT);
  const [isSearching, setIsSearching] = useState(false);
  const [isVerifyingStudent, setIsVerifyingStudent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registration, setRegistration] = useState(null);

  const clearSchool = () => {
    setSchool(null);
    setStudentId("");
    setVerifiedStudentId("");
    setStudent(EMPTY_STUDENT);
    setPrices([]);
    setSelections({});
    setRegistration(null);
  };

  const findSchool = async (event) => {
    event.preventDefault();
    clearSchool();
    const normalizedId = schoolId.trim();
    if (!/^(?:\d+|[A-Z0-9][A-Z0-9-]{2,48}[A-Z0-9])$/.test(normalizedId.toUpperCase())) {
      toast.error("Enter the School ID or School Registration ID given to you by your school.");
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/school-registration/${encodeURIComponent(normalizedId)}`);
      const foundSchool = response.data?.data?.school;
      if (!foundSchool) {
        toast.error("We couldn't find a school with that ID. Check it and try again.");
        return;
      }
      setSchool(foundSchool);
      setPrices(Array.isArray(response.data?.data?.prices) ? response.data.data.prices : []);
      toast.success("School verified. You can continue your registration.");
    } catch (error) {
      const message = error.response?.data?.message ||
        (error.response?.status >= 500
          ? "The school lookup service is temporarily unavailable. Please try again shortly."
          : !error.response
            ? "Unable to connect to the school lookup service. Check your connection and try again."
            : "Unable to find this school. Please try again.");
      toast.error(message);
    } finally {
      setIsSearching(false);
    }
  };

  const availableExams = school ? EXAMS.filter((exam) => Boolean(school[exam.selected])) : [];
  const selectedCount = Object.keys(selections).length;
  const getOptions = (examCode) => prices.filter((row) => row.examCode === examCode);

  const verifyStudent = async (event) => {
    event.preventDefault();
    setVerifiedStudentId("");
    setStudent(EMPTY_STUDENT);
    const normalizedId = studentId.trim();
    if (!school || !/^\d{1,19}$/.test(normalizedId) || /^0+$/.test(normalizedId)) {
      toast.error("Enter a valid Student ID.");
      return;
    }

    setIsVerifyingStudent(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/student-registration-through-school/${school.schoolId}/validate-student/${encodeURIComponent(normalizedId)}`
      );
      const verifiedStudent = response.data?.data || EMPTY_STUDENT;
      setStudent(verifiedStudent);
      setVerifiedStudentId(verifiedStudent.studentId || normalizedId);
      toast.success("Student ID verified.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to verify this Student ID.");
    } finally {
      setIsVerifyingStudent(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!school) {
      toast.error("Verify your school before submitting.");
      return;
    }
    if (!verifiedStudentId) {
      toast.error("Verify a valid Student ID before continuing.");
      return;
    }
    if (selectedCount === 0) {
      toast.error("Choose at least one Olympiad option.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/student-registration-through-school/${school.schoolId}`, {
        studentId: verifiedStudentId,
        selections,
      });
      setRegistration(response.data?.data || {});
      toast.success("Your registration has been submitted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save your registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startAnotherRegistration = () => {
    setStudent(EMPTY_STUDENT);
    setStudentId("");
    setVerifiedStudentId("");
    setSelections({});
    setRegistration(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] text-slate-900">
      <SchoolHeader />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pt-9 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-700 px-6 py-8 text-white shadow-xl shadow-blue-950/10 sm:px-10 sm:py-11">
          <div className="absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 -z-10 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
                <Sparkles className="h-3.5 w-3.5" /> Student Olympiad registration
              </span>
              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Big ideas start with <span className="text-cyan-200">one challenge.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Sign up for your school’s Olympiads in a few easy steps. Verify your school, tell us about yourself, and choose your exam.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-blue-50">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-200" /> Secure registration</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-200" /> School verified</span>
              </div>
            </div>
            <div className="hidden h-36 w-36 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 shadow-inner md:flex">
              <GraduationCap className="h-20 w-20 text-cyan-100" strokeWidth={1.3} />
            </div>
          </div>
        </section>

        {registration ? (
          <section className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl border border-emerald-200 bg-white text-center shadow-lg shadow-emerald-950/5">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-8 text-white sm:py-10">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20"><Check className="h-9 w-9" /></span>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-emerald-50">You’re all set</p>
              <h2 className="mt-2 text-3xl font-black">Registration submitted!</h2>
              <p className="mt-2 text-sm text-emerald-50">Nice work, {student.studentName}. Your school has received your registration.</p>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-sm text-slate-600">Keep this confirmation code for your records</p>
              <p className="mt-2 inline-flex rounded-xl bg-slate-100 px-4 py-2 font-mono text-lg font-black tracking-wide text-slate-900">
                {registration.registrationCode || registration.registrationId || "Registration received"}
              </p>
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-left">
                <p className="font-bold text-blue-950">{school?.schoolName}</p>
                <p className="mt-1 text-sm text-blue-800">Your entry will appear in your school’s recent student registrations.</p>
              </div>
              <Button type="button" onClick={startAnotherRegistration} className="mt-6 h-11 rounded-xl bg-indigo-700 px-5 font-bold text-white hover:bg-indigo-800">
                Register another student <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        ) : (
          <>
            <div className="mx-auto mt-7 grid max-w-5xl grid-cols-3 gap-2 sm:gap-4" aria-label="Registration steps">
              {[["01", "Your school"], ["02", "Your details"], ["03", "Choose exams"]].map(([number, label], index) => (
                <div key={number} className="flex items-center gap-2 rounded-xl border border-white bg-white/80 p-3 shadow-sm sm:gap-3 sm:p-4">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${index === 0 && !school ? "bg-indigo-700 text-white" : school && index === 0 ? "bg-emerald-100 text-emerald-700" : "bg-indigo-50 text-indigo-700"}`}>
                    {school && index === 0 ? <Check className="h-4 w-4" /> : number}
                  </span>
                  <span className="text-xs font-bold text-slate-700 sm:text-sm">{label}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-5xl space-y-5">
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><Search className="h-5 w-5" /></span>
                    <div>
                      <h2 className="text-lg font-black">Find your school</h2>
                      <p className="mt-0.5 text-sm text-slate-500">Enter your School ID or School Registration ID.</p>
                    </div>
                  </div>
                  {school && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Verified</span>}
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:px-7 sm:py-6">
                  <Field id="experience-school-id" label="School ID or Registration ID" hint="Enter the ID your school shared, such as ZPHS123.">
                    <Input
                      id="experience-school-id"
                      inputMode="text"
                      autoCapitalize="characters"
                      autoComplete="off"
                      value={schoolId}
                      onChange={(event) => {
                        setSchoolId(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 50));
                        clearSchool();
                      }}
                      placeholder="For example, ZPHS123"
                      className="mt-1.5 h-12 rounded-xl border-slate-300 text-base"
                      required
                    />
                  </Field>
                  <Button type="button" onClick={findSchool} disabled={isSearching || !schoolId} className="h-12 w-full rounded-xl bg-indigo-700 px-5 font-bold text-white shadow-sm transition hover:bg-indigo-800 hover:shadow-md sm:mt-[1.625rem] sm:w-48">
                    {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    {isSearching ? "Finding school…" : school ? "Verify another school" : "Find my school"}
                  </Button>
                </div>
                {school && (
                  <div className="mx-5 mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:mx-7 sm:mb-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700"><GraduationCap className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="break-words font-black text-emerald-950">{school.schoolName}</p>
                      <p className="mt-1 flex items-start gap-1.5 text-sm text-emerald-800"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{[school.schoolAddress, school.place, school.district, school.state, school.country].filter(Boolean).join(", ")}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                        <span className="rounded-lg bg-white px-2.5 py-1.5 text-emerald-900">School ID: {school.schoolId}</span>
                        {school.regNo && <span className="rounded-lg bg-white px-2.5 py-1.5 text-emerald-900">USRN: {school.regNo}</span>}
                        {school.examMode && <span className="rounded-lg bg-white px-2.5 py-1.5 text-emerald-900">Mode: {school.examMode}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {school && <SchoolDatabaseDetails school={school} />}

              {school && (
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                  <Field id="experience-student-id" label="Student ID" hint="Enter the ID from your existing school registration.">
                    <Input
                      id="experience-student-id"
                      inputMode="numeric"
                      autoComplete="off"
                      value={studentId}
                      onChange={(event) => {
                        setStudentId(event.target.value.replace(/\D/g, "").slice(0, 19));
                        setVerifiedStudentId("");
                        setStudent(EMPTY_STUDENT);
                        setSelections({});
                      }}
                      placeholder="Enter your existing Student ID"
                      className="mt-1.5 h-12 rounded-xl border-slate-300"
                    />
                  </Field>
                  <Button type="button" onClick={verifyStudent} disabled={isVerifyingStudent || !studentId} className="mt-4 h-11 rounded-xl bg-indigo-700 px-5 font-bold text-white hover:bg-indigo-800">
                    {isVerifyingStudent && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isVerifyingStudent ? "Verifying student..." : "Verify Student ID"}
                  </Button>
                </section>
              )}

              {school && verifiedStudentId && (
                <>
                  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700"><UserRound className="h-5 w-5" /></span>
                      <div><h2 className="text-lg font-black">Your existing details</h2><p className="mt-0.5 text-sm text-slate-500">These details are loaded from your current database record.</p></div>
                    </div>

                    <div className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2">
                      <Field id="experience-class" label="Class">
                        <Input id="experience-class" value={student.className} readOnly className="mt-1.5 h-12 rounded-xl border-slate-300 bg-slate-50" />
                      </Field>
                      <Field id="experience-section" label="Section" required={false}>
                        <Input id="experience-section" value={student.section} readOnly className="mt-1.5 h-12 rounded-xl border-slate-300 bg-slate-50" />
                      </Field>
                      <Field id="experience-student-name" label="Student’s full name">
                        <Input id="experience-student-name" value={student.studentName} readOnly className="mt-1.5 h-12 rounded-xl border-slate-300 bg-slate-50" />
                      </Field>
                      <Field id="experience-confirmed-student-id" label="Verified Student ID">
                        <Input id="experience-confirmed-student-id" value={verifiedStudentId} readOnly className="mt-1.5 h-12 rounded-xl border-slate-300 bg-slate-50" />
                      </Field>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><BookOpen className="h-5 w-5" /></span>
                        <div><h2 className="text-lg font-black">Choose your Olympiad</h2><p className="mt-0.5 text-sm text-slate-500">Pick an option for each exam you want to take.</p></div>
                      </div>
                      <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">{selectedCount} selected</span>
                    </div>

                    {availableExams.length === 0 ? (
                      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        Your school has not selected any Olympiads yet. Please contact your school before continuing.
                      </div>
                    ) : (
                      <div className="mt-5 grid gap-4">
                        {availableExams.map((exam) => (
                          <article key={exam.code} className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                            <div className="flex items-start gap-3">
                              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${colorClasses[exam.color]}`}><BookOpen className="h-5 w-5" /></span>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div><h3 className="font-black text-slate-900">{exam.code}</h3><p className="mt-0.5 text-xs leading-5 text-slate-500">{exam.name}</p></div>
                                  {school[exam.date] && <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">Exam: {school[exam.date]}</span>}
                                </div>
                                <div className="mt-4 grid gap-2 md:grid-cols-3">
                                  {getOptions(exam.code).map((option) => {
                                    const selected = selections[exam.code] === option.optionId;
                                    return (
                                      <label key={option.optionId} className={`cursor-pointer rounded-xl border p-3 transition ${selected ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100" : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"}`}>
                                        <span className="flex items-center justify-between gap-2">
                                          <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                            <input type="radio" name={`experience-${exam.code}`} checked={selected} onChange={() => setSelections((current) => ({ ...current, [exam.code]: option.optionId }))} className="h-4 w-4 accent-indigo-700" />
                                            Option {option.optionId}
                                          </span>
                                          <span className="flex items-center text-sm font-black text-slate-900"><IndianRupee className="h-3.5 w-3.5" />{option.discountedPrice}</span>
                                        </span>
                                        <span className="mt-2 block text-xs leading-5 text-slate-600">{OPTION_TEXT[option.optionId]}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>

                  <div className="flex flex-col gap-3 rounded-3xl bg-indigo-950 p-5 text-white shadow-lg shadow-indigo-950/10 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                    <div>
                      <p className="font-bold">Ready to take on a challenge?</p>
                      <p className="mt-1 text-sm text-indigo-200">Your school can view your submission in its recent student registrations.</p>
                    </div>
                    <Button type="submit" disabled={isSubmitting || availableExams.length === 0} className="h-12 rounded-xl bg-cyan-300 px-6 font-black text-indigo-950 hover:bg-cyan-200">
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {isSubmitting ? "Submitting…" : "Submit registration"}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default StudentRegistrationExperience;
