import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, GraduationCap, Users } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const metricCards = [
  { key: "totalStudents", label: "Total Students Registered", icon: Users, tone: "sky" },
  { key: "activeRegistrations", label: "Active Registrations", icon: GraduationCap, tone: "blue" },
  { key: "completedRegistrations", label: "Completed Registrations", icon: CheckCircle2, tone: "green" },
  { key: "pendingRegistrations", label: "Pending Registrations", icon: Clock3, tone: "amber" },
];

const toneClasses = {
  sky: "bg-sky-50 text-sky-700",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
};

const display = (value) => value === null || value === undefined || value === "" ? "—" : value;
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const SchoolDetail = ({ label, value }) => (
  <div className="min-w-0 bg-white p-4">
    <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
    <p className="mt-1 break-words text-sm font-semibold text-slate-900">{display(value)}</p>
  </div>
);

const SchoolDashboardOverview = () => {
  const { school, statistics, recentStudents, refreshOverview } = useOutletContext();
  const [selectedYear, setSelectedYear] = useState(() => statistics?.year || new Date().getFullYear());
  const [isChangingYear, setIsChangingYear] = useState(false);
  const [yearError, setYearError] = useState("");

  const handleYearChange = async (event) => {
    const year = Number(event.target.value);
    const previousYear = selectedYear;
    setSelectedYear(year);
    setIsChangingYear(true);
    setYearError("");
    try {
      await refreshOverview(year);
    } catch (error) {
      setSelectedYear(previousYear);
      setYearError(error.response?.data?.message || "Unable to load registrations for that year.");
    } finally {
      setIsChangingYear(false);
    }
  };

  const availableYears = statistics?.availableYears?.length
    ? statistics.availableYears
    : [new Date().getFullYear()];

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-slate-950 px-5 py-6 text-white sm:px-8 sm:py-8">
        <p className="text-sm font-semibold text-sky-300">School Dashboard</p>
        <h1 className="mt-2 break-words text-2xl font-black sm:text-3xl">Welcome back, {school?.schoolName || "School administrator"}</h1>
        <p className="mt-2 text-sm text-slate-300">School Registration ID: <span className="font-bold text-white">{school?.registrationId || "—"}</span></p>
      </section>

      <section aria-label="Registration overview" aria-busy={isChangingYear} className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">Registration overview</h2>
          <div className="flex items-center gap-2 sm:ml-auto">
            <label htmlFor="registration-year" className="text-sm font-medium text-slate-600">Year</label>
            <select
              id="registration-year"
              value={selectedYear}
              onChange={handleYearChange}
              disabled={isChangingYear}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-wait disabled:opacity-60"
            >
              {availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>
        {yearError && <p role="alert" className="text-sm text-red-700">{yearError}</p>}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map(({ key, label, icon: Icon, tone }) => (
            <Card key={key} className="rounded-xl border-slate-200 shadow-sm">
              <CardContent className="flex min-h-32 items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-5 text-slate-600">{label}</p>
                  <p className="mt-2 text-3xl font-black tabular-nums text-slate-950">{Number(statistics?.[key] || 0).toLocaleString("en-IN")}</p>
                </div>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}><Icon className="h-5 w-5" /></span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="school-details-heading">
        <div>
          <h2 id="school-details-heading" className="text-lg font-bold text-slate-900">School Details</h2>
          <p className="mt-1 text-sm text-slate-600">Registration information currently stored for your school.</p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          <SchoolDetail label="USRN No" value={school?.schoolId} />
          <SchoolDetail label="REGNO" value={school?.registrationId} />
          <SchoolDetail label="School name" value={school?.schoolName} />
          <SchoolDetail label="Principal / contact name" value={school?.principalName} />
          <SchoolDetail label="School email" value={school?.email} />
          <SchoolDetail label="School contact" value={school?.schoolContact} />
          <SchoolDetail label="Principal contact" value={school?.principalContact} />
          <SchoolDetail label="Exam mode" value={school?.examMode} />
          <SchoolDetail label="Syllabus" value={school?.syllabus} />
          <SchoolDetail label="City / place" value={school?.city} />
          <SchoolDetail label="District" value={school?.district} />
          <SchoolDetail label="State" value={school?.state} />
          <SchoolDetail label="Country" value={school?.country} />
          <SchoolDetail label="Pincode" value={school?.pincode} />
          <SchoolDetail label="Address" value={school?.address} />
          <SchoolDetail label="Regional coordinator" value={school?.regionalCoordinator} />
          <SchoolDetail label="Coordinator" value={school?.coordinator} />
          <SchoolDetail label="Last updated" value={formatDate(school?.updatedAt)} />
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="olympiad-details-heading">
        <div>
          <h2 id="olympiad-details-heading" className="text-lg font-bold text-slate-900">Olympiad Details</h2>
          <p className="mt-1 text-sm text-slate-600">Selection, exam date, and teacher contact information from your school record.</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-600">
              <tr><th className="px-4 py-3">Olympiad</th><th className="px-4 py-3">Selection</th><th className="px-4 py-3">Exam date</th><th className="px-4 py-3">Teacher and contact</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(school?.olympiads || []).map((exam) => (
                <tr key={exam.code}>
                  <td className="px-4 py-3 font-bold text-slate-900">{exam.code}</td>
                  <td className="px-4 py-3">{exam.selected ? "Selected" : "Not selected"}</td>
                  <td className="px-4 py-3">{display(exam.examDate)}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{display(exam.teacherName)}</p>
                    <p className="mt-1 text-xs text-slate-600">{display(exam.teacherMobile)} · {display(exam.teacherEmail)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="recent-students-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="recent-students-heading" className="text-lg font-bold text-slate-900">Recent Student Registrations</h2>
            <p className="mt-1 text-sm text-slate-600">Latest records associated with this school.</p>
          </div>
          <Button asChild className="shrink-0 bg-sky-600 font-semibold text-white hover:bg-sky-700">
            <Link to="/school-dashboard/students">View all registrations <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-600">
              <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Registration ID</th><th className="px-4 py-3">Class / section</th><th className="px-4 py-3">Olympiad</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentStudents.length ? recentStudents.map((student) => (
                <tr key={student.StudentId}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{display(student.SNAME)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{display(student.transid)}</td>
                  <td className="px-4 py-3">{display(student.Class)} / {display(student.Section)}</td>
                  <td className="px-4 py-3">{display(student.Separatepackages)}</td>
                  <td className="px-4 py-3">{formatDate(student.transdate)}</td>
                  <td className="px-4 py-3">{display(student.STATUS)}</td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-600">No student registrations are stored for this school yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SchoolDashboardOverview;
