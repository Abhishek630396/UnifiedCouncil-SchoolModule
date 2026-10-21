import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/services/apiBaseUrl";
import { CheckCircle2, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { states } from "@/options/states";
import { countries } from "@/options/countries";
import { PillSelector } from "@/components/PillSelector";
import { SectionCard } from "@/components/SectionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_OLYMPIADS = ["NSTSE", "UIEO", "UIMO", "UCO", "UIGKO"].map((id) => ({
  id,
  dates: [],
}));

const formatExamDateLabel = (dateRow) => {
  if (typeof dateRow === "string") {
    return dateRow;
  }

  if (dateRow?.label) {
    return dateRow.label;
  }

  if (!dateRow?.date) {
    return "";
  }

  const [year, month, day] = dateRow.date.split("-");
  return `${day}-${month}-${year} (${dateRow.day})-${dateRow.mode}`;
};

export const SchoolRegistrationForm = () => {
  const [selectedOlympiads, setSelectedOlympiads] = useState([]);
  const [openOlympiads, setOpenOlympiads] = useState([]);
  const [olympiads, setOlympiads] = useState(DEFAULT_OLYMPIADS);
  const [registeredSchool, setRegisteredSchool] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      schoolName: "",
      address: "",
      place: "",
      district: "",
      pinCode: "",
      phone: "",
      state: "Telangana",
      country: "India",
      email: "",
      principalName: "",
      mobile: "",
      examMode: ["Online"],
      regionalCoordinator: "",
      NSTSE: { examDate: "", teacherTitle: "Mr", teacherName: "", mobile: "", email: "" },
      UIEO: { examDate: "", teacherTitle: "Mr", teacherName: "", mobile: "", email: "" },
      UIMO: { examDate: "", teacherTitle: "Mr", teacherName: "", mobile: "", email: "" },
      UCO: { examDate: "", teacherTitle: "Mr", teacherName: "", mobile: "", email: "" },
      UIGKO: { examDate: "", teacherTitle: "Mr", teacherName: "", mobile: "", email: "" },
    },
  });

  const examMode = watch("examMode");

  useEffect(() => {
    let isMounted = true;

    async function loadExamDates() {
      try {
        const response = await axios.get(`${API_BASE_URL}/school-registration/exam-dates`);
        const loadedOlympiads = Array.isArray(response.data?.data)
          ? response.data.data.map((exam) => ({
              id: exam.examCode,
              dates:
                Array.isArray(exam.dates) && exam.dates.length > 0
                  ? exam.dates.map(formatExamDateLabel).filter(Boolean)
                  : [],
            }))
          : [];

        if (isMounted && loadedOlympiads.length > 0) {
          setOlympiads(
            DEFAULT_OLYMPIADS.map((exam) => loadedOlympiads.find((item) => item.id === exam.id) || exam)
          );
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadExamDates();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatTeacherName = (teacher = {}) =>
    teacher.teacherName ? [teacher.teacherTitle, teacher.teacherName.trim()].filter(Boolean).join(". ").trim() : "";

  const buildPayload = (data) => ({
    SchoolName: data.schoolName?.trim() || "",
    SchoolAddress: data.address?.trim() || "",
    Place: data.place?.trim() || "",
    District: data.district?.trim() || "",
    State: data.state || "",
    Pincode: data.pinCode?.trim() || "",
    SchoolContact: data.phone?.trim() || "",
    SchoolMail: data.email?.trim() || "",
    Schoolprinciname: data.principalName?.trim() || "",
    IsNSTSEselected: selectedOlympiads.includes("NSTSE"),
    NSTSEExamdate: data.NSTSE?.examDate || "",
    NSTSETeachername: formatTeacherName(data.NSTSE),
    NSTSETeachermobile: data.NSTSE?.mobile?.trim() || "",
    NSTSETeachemail: data.NSTSE?.email?.trim() || "",
    IsUIEOSelected: selectedOlympiads.includes("UIEO"),
    UIEOExamdate: data.UIEO?.examDate || "",
    UIEOTeachername: formatTeacherName(data.UIEO),
    UIEOTeacherMobile: data.UIEO?.mobile?.trim() || "",
    UIEOTeacherMail: data.UIEO?.email?.trim() || "",
    IsUIMOSelected: selectedOlympiads.includes("UIMO"),
    UIMOExamdate: data.UIMO?.examDate || "",
    UIMOTeachername: formatTeacherName(data.UIMO),
    UIMOTeacherMobile: data.UIMO?.mobile?.trim() || "",
    UIMOTeacherMail: data.UIMO?.email?.trim() || "",
    UCOExamdate: data.UCO?.examDate || "",
    IsUCOSelected: selectedOlympiads.includes("UCO"),
    UCOTeacherName: formatTeacherName(data.UCO),
    UCOTeacherMobile: data.UCO?.mobile?.trim() || "",
    UCOTeacherMail: data.UCO?.email?.trim() || "",
    Syllabus: "",
    Regionalconame: data.regionalCoordinator?.trim() || "",
    PrinciContact: data.mobile?.trim() || "",
    Coor: data.regionalCoordinator?.trim() || "",
    Country: data.country || "",
    Exam_Mode: data.examMode.join(", "),
    UIGKOExamdate: data.UIGKO?.examDate || "",
    IsUIGKOSelected: selectedOlympiads.includes("UIGKO"),
    UIGKOTeacherName: formatTeacherName(data.UIGKO),
    UIGKOTeacherMobile: data.UIGKO?.mobile?.trim() || "",
    UIGKOTeacherMail: data.UIGKO?.email?.trim() || "",
  });

  const onSubmit = async (data) => {
    if (!data.examMode?.length) {
      toast.error("Please select at least one exam mode");
      return;
    }

    if (selectedOlympiads.length === 0) {
      toast.error("Please select at least one Olympiad");
      return;
    }

    const payload = buildPayload(data);

    try {
      const response = await axios.post(`${API_BASE_URL}/school-registration`, payload);
      const registrationId = response.data?.data?.regNo;
      if (!registrationId) {
        throw new Error("Registration was saved, but no School Registration ID was returned. Please contact support before submitting again.");
      }
      const initialPassword = response.data?.data?.initialPassword;
      if (!/^\d{4}$/.test(String(initialPassword || ""))) {
        throw new Error("Registration was saved, but the initial password was not returned. Please contact support before submitting again.");
      }
      setRegisteredSchool({ registrationId, schoolName: payload.SchoolName, initialPassword });
      toast.success("School registration completed");
    } catch (err) {
      console.error("School registration failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || err.message || "Unable to save school registration");
    }
  };

  const toggleOlympiad = (id, checked) => {
    setSelectedOlympiads((prev) => (checked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((item) => item !== id)));
    setOpenOlympiads((prev) => (checked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((item) => item !== id)));
  };

  if (registeredSchool) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
        <section className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-10" aria-labelledby="registration-success-heading">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-wide text-emerald-700">Registration complete</p>
          <h2 id="registration-success-heading" className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Your school is registered</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{registeredSchool.schoolName} has been saved. Keep this School Registration ID for future reference.</p>

          <div className="mt-6 rounded-lg border border-sky-200 bg-sky-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-sky-800">Your School Registration ID</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="select-all break-all font-mono text-2xl font-black text-slate-950" aria-label="Your School Registration ID">{registeredSchool.registrationId}</p>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(registeredSchool.registrationId);
                    setCopyStatus("ID copied");
                  } catch (_error) {
                    setCopyStatus("Select the ID above and copy it");
                  }
                }}
                className="shrink-0 border-sky-300 bg-white"
              >
                <Copy className="h-4 w-4" /> Copy ID
              </Button>
            </div>
            {copyStatus && <p role="status" className="mt-2 text-sm text-sky-800">{copyStatus}</p>}
          </div>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-900">Initial School Dashboard Password</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="select-all font-mono text-2xl font-black tracking-[0.2em] text-slate-950" aria-label="Initial school dashboard password">{registeredSchool.initialPassword}</p>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(registeredSchool.initialPassword);
                    setCopyStatus("Password copied");
                  } catch (_error) {
                    setCopyStatus("Select the password above and copy it");
                  }
                }}
                className="shrink-0 border-amber-300 bg-white"
              >
                <Copy className="h-4 w-4" /> Copy password
              </Button>
            </div>
          </div>

          <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>Use this School Registration ID when contacting Unified Council about your school registration.</li>
            <li>Use the School Registration ID and this password to sign in to the School Dashboard. Keep the password private.</li>
          </ol>

          <Button asChild className="mt-7 w-full bg-sky-600 font-semibold text-white hover:bg-sky-700 sm:w-auto">
            <Link to="/school-dashboard/login">Go to School Dashboard</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <div className="bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-6xl space-y-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8"
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">School Registration</p>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Register your school for the upcoming Olympiads</h2>
          <p className="text-sm text-slate-600 sm:text-base">Fill in your school details and choose the Olympiads you would like to participate in.</p>
        </div>

        <SectionCard title="School Details" description="Basic information about the institution and contact person.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>School&apos;s Name *</Label>
              <Input placeholder="Enter school name" {...register("schoolName", { required: "School name is required" })} />
              <p className="text-sm text-red-500">{errors.schoolName?.message}</p>
            </div>

            <div className="md:col-span-2">
              <Label>School&apos;s Address</Label>
              <Textarea placeholder="Write school address here..." {...register("address")} />
            </div>

            <div>
              <Label>Place *</Label>
              <Input placeholder="Enter place name" {...register("place", { required: "Place is required" })} />
              <p className="text-sm text-red-500">{errors.place?.message}</p>
            </div>

            <div>
              <Label>District *</Label>
              <Input placeholder="Enter district name" {...register("district", { required: "District is required" })} />
              <p className="text-sm text-red-500">{errors.district?.message}</p>
            </div>

            <div>
              <Label>Pin Code</Label>
              <Input placeholder="Enter pincode number" {...register("pinCode")} />
            </div>

            <div>
              <Label>School Phone Number(s)</Label>
              <Input placeholder="Enter school phone number" {...register("phone")} />
            </div>

            <div>
              <Label>State</Label>
              <Select value={watch("state") || ""} onValueChange={(value) => setValue("state", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Country</Label>
              <Select value={watch("country") || ""} onValueChange={(value) => setValue("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>E-mail *</Label>
              <Input type="email" placeholder="Enter email address" {...register("email", { required: "School email is required for dashboard access" })} />
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>

            <div>
              <Label>Name of the Principal</Label>
              <Input placeholder="Enter principal name" {...register("principalName")} />
            </div>

            <div>
              <Label>Mobile Number *</Label>
              <Input placeholder="Enter mobile number" {...register("mobile", { required: "Mobile number is required" })} />
              <p className="text-sm text-red-500">{errors.mobile?.message}</p>
            </div>

            <div>
              <Label>Exam Mode *</Label>
              <div className="mt-2 flex flex-wrap gap-4">
                {["Online", "Offline"].map((mode) => (
                  <label key={mode} htmlFor={`exam-mode-${mode.toLowerCase()}`} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                    <Checkbox
                      id={`exam-mode-${mode.toLowerCase()}`}
                      checked={examMode.includes(mode)}
                      onCheckedChange={(checked) => {
                        if (!checked && examMode.length === 1 && examMode.includes(mode)) {
                          toast.error("Select at least one exam mode");
                          return;
                        }
                        const nextModes = checked
                          ? [...new Set([...examMode, mode])]
                          : examMode.filter((selectedMode) => selectedMode !== mode);
                        setValue("examMode", nextModes, { shouldValidate: true });
                      }}
                    />
                    {mode}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Choose Olympiads" description="Select the Olympiads and specify the preferred exam date and teacher-in-charge details.">
          <Accordion type="multiple" value={openOlympiads} onValueChange={setOpenOlympiads} className="space-y-3">
            {olympiads.map((item) => {
              const isSelected = selectedOlympiads.includes(item.id);

              return (
                <AccordionItem key={item.id} value={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
                    <Label className="flex flex-1 items-center gap-3 text-base font-semibold text-slate-900">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => toggleOlympiad(item.id, Boolean(checked))}
                      />
                      {item.id}
                    </Label>
                    <AccordionTrigger className="w-auto justify-end rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:no-underline">
                      {/* {isSelected ? "Add details" : "View details"} */}
                    </AccordionTrigger>
                  </div>

                  <AccordionContent className="space-y-6 border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Exam Date</Label>
                      {item.dates.length > 0 ? (
                        <PillSelector
                          name={`${item.id}-examDate`}
                          value={watch(`${item.id}.examDate`) || ""}
                          onChange={(value) => setValue(`${item.id}.examDate`, value, { shouldValidate: true })}
                          options={item.dates.map((date) => ({ value: date, label: date }))}
                        />
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                          No exam dates configured yet.
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-semibold">Teacher-in-Charge</Label>
                      <div className="space-y-3">

                        <PillSelector
                          name={`${item.id}-teacherTitle`}
                          value={watch(`${item.id}.teacherTitle`) || "Mr"}
                          onChange={(value) => setValue(`${item.id}.teacherTitle`, value)}
                          options={[{ value: "Mr", label: "Mr." }, { value: "Ms", label: "Ms." }]}
                        />
                        <div className="grid gap-3 md:grid-cols-3">
                          <Input placeholder="Enter teacher name" {...register(`${item.id}.teacherName`)} />
                          <Input placeholder="Enter mobile number" {...register(`${item.id}.mobile`)} />
                          <Input type="email" placeholder="Enter email address" {...register(`${item.id}.email`)} />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </SectionCard>

        <SectionCard title="Coordinator Details" description="Optional coordinator reference information.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Unified Council Regional Coordinator&apos;s ID No. &amp; Name</Label>
              <Input placeholder="Enter coordinator details" {...register("regionalCoordinator")} />
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </Button>
        </div>
      </form>
    </div>
  );
};
