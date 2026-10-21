import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowLeft, CheckCircle2, Clock3, CreditCard, FileText, Loader2, XCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import SchoolHeader from "../components/SchoolHeader";
import API_BASE_URL from "@/services/apiBaseUrl";
import { submitCcaVenueForm } from "@/utils/ccaVenuePayment";
import {
  openRazorpayCheckout,
  verifyOrReconcileSchoolPayment,
} from "@/utils/razorpayCheckout";

function formatAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function SchoolRegistrationPaymentResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registrationCode = searchParams.get("registrationCode") || "";
  const transactionId = searchParams.get("transactionId") || "";
  const paymentError = searchParams.get("error") || "";
  const requestedPaymentStatus = searchParams.get("payment") || "";
  const razorpayOrderId = searchParams.get("razorpayOrderId") || "";
  const [registration, setRegistration] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(registrationCode));
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState("");
  const [statusCheck, setStatusCheck] = useState(0);
  const registrationStatus = String(registration?.status || "").toLowerCase();
  const isPaid = registrationStatus === "success";
  const isFailed = !isPaid && (
    requestedPaymentStatus === "failed" ||
    registrationStatus === "failed" ||
    registrationStatus === "failure"
  );
  const isPending = !isPaid && !isFailed && (
    requestedPaymentStatus === "pending" || Boolean(registration)
  );

  useEffect(() => {
    if (!registrationCode) {
      setIsLoading(false);
      setError("The registration reference is missing.");
      return undefined;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError("");
    const statusRequest = requestedPaymentStatus && requestedPaymentStatus !== "success"
      ? axios.post(`${API_BASE_URL}/payments/razorpay/school/reconcile`, {
        registrationCode,
        ...(razorpayOrderId ? { razorpay_order_id: razorpayOrderId } : {}),
      }, { signal: controller.signal })
        .then((response) => {
          const payment = response.data?.data || {};
          setRegistration({
            registrationCode: payment.registrationCode,
            amount: payment.amount,
            status: payment.status,
          });
        })
        .catch(() => axios.get(
          `${API_BASE_URL}/payments/ccavenue/school/status/${encodeURIComponent(registrationCode)}`,
          { signal: controller.signal }
        ).then((response) => setRegistration(response.data?.data || null)))
      : axios.get(
        `${API_BASE_URL}/payments/ccavenue/school/status/${encodeURIComponent(registrationCode)}`,
        { signal: controller.signal }
      ).then((response) => setRegistration(response.data?.data || null));
    statusRequest
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(
            requestError.response?.data?.message ||
            "Unable to verify the payment status right now. Please try again."
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [registrationCode, requestedPaymentStatus, razorpayOrderId, statusCheck]);

  const amount = useMemo(() => formatAmount(registration?.amount), [registration?.amount]);

  const retryPayment = async () => {
    if (!registrationCode) return;
    setIsRetrying(true);
    setError("");
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
        const query = new URLSearchParams({
          registrationCode: payment.registrationCode,
          payment: outcome,
          ...(outcome === "success"
            ? { transactionId: result.transactionId || checkoutResponse?.razorpay_payment_id || "" }
            : { error: result.error || checkoutErrorMessage || "We are still waiting for payment confirmation." }),
          razorpayOrderId: payment.orderId,
        });
        window.location.assign(
          `/student-registration-through-school/payment/${outcome === "success" ? "success" : "failed"}?${query.toString()}`
        );
      } else {
        submitCcaVenueForm(payment);
      }
    } catch (retryError) {
      setError(
        retryError.response?.data?.message ||
        retryError.message ||
        "Unable to start payment. Please try again."
      );
    } finally {
      setIsRetrying(false);
    }
  };

  const confirmed = isPaid;
  const Icon = confirmed ? CheckCircle2 : isPending ? Clock3 : XCircle;
  const iconClass = confirmed
    ? "bg-emerald-100 text-emerald-600"
    : isPending
      ? "bg-sky-100 text-sky-600"
      : "bg-rose-100 text-rose-600";

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolHeader />
      <main className="mx-auto flex max-w-3xl items-center justify-center px-4 py-12 sm:px-6">
        <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${iconClass}`}>
            {isLoading ? <Loader2 className="h-9 w-9 animate-spin" /> : <Icon className="h-9 w-9" />}
          </span>
          <h1 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">
            {isLoading
              ? "Verifying your payment"
              : confirmed
                ? "Payment successful"
                : isPending
                  ? "Registration pending payment"
                  : isFailed
                    ? "Payment unsuccessful"
                    : "Unable to verify payment"}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            {isLoading
              ? "Please wait while we confirm your registration payment."
              : confirmed
                ? "Your student registration payment has been confirmed."
                : isPending
                  ? "Payment is not complete yet. Your registration will remain pending until payment is confirmed."
                  : isFailed
                    ? paymentError || "We could not confirm your payment. You can retry the payment or return to student registration."
                    : "Please check your connection and try again to verify your registration status."}
          </p>

          {(registrationCode || transactionId || amount) && (
            <dl className="mx-auto mt-7 max-w-lg divide-y divide-slate-200 rounded-2xl bg-slate-50 px-5 text-left">
              {registrationCode && (
                <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <dt className="text-slate-500">Confirmation ID</dt>
                  <dd className="font-mono font-bold text-slate-900">{registrationCode}</dd>
                </div>
              )}
              {transactionId && (
                <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <dt className="text-slate-500">Transaction ID</dt>
                  <dd className="font-mono font-semibold text-slate-900">{transactionId}</dd>
                </div>
              )}
              {amount && (
                <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <dt className="text-slate-500">Registration amount</dt>
                  <dd className="font-bold text-slate-900">{amount}</dd>
                </div>
              )}
            </dl>
          )}

          {error && <p role="alert" className="mt-5 text-sm text-rose-700">{error}</p>}

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {!isLoading && confirmed && registrationCode && (
              <Button type="button" variant="outline" asChild>
                <a href={`${API_BASE_URL}/payments/invoices/${encodeURIComponent(registrationCode)}/download`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Download invoice
                </a>
              </Button>
            )}
            {!isLoading && isPending && registrationCode && (
              <Button type="button" variant="outline" onClick={() => setStatusCheck((current) => current + 1)}>
                Check payment status
              </Button>
            )}
            {!isLoading && !confirmed && registrationCode && (
              <Button type="button" onClick={retryPayment} disabled={isRetrying}>
                {isRetrying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                {isPending ? "Continue to payment" : "Retry payment"}
              </Button>
            )}
            <Button
              type="button"
              variant={confirmed ? "default" : "outline"}
              onClick={() => navigate("/student-registration-through-school")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Register another student
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default SchoolRegistrationPaymentResultPage;
