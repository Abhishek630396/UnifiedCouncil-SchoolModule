import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { IndianRupee, Loader2, RefreshCw, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/services/apiBaseUrl";
import SchoolHeader from "../school/components/SchoolHeader";
import AdminSideBar from "./AdminSideBar";
import { AdminPermission } from "./AdminAccess";

const EXAMS = [
  { code: "NSTSE", name: "National Level Science Talent Search Examination", options: 3 },
  { code: "UIMO", name: "Unified International Mathematics Olympiad", options: 3 },
  { code: "UIEO", name: "Unified International English Olympiad", options: 3 },
  { code: "UIGKO", name: "Unified International General Knowledge Olympiad", options: 2 },
  { code: "UCO", name: "Unified International Cyber Olympiad", options: 3 },
  { code: "UMO", name: "Unified Monthly Olympiad with Remedial Tests", options: 3 },
];

const makeEmptyPrices = () => EXAMS.flatMap((exam) =>
  Array.from({ length: exam.options }, (_, index) => ({
    examCode: exam.code, optionId: index + 1, mrp: "", msp: "", discountedPrice: "", description: "",
  }))
);

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("uc_admin_token")}`,
});

const ManageExamPrices = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState(makeEmptyPrices);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleAdminUnauthorized = useCallback(() => {
    localStorage.removeItem("uc_admin_token");
    navigate("/school/login");
  }, [navigate]);

  const handleUnauthorized = useCallback((error) => {
    if (error.response?.status === 401) {
      handleAdminUnauthorized();
      return true;
    }
    return false;
  }, [handleAdminUnauthorized]);

  const loadPrices = useCallback(async () => {
    if (!localStorage.getItem("uc_admin_token")) return handleAdminUnauthorized();
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/exam-prices`, {
        headers: getAuthHeaders(),
      });
      const loaded = Array.isArray(response.data?.data) ? response.data.data : [];
      const byOption = new Map(loaded.map((row) => [`${row.examCode}-${row.optionId}`, row]));
      setPrices(makeEmptyPrices().map((row) => {
        const saved = byOption.get(`${row.examCode}-${row.optionId}`);
        return saved ? {
          ...row,
          mrp: String(saved.mrp),
          msp: String(saved.msp),
          discountedPrice: String(saved.discountedPrice),
          description: String(saved.description || ""),
        } : row;
      }));
    } catch (error) {
      if (handleUnauthorized(error)) return;
      toast.error(error.response?.data?.message || "Unable to load exam prices");
    } finally { setIsLoading(false); }
  }, [handleAdminUnauthorized, handleUnauthorized]);

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  const groupedPrices = useMemo(() => EXAMS.map((exam) => ({
    ...exam, prices: prices.filter((row) => row.examCode === exam.code),
  })), [prices]);

  const updatePrice = (examCode, optionId, field, value) => {
    if (value !== "" && !/^\d*(\.\d{0,2})?$/.test(value)) return;
    setPrices((current) => current.map((row) =>
      row.examCode === examCode && row.optionId === optionId ? { ...row, [field]: value } : row
    ));
  };

  const updateDescription = (examCode, optionId, description) => {
    setPrices((current) => current.map((row) =>
      row.examCode === examCode && row.optionId === optionId ? { ...row, description } : row
    ));
  };

  const validate = () => {
    for (const row of prices) {
      if (String(row.description || "").length > 4000) return `${row.examCode} Option ${row.optionId}: description cannot exceed 4000 characters.`;
      if ([row.mrp, row.msp, row.discountedPrice].some((value) => value === null || value === undefined || String(value).trim() === "")) return `Please enter MRP, MSP, and discounted price for ${row.examCode} Option ${row.optionId}.`;
      const [mrp, msp, discounted] = [row.mrp, row.msp, row.discountedPrice].map(Number);
      if (![mrp, msp, discounted].every(Number.isFinite)) return `${row.examCode} Option ${row.optionId}: enter valid numeric prices.`;
      if ([mrp, msp, discounted].some((value) => value < 0)) return "Prices cannot be negative.";
      if (msp > mrp || discounted > msp) return `${row.examCode} Option ${row.optionId}: use MRP ≥ MSP ≥ discounted price.`;
    }
    return "";
  };

  const savePrices = async () => {
    const errorMessage = validate();
    if (errorMessage) return toast.error(errorMessage);
    if (!localStorage.getItem("uc_admin_token")) return handleAdminUnauthorized();
    setIsSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/admin/exam-prices`, { prices: prices.map((row) => ({
        ...row,
        mrp: Number(row.mrp),
        msp: Number(row.msp),
        discountedPrice: Number(row.discountedPrice),
        description: String(row.description || "").trim(),
      })) }, { headers: getAuthHeaders() });
      toast.success("Exam prices saved successfully");
      await loadPrices();
    } catch (error) {
      if (handleUnauthorized(error)) return;
      toast.error(error.response?.data?.message || "Unable to save exam prices");
    } finally { setIsSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SchoolHeader />
      <div className="flex flex-col bg-slate-50 lg:flex-row">
      <AdminSideBar />
      <main className="min-w-0 flex-1 px-3 py-5 sm:px-5">
        <section className="mx-auto max-w-7xl space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2 text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Admin</p>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Manage Exam Prices</h1>
              <p className="text-sm text-slate-600">Set MRP, MSP, and the final discounted price for each exam option.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={loadPrices} disabled={isLoading || isSaving}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
              <AdminPermission permission="exam_prices.edit">
              <Button onClick={savePrices} disabled={isLoading || isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{isSaving ? "Saving..." : "Save all prices"}
              </Button>
              </AdminPermission>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-900">
            Price order must be <strong>MRP ≥ MSP ≥ discounted price</strong>. Amounts support up to two decimal places.
          </div>

          {isLoading ? <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-50 p-10 text-slate-600"><Loader2 className="h-5 w-5 animate-spin" />Loading prices...</div> : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
              {groupedPrices.map((exam) => (
                <article key={exam.code} className="overflow-hidden rounded-lg sm:rounded-2xl border border-slate-200 bg-white text-left shadow-sm">
                  <header className="border-b border-slate-200 bg-slate-50 p-2 sm:p-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"><span className="rounded-lg bg-sky-100 px-2.5 py-1 text-xs sm:text-sm font-bold text-sky-700 w-fit">{exam.code}</span><h2 className="font-semibold text-sm sm:text-base text-slate-900 line-clamp-2">{exam.name}</h2></div>
                  </header>
                  <div className="divide-y divide-slate-100">
                    {exam.prices.map((row) => (
                      <div key={row.optionId} className="p-2 sm:p-3.5">
                        <p className="mb-2 text-xs sm:text-sm font-semibold text-slate-800">Option {row.optionId}</p>
                        <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-3">
                          {[["mrp", "MRP"], ["msp", "MSP"], ["discountedPrice", "Discounted price"]].map(([field, label]) => (
                            <div key={field}><Label htmlFor={`${row.examCode}-${row.optionId}-${field}`} className="text-xs sm:text-sm">{label}</Label><div className="relative mt-1"><IndianRupee className="absolute left-3 top-1/2 h-3 sm:h-4 w-3 sm:w-4 -translate-y-1/2 text-slate-400" /><Input id={`${row.examCode}-${row.optionId}-${field}`} inputMode="decimal" value={row[field]} onChange={(event) => updatePrice(row.examCode, row.optionId, field, event.target.value)} className="pl-8 sm:pl-9 text-sm" placeholder="0.00" aria-label={`${exam.code} option ${row.optionId} ${label}`} /></div></div>
                          ))}
                        </div>
                        <div className="mt-3">
                          <Label htmlFor={`${row.examCode}-${row.optionId}-description`} className="text-xs sm:text-sm">Option description</Label>
                          <Textarea
                            id={`${row.examCode}-${row.optionId}-description`}
                            value={row.description}
                            onChange={(event) => updateDescription(row.examCode, row.optionId, event.target.value)}
                            maxLength={4000}
                            rows={3}
                            className="mt-1 whitespace-pre-wrap text-sm"
                            placeholder="Enter the multi-line description shown below this option."
                            aria-label={`${exam.code} option ${row.optionId} description`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
          <AdminPermission permission="exam_prices.edit">
            <div className="flex justify-end"><Button onClick={savePrices} disabled={isLoading || isSaving}><Save className="mr-2 h-4 w-4" />{isSaving ? "Saving..." : "Save all prices"}</Button></div>
          </AdminPermission>
        </section>
      </main>
      </div>
      <Footer />
    </div>
  );
};

export default ManageExamPrices;
