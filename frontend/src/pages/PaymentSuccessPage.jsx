import { CheckCircle, Download, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import API_BASE_URL from "@/services/apiBaseUrl";


function formatAmount(amount) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) {
    return "";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numeric);
}

function getInvoiceUrl(paymentData) {
  if (paymentData?.invoiceUrl) {
    return paymentData.invoiceUrl;
  }

  if (!paymentData?.registrationCode || !API_BASE_URL) {
    return "";
  }

  return `${API_BASE_URL}/payments/invoices/${encodeURIComponent(paymentData.registrationCode)}/download`;
}

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paymentData = location.state || {
    registrationCode: searchParams.get("registrationCode") || "",
    transactionId: searchParams.get("transactionId") || "",
    amount: searchParams.get("amount") || "",
    formData: {
      studentName: searchParams.get("studentName") || "",
    },
  };
  const formattedAmount = formatAmount(paymentData?.amount);
  const invoiceUrl = getInvoiceUrl(paymentData);

  const handleDownloadInvoice = () => {
    if (!invoiceUrl) {
      return;
    }

    window.open(invoiceUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-full sm:max-w-sm md:max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-slate-200 p-4 sm:p-6 md:p-8">
        {invoiceUrl && (
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="absolute right-3 sm:right-5 top-3 sm:top-5 inline-flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100"
            aria-label="Download invoice PDF"
            title="Download invoice PDF"
          >
            <Download className="h-4 sm:h-5 w-4 sm:w-5" />
          </button>
        )}

        <div className="text-center">
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-8 sm:w-10 h-8 sm:h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Payment Successful</h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-4 sm:mb-6">
            Your registration for Unified Council Olympiads 2026-27 has been successfully completed.
          </p>

          <div className="bg-emerald-50 rounded-lg sm:rounded-2xl p-3 sm:p-5 mb-4 sm:mb-6 text-left space-y-2">
            {paymentData?.registrationCode && (
              <div className="flex justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
                <span className="text-emerald-700 flex-shrink-0">Reference</span>
                <span className="font-semibold text-emerald-900 text-right break-all">{paymentData.registrationCode}</span>
              </div>
            )}
            {paymentData?.transactionId && (
              <div className="flex justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
                <span className="text-emerald-700 flex-shrink-0">Transaction ID</span>
                <span className="font-semibold text-emerald-900 text-right break-all">{paymentData.transactionId}</span>
              </div>
            )}
            {paymentData?.formData?.studentName && (
              <div className="flex justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
                <span className="text-emerald-700 flex-shrink-0">Student</span>
                <span className="font-semibold text-emerald-900 text-right">{paymentData.formData.studentName}</span>
              </div>
            )}
            {formattedAmount && (
              <div className="flex justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
                <span className="text-emerald-700 flex-shrink-0">Amount Paid</span>
                <span className="font-black text-emerald-900 text-right">{formattedAmount}</span>
              </div>
            )}
            {invoiceUrl && (
              <div className="flex justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
                <span className="text-emerald-700 flex-shrink-0">Invoice</span>
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="font-semibold text-sky-700 transition-colors hover:text-sky-600 flex-shrink-0"
                >
                  Download PDF
                </button>
              </div>
            )}
          </div>

          <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-2xl bg-slate-50 p-3 sm:p-5 text-left text-xs sm:text-sm leading-5 sm:leading-6 text-slate-700 space-y-2 sm:space-y-3">
            <p>Your registration details will be sent shortly via WhatsApp and SMS.</p>
            <p>
              An email containing your registration confirmation and links to download your e-books (PDF format),
              based on the option(s) selected during registration, will be sent to your registered email address.
            </p>
            <p>If you do not receive the email within some time, please check your Spam, Junk, or Promotions folder.</p>
            <p>Thank you for choosing Unified Council. We wish you great success in your Olympiad journey!</p>
            <p className="font-semibold text-slate-800">Team Unified Council</p>
          </div>

          <Button
            onClick={() => navigate("/")}
            className="w-full rounded-full py-4 sm:py-6 text-sm sm:text-base bg-sky-500 hover:bg-sky-400"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
