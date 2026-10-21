import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronRight,
  ChevronUp,
  Clock3,
  CreditCard,
  GraduationCap,
  IndianRupee,
  Loader2,
  Percent,
  Search,
  ShoppingCart,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SchoolHeader from "../components/SchoolHeader";
import SchoolDatabaseDetails from "../components/SchoolDatabaseDetails";
import API_BASE_URL from "@/services/apiBaseUrl";
import { submitCcaVenueForm } from "@/utils/ccaVenuePayment";
import {
  openRazorpayCheckout,
  verifyOrReconcileSchoolPayment,
} from "@/utils/razorpayCheckout";
const EXAMS = [
  { code: "NSTSE", name: "National Level Science Talent Search Examination", selected: "isNSTSESelected" },
  { code: "UIMO", name: "Unified International Mathematics Olympiad", selected: "isUIMOSelected" },
  { code: "UIEO", name: "Unified International English Olympiad", selected: "isUIEOSelected" },
  { code: "UCO", name: "Unified International Cyber Olympiad", selected: "isUCOSelected" },
  { code: "UIGKO", name: "Unified International General Knowledge Olympiad", selected: "isUIGKOSelected" },
];
const GST_PERCENT = 18;
const COMBO_EXAMS = ["NSTSE", "UIMO", "UIEO", "UCO"];
const COMBO_DISCOUNT_BY_OPTION = {
  1: 0.07,
  2: 0.1,
  3: 0.15,
};
const INDIAN_STATES_AND_UTS = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
const EMPTY_STUDENT = {
  studentName: "",
  className: "",
  section: "",
  parentName: "",
  mobile: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

function roundCurrency(value) {
  return Number(Number(value || 0).toFixed(2));
}

function formatCurrency(value) {
  return roundCurrency(value).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function navigateToPaymentResult(registrationCode, outcome, transactionIdOrError, orderId) {
  const query = new URLSearchParams({
    registrationCode,
    payment: outcome,
    ...(outcome === "success" ? { transactionId: transactionIdOrError } : {}),
    ...(outcome !== "success" ? { error: transactionIdOrError } : {}),
    ...(orderId ? { razorpayOrderId: orderId } : {}),
  });
  window.location.assign(
    `/student-registration-through-school/payment/${outcome === "success" ? "success" : "failed"}?${query.toString()}`
  );
}

const StudentRegistrationThroughtSchool = () => {
  const [schoolId, setSchoolId] = useState("");
  const [school, setSchool] = useState(null);
  const [prices, setPrices] = useState([]);
  const [examDates, setExamDates] = useState([]);
  const [selections, setSelections] = useState({});
  const [student, setStudent] = useState(EMPTY_STUDENT);
  const [registration, setRegistration] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [lastComboPromptKey, setLastComboPromptKey] = useState("");

  const clearSchool = () => {
    setSchool(null);
    setStudent(EMPTY_STUDENT);
    setPrices([]);
    setExamDates([]);
    setSelections({});
    setRegistration(null);
    setPaymentError("");
    setIsCartOpen(false);
    setActiveModal(null);
    setLastComboPromptKey("");
  };

  const findSchool = async (event) => {
    event.preventDefault();
    clearSchool();
    const normalizedId = schoolId.trim().toUpperCase();
    if (!/^(?:\d+|[A-Z0-9][A-Z0-9-]{2,48}[A-Z0-9])$/.test(normalizedId)) {
      return toast.error("Enter your numeric School ID or the School Registration ID provided by your school.");
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
      setExamDates(Array.isArray(response.data?.data?.examDates) ? response.data.data.examDates : []);
      setActiveModal("offer");
      toast.success("School details found");
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message ||
        (status >= 500
          ? `The school lookup server is unavailable (HTTP ${status}). Please try again later or contact support.`
          : status === 404
            ? "This School ID was not found. Confirm the ID in Admin > Registered Schools and try again."
            : !error.response
              ? "Unable to connect to the school lookup service. Check your connection and try again."
              : "Unable to find school details. Please verify the School ID and try again.");
      toast.error(message);
    } finally { setIsSearching(false); }
  };

  const availableExams = school ? EXAMS.filter((exam) => Boolean(school[exam.selected])) : [];
  const getOptions = (examCode) => prices.filter((row) => row.examCode === examCode);
  const comboOptionId = Number(selections[COMBO_EXAMS[0]] || 0);
  const qualifiesForCombo = Boolean(
    COMBO_DISCOUNT_BY_OPTION[comboOptionId] &&
    COMBO_EXAMS.every((examCode) => Number(selections[examCode]) === comboOptionId)
  );
  const comboDiscountRate = qualifiesForCombo ? COMBO_DISCOUNT_BY_OPTION[comboOptionId] : 0;
  const selectedItems = EXAMS.flatMap((exam) => {
    const optionId = selections[exam.code];
    if (optionId === undefined) return [];
    const option = optionId === null
      ? null
      : getOptions(exam.code).find((row) => row.optionId === Number(optionId));
    const price = Number(option?.discountedPrice || 0);
    const mrp = Number(option?.mrp || price);
    const comboDiscount = COMBO_EXAMS.includes(exam.code)
      ? roundCurrency(price * comboDiscountRate)
      : 0;
    const taxablePrice = roundCurrency(price - comboDiscount);
    const gst = roundCurrency((taxablePrice * GST_PERCENT) / 100);
    return [{
      examCode: exam.code,
      examName: exam.name,
      optionId,
      option,
      price,
      comboDiscount,
      taxablePrice,
      savings: roundCurrency(Math.max(mrp - price, 0)),
      gst,
      total: roundCurrency(taxablePrice + gst),
    }];
  });
  const selectedCount = selectedItems.length;
  const comboDiscountTotal = roundCurrency(selectedItems.reduce((sum, item) => sum + item.comboDiscount, 0));
  const subtotal = roundCurrency(selectedItems.reduce((sum, item) => sum + item.taxablePrice, 0));
  const totalSavings = roundCurrency(selectedItems.reduce((sum, item) => sum + item.savings, 0) + comboDiscountTotal);
  const totalGst = roundCurrency(selectedItems.reduce((sum, item) => sum + item.gst, 0));
  const amountToPay = roundCurrency(subtotal + totalGst);
  const isTelangana = student.state.trim().toLowerCase() === "telangana";
  const isOtherState = student.state.startsWith("Others - ");
  const selectedState = isOtherState ? "Others" : student.state;

  useEffect(() => {
    if (!qualifiesForCombo) {
      setLastComboPromptKey("");
      setActiveModal((current) => current === "combo" ? null : current);
      return;
    }

    const promptKey = `${comboOptionId}:${comboDiscountTotal}`;
    if (promptKey !== lastComboPromptKey) {
      setLastComboPromptKey(promptKey);
      setActiveModal("combo");
    }
  }, [comboDiscountTotal, comboOptionId, lastComboPromptKey, qualifiesForCombo]);

  const removeSelection = (examCode) => {
    setSelections((current) => {
      const next = { ...current };
      delete next[examCode];
      return next;
    });
    if (selectedCount <= 1) setIsCartOpen(false);
  };

  const registerButton = (className = "", label = "Register student") => (
    <Button type="submit" className={className} disabled={selectedCount === 0 || isSubmitting}>
      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
      {isSubmitting ? "Registering..." : label}
      {!isSubmitting && <ChevronRight className="h-4 w-4" />}
    </Button>
  );

  const cartDetails = () => (
    <div className="rounded-2xl bg-slate-50 p-4">
      {comboDiscountTotal > 0 && (
        <div className="flex items-center justify-between py-1 text-sm">
          <span className="font-medium text-emerald-700">Combo discount</span>
          <span className="flex items-center font-semibold text-emerald-700">
            <IndianRupee className="h-3.5 w-3.5" />{formatCurrency(comboDiscountTotal)}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between py-1 text-sm">
        <span className="font-medium text-slate-600">Total savings</span>
        <span className="flex items-center font-semibold text-emerald-700">
          <IndianRupee className="h-3.5 w-3.5" />{formatCurrency(totalSavings)}
        </span>
      </div>
      <div className="flex items-center justify-between py-1 text-sm">
        <span className="text-slate-600">GST ({GST_PERCENT}%)</span>
        <span className="flex items-center font-medium text-slate-800">
          <IndianRupee className="h-3.5 w-3.5" />{formatCurrency(totalGst)}
        </span>
      </div>
      <p className="pb-2 text-right text-[11px] text-slate-500">
        {isTelangana ? "CGST + SGST" : "IGST"}
      </p>
      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Total to pay</p>
          <p className="text-[11px] text-slate-500">Including GST</p>
        </div>
        <p className="flex items-center text-xl font-black text-sky-700">
          <IndianRupee className="h-4 w-4" />{formatCurrency(amountToPay)}
        </p>
      </div>
    </div>
  );

  const startPayment = async (registrationCode) => {
    setIsSubmitting(true);
    setPaymentError("");
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/ccavenue/school/initiate`, {
        registrationCode,
      });
      const payment = response.data?.data || {};
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to start payment.");
      }
      if (payment.provider === "razorpay") {
        let checkoutResponse;
        let checkoutErrorMessage = "";
        try {
          checkoutResponse = await openRazorpayCheckout(payment);
        } catch (checkoutError) {
          checkoutErrorMessage = checkoutError.message;
        }
        try {
          const result = await verifyOrReconcileSchoolPayment(
            API_BASE_URL,
            payment,
            checkoutResponse
          );
          const outcome = result.status === "Success"
            ? "success"
            : result.status === "Failed"
              ? "failed"
              : "pending";
          navigateToPaymentResult(
            payment.registrationCode,
            outcome,
            result.transactionId ||
              result.error ||
              checkoutErrorMessage ||
              "We are still waiting for payment confirmation.",
            payment.orderId
          );
        } catch (reconcileError) {
          navigateToPaymentResult(
            payment.registrationCode,
            "pending",
            reconcileError.response?.data?.message ||
              reconcileError.message ||
              checkoutErrorMessage ||
              "We could not verify the payment yet.",
              payment.orderId
          );
        }
      } else {
        submitCcaVenueForm(payment);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Unable to start payment. Please try again.";
      setPaymentError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!school) return toast.error("Check your school before registering.");
    if (Object.keys(selections).length === 0) return toast.error("Select at least one Olympiad package.");
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/student-registration-through-school/${school.schoolId}/enrollments`, {
        ...student,
        selections,
      });
      const savedRegistration = response.data?.data || {};
      setRegistration(savedRegistration);
      setSelections({});
      setPaymentError("");
      if (!savedRegistration.feePending) {
        await startPayment(savedRegistration.registrationCode);
      } else {
        toast.success("Student registration saved successfully.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save student registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolHeader />
      <main className="mx-auto max-w-6xl space-y-5 px-4 py-7 sm:px-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm sm:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">Student registration</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">Register through your school</h1>
          <p className="mt-2 text-sm text-slate-600">Enter the School ID provided by your school to view its details and available Olympiads.</p>

          <form onSubmit={findSchool} className="mt-5 flex max-w-xl flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <Label htmlFor="school-id">School ID or Registration ID</Label>
              <Input id="school-id" value={schoolId} onChange={(event) => { setSchoolId(event.target.value.toUpperCase()); clearSchool(); }} placeholder="Enter numeric ID or e.g. SCH000123" autoCapitalize="characters" className="mt-1" disabled={isSearching} />
            </div>
            <Button type="submit" className="sm:mt-6" disabled={isSearching}>
              {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}{isSearching ? "Checking..." : "Check school"}
            </Button>
          </form>
        </section>

        {school && <SchoolDatabaseDetails school={school} />}

        {school && registration && (registration.feePending || paymentError) && (
          <section className={`rounded-3xl border bg-white p-6 text-center shadow-sm sm:p-8 ${paymentError ? "border-rose-200" : "border-emerald-200"}`}>
            {registration.feePending
              ? <Clock3 className="mx-auto h-12 w-12 text-amber-600" />
              : <XCircle className="mx-auto h-12 w-12 text-rose-600" />}
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              {paymentError
                ? "Unable to start payment"
                : "Registration pending school confirmation"}
            </h2>
            <p className="mt-2 text-slate-600">
              {student.studentName || "The student"}'s details and selected packages have been saved for {school.schoolName}.
            </p>
            {registration.feePending && (
              <p className="mt-2 text-sm text-amber-700">
                Package pricing is not set for one or more selected Olympiads. The school will confirm those fees.
              </p>
            )}
            {registration.registrationCode && (
              <p className="mt-4 inline-block rounded-lg bg-slate-100 px-4 py-2 font-mono font-bold text-slate-800">
                Confirmation ID: {registration.registrationCode}
              </p>
            )}
            {paymentError && (
              <div role="alert" className="mx-auto mt-4 max-w-xl rounded-xl border border-rose-200 bg-rose-50 p-4 text-left text-sm text-rose-800">
                <p>{paymentError}</p>
                <Button
                  type="button"
                  className="mt-3"
                  disabled={isSubmitting}
                  onClick={() => startPayment(registration.registrationCode)}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Retry payment
                </Button>
              </div>
            )}
            <div>
              <Button type="button" className="mt-5" onClick={() => {
                setStudent(EMPTY_STUDENT);
                setSelections({});
                setRegistration(null);
                setPaymentError("");
                setIsCartOpen(false);
              }}>
                Register another student
              </Button>
            </div>
          </section>
        )}

        {school && !registration && (
          <form
            onSubmit={handleSubmit}
            className={selectedCount > 0
              ? "space-y-5 xl:relative xl:left-1/2 xl:w-[calc(100vw-2rem)] xl:max-w-[1560px] xl:-translate-x-1/2 xl:grid xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start xl:gap-6 xl:space-y-0"
              : "space-y-5"}
          >
            <section className={`w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm sm:p-6 ${selectedCount > 0 ? "xl:col-start-1 xl:row-start-1" : ""}`}>
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-sky-600" />
                <h2 className="text-lg font-bold text-slate-900">Student and parent/guardian details</h2>
              </div>
              <p className="mt-1 text-sm text-slate-600">Enter the details that the school should use for this registration.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="studentName">Student full name *</Label>
                  <Input id="studentName" value={student.studentName} onChange={(event) => setStudent((current) => ({ ...current, studentName: event.target.value }))} maxLength={150} autoComplete="name" className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="className">Class *</Label>
                  <Input id="className" type="number" min="1" max="12" step="1" value={student.className} onChange={(event) => setStudent((current) => ({ ...current, className: event.target.value }))} className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="section">Section</Label>
                  <Input id="section" value={student.section} onChange={(event) => setStudent((current) => ({ ...current, section: event.target.value }))} maxLength={50} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="parentName">Parent/guardian full name *</Label>
                  <Input id="parentName" value={student.parentName} onChange={(event) => setStudent((current) => ({ ...current, parentName: event.target.value }))} maxLength={150} autoComplete="name" className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="mobile">Parent/guardian mobile number *</Label>
                  <Input id="mobile" type="tel" inputMode="tel" value={student.mobile} onChange={(event) => setStudent((current) => ({ ...current, mobile: event.target.value }))} maxLength={20} autoComplete="tel" className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={student.email} onChange={(event) => setStudent((current) => ({ ...current, email: event.target.value }))} maxLength={250} autoComplete="email" className="mt-1" />
                </div>
              </div>
            </section>

            <section className={`w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm sm:p-6 ${selectedCount > 0 ? "xl:col-start-1 xl:row-start-2" : ""}`}>
              <h2 className="text-lg font-bold text-slate-900">Student address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="addressLine1">Address line 1 *</Label>
                  <Input id="addressLine1" value={student.addressLine1} onChange={(event) => setStudent((current) => ({ ...current, addressLine1: event.target.value }))} maxLength={1000} autoComplete="address-line1" className="mt-1" required />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="addressLine2">Address line 2</Label>
                  <Input id="addressLine2" value={student.addressLine2} onChange={(event) => setStudent((current) => ({ ...current, addressLine2: event.target.value }))} maxLength={1000} autoComplete="address-line2" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="city">City/Town *</Label>
                  <Input id="city" value={student.city} onChange={(event) => setStudent((current) => ({ ...current, city: event.target.value }))} maxLength={50} autoComplete="address-level2" className="mt-1" required />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <select
                    id="state"
                    value={selectedState}
                    onChange={(event) => setStudent((current) => ({
                      ...current,
                      state: event.target.value === "Others" ? "Others - " : event.target.value,
                    }))}
                    autoComplete="address-level1"
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  >
                    <option value="" disabled>Select state or union territory</option>
                    {INDIAN_STATES_AND_UTS.map((state) => <option key={state} value={state}>{state}</option>)}
                    <option value="Others">Others</option>
                  </select>
                  {selectedState === "Others" && (
                    <Input
                      id="other-state"
                      value={isOtherState ? student.state.slice("Others - ".length) : ""}
                      onChange={(event) => setStudent((current) => ({ ...current, state: `Others - ${event.target.value}` }))}
                      maxLength={41}
                      placeholder="Enter state name"
                      autoComplete="address-level1"
                      className="mt-2"
                      required
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="pincode">Postal code/Pincode *</Label>
                  <Input id="pincode" value={student.pincode} onChange={(event) => setStudent((current) => ({ ...current, pincode: event.target.value }))} maxLength={50} autoComplete="postal-code" className="mt-1" required />
                </div>
              </div>
            </section>

            <section className={`w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm sm:p-6 ${selectedCount > 0 ? "xl:col-start-1 xl:row-start-3" : ""}`}>
              <h2 className="text-lg font-bold text-slate-900">Available Olympiad options</h2>
              <p className="mt-1 text-sm text-slate-600">Only Olympiads selected by your school are shown.</p>
              {availableExams.length === 0 ? <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">This school has not selected any Olympiads yet.</div> : (
                <div className="mt-4 space-y-4">{availableExams.map((exam) => {
                  const configuredDates = examDates
                    .find((entry) => entry.examCode === exam.code)?.dates || [];
                  const visibleDates = configuredDates;
                  return (
                  <article key={exam.code} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">{exam.name}</h3>
                        <p className="text-xs font-semibold text-sky-700">{exam.code}</p>
                      </div>
                      <div className="sm:ml-auto sm:max-w-[65%] sm:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Exam dates</p>
                        {visibleDates.length > 0 ? (
                          <div className="mt-1 flex flex-wrap gap-2 sm:justify-end">
                          {visibleDates.map((date) => (
                            <span key={`${date.date}-${date.dateTo || date.date}-${date.mode}`} className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                              {date.label || `${date.date} - ${date.mode}`}
                            </span>
                          ))}
                        </div>
                        ) : (
                          <p className="mt-1 text-sm text-slate-500">No active exam dates configured for this school&apos;s exam modes.</p>
                        )}
                      </div>
                    </div>
                    {getOptions(exam.code).length === 0 ? (
                      <label className={`mt-3 flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${selections[exam.code] === null ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400" : "border-amber-200 bg-amber-50 hover:border-amber-300"}`}>
                        <input
                          type="checkbox"
                          checked={selections[exam.code] === null}
                          onChange={(event) => {
                            setSelections((current) => {
                              const next = { ...current };
                              if (event.target.checked) next[exam.code] = null;
                              else delete next[exam.code];
                              return next;
                            });
                          }}
                          className="mt-0.5"
                        />
                        <span className="text-amber-900">
                          Package pricing is not configured yet. Select this Olympiad to register now; the school will confirm its package and fee.
                        </span>
                      </label>
                    ) : (
                    <div className="mt-3 grid gap-2 md:grid-cols-3">{getOptions(exam.code).map((option) => {
                      const selected = selections[exam.code] === option.optionId;
                      const optionPrice = Number(option.discountedPrice || 0);
                      const mrp = Number(option.mrp || optionPrice);
                      return <label key={option.optionId} className={`cursor-pointer rounded-xl border p-3 transition ${selected ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500" : "border-slate-200 bg-white hover:border-sky-300"}`}><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 font-bold text-slate-800"><input type="radio" name={exam.code} checked={selected} onChange={() => {
                        setSelections((current) => ({ ...current, [exam.code]: option.optionId }));
                      }} />Option {option.optionId}</span><span className="text-right"><span className="block text-xs font-medium text-slate-500 line-through"><IndianRupee className="inline h-3 w-3" />{formatCurrency(mrp)}</span><span className="flex items-center justify-end font-black text-slate-900"><IndianRupee className="h-3.5 w-3.5" />{formatCurrency(optionPrice)}</span></span></div>{option.description && <p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-600">{option.description}</p>}</label>;
                    })}</div>
                    )}
                  </article>
                  );
                })}</div>
              )}
            </section>

            {selectedCount > 0 && (
              <div className="flex justify-end xl:col-start-1 xl:row-start-4">
                {registerButton("rounded-full bg-sky-600 font-bold hover:bg-sky-700")}
              </div>
            )}

            {selectedCount > 0 && (
              <>
                <section className="hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:block sm:p-5 xl:sticky xl:top-5 xl:col-start-2 xl:row-start-1 xl:row-span-3">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <span className="rounded-xl bg-sky-50 p-3 text-sky-600"><ShoppingCart className="h-5 w-5" /></span>
                    <div>
                      <h2 className="font-bold text-slate-900">Order summary</h2>
                      <p className="text-sm text-slate-500">{selectedCount} exam{selectedCount === 1 ? "" : "s"} selected</p>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {selectedItems.map((item) => (
                      <div key={item.examCode} className="flex items-center gap-3 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800">{item.examCode}</p>
                          <p className="text-xs text-slate-500">{item.optionId === null ? "Pricing pending" : `Option ${item.optionId} · Base ₹${formatCurrency(item.price)}`}</p>
                        </div>
                        <div className="text-right font-bold text-slate-800">
                          <p className="flex items-center justify-end"><IndianRupee className="h-3.5 w-3.5" />{formatCurrency(item.total)}</p>
                          {item.optionId !== null && (
                            <p className="text-[11px] font-normal text-slate-500">
                              {item.comboDiscount > 0 && <span className="block text-emerald-700">Combo −₹{formatCurrency(item.comboDiscount)}</span>}
                              GST ₹{formatCurrency(item.gst)}
                            </p>
                          )}
                        </div>
                        <button type="button" className="text-xs font-semibold text-rose-600 hover:text-rose-700" onClick={() => removeSelection(item.examCode)}>Remove</button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    {cartDetails()}
                  </div>
                  <div className="mt-4">{registerButton("w-full rounded-full bg-sky-600 font-bold hover:bg-sky-700")}</div>
                </section>

                <div className="sm:hidden">
                  {isCartOpen ? (
                    <>
                      <button type="button" aria-label="Collapse cart" className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px]" onClick={() => setIsCartOpen(false)} />
                      <section role="dialog" aria-modal="true" aria-label="Selected exam cart" className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                          <div className="flex items-center gap-2 font-bold text-slate-800">
                            <ShoppingCart className="h-4 w-4 text-sky-600" />
                            Your Cart <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">{selectedCount}</span>
                          </div>
                          <button type="button" aria-label="Collapse cart" className="rounded-full p-2 text-slate-500 hover:bg-slate-100" onClick={() => setIsCartOpen(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <div className="max-h-[calc(92dvh-150px)] space-y-3 overflow-y-auto px-4 py-3">
                          <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2.5 text-sm font-bold text-sky-700">
                            <GraduationCap className="h-4 w-4" /> Class {student.className || "—"}
                          </div>
                          {selectedItems.map((item) => (
                            <div key={item.examCode} className="flex items-center gap-3 rounded-xl border border-purple-200 bg-purple-50/60 p-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-800">{item.examCode}</p>
                                <p className="text-xs text-slate-500">{item.optionId === null ? "Pricing pending" : `Option ${item.optionId}`}</p>
                              </div>
                              <div className="text-right">
                                <p className="flex items-center justify-end font-bold text-slate-800"><IndianRupee className="h-3.5 w-3.5" />{formatCurrency(item.total)}</p>
                                {item.optionId !== null && (
                                  <p className="text-[11px] text-slate-500">
                                    Base ₹{formatCurrency(item.price)}
                                    {item.comboDiscount > 0 && ` · Combo −₹${formatCurrency(item.comboDiscount)}`}
                                    {` · GST ₹${formatCurrency(item.gst)}`}
                                  </p>
                                )}
                              </div>
                              <button type="button" aria-label={`Remove ${item.examCode}`} className="rounded p-1 text-rose-500 hover:bg-rose-50" onClick={() => removeSelection(item.examCode)}><Trash2 className="h-4 w-4" /></button>
                            </div>
                          ))}
                          <div className="rounded-2xl border border-slate-200 p-3">
                            {cartDetails()}
                          </div>
                        </div>
                        <div className="border-t border-slate-100 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                          {registerButton("w-full rounded-full bg-sky-600 font-bold hover:bg-sky-700")}
                        </div>
                      </section>
                    </>
                  ) : (
                    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.12)]">
                      <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => setIsCartOpen(true)}>
                        <span className="relative rounded-xl bg-sky-50 p-2.5 text-sky-600"><ShoppingCart className="h-5 w-5" /><span className="absolute -right-1 -top-1 rounded-full bg-sky-600 px-1.5 text-[10px] font-bold text-white">{selectedCount}</span></span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-slate-800">{selectedCount} Exam{selectedCount === 1 ? "" : "s"} Selected</span>
                          <span className="block text-xs text-slate-500">Tap to view selected options</span>
                        </span>
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      </button>
                      <div className="text-right">
                        <p className="flex items-center justify-end font-black text-sky-700"><IndianRupee className="h-4 w-4" />{formatCurrency(amountToPay)}</p>
                        <p className="text-[10px] font-bold text-sky-600">Incl. GST</p>
                      </div>
                      {registerButton("rounded-full bg-sky-600 px-4 font-bold hover:bg-sky-700", "Register")}
                    </div>
                  )}
                  <div className="h-20 sm:hidden" aria-hidden="true" />
                </div>
              </>
            )}
          </form>
        )}
      </main>
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="combo-modal-title"
            className="relative w-full max-w-sm rounded-3xl bg-white px-6 pb-8 pt-8 text-center shadow-2xl sm:px-9"
          >
            <button
              type="button"
              aria-label="Close offer"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-rose-500 hover:bg-slate-50"
              onClick={() => setActiveModal(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-rose-500 text-white shadow-[0_14px_28px_rgba(244,63,94,0.3)]">
              <Percent className="h-12 w-12" strokeWidth={3} />
            </span>
            {activeModal === "offer" ? (
              <>
                <h2 id="combo-modal-title" className="mt-6 text-3xl font-black tracking-tight text-slate-800">Special Offer!</h2>
                <p className="mt-6 text-base leading-8 text-slate-500">
                  Select all NSTSE, UIMO, UIEO, and UICO Olympiads with <strong className="text-slate-700">Option 1</strong> for a 7% discount.
                  <br />
                  <strong className="text-slate-700">Option 2</strong> for 10%. <strong className="text-slate-700">Option 3</strong> for 15%.
                </p>
              </>
            ) : (
              <>
                <h2 id="combo-modal-title" className="mt-6 text-3xl font-black leading-tight tracking-tight text-slate-800">Combo Discount Applied</h2>
                <p className="mt-5 text-base leading-8 text-slate-500">
                  You have saved <strong className="text-slate-700">₹{formatCurrency(comboDiscountTotal)}</strong> with your Option {comboOptionId} combo selection across NSTSE, UIMO, UIEO and UICO.
                </p>
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold leading-6 text-emerald-700">
                  You have selected Option {comboOptionId} from NSTSE, UIMO, UIEO and UICO. {Math.round(comboDiscountRate * 100)}% combo discount applied.
                </div>
                <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-sm font-semibold leading-6 text-indigo-700">
                  {comboOptionId < 3
                    ? `Upgrade all four to Option 3 to save 15% combo discount.`
                    : "You have selected the highest-value combo discount for complete preparation."}
                </div>
              </>
            )}
            <Button
              type="button"
              className="mt-6 min-w-36 rounded-xl bg-indigo-500 px-7 py-3 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-600"
              onClick={() => setActiveModal(null)}
            >
              Get Now!
            </Button>
          </section>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default StudentRegistrationThroughtSchool;
