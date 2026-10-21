import { AlertCircle, CreditCard, Home, Phone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

function formatAmount(amount) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) {
    return "";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numeric);
}

function PaymentFailedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paymentData = location.state || {
    registrationCode: searchParams.get("registrationCode") || "",
    transactionId: searchParams.get("transactionId") || "",
    amount: searchParams.get("amount") || "",
    error: searchParams.get("error") || "",
    formData: {
      studentName: searchParams.get("studentName") || "",
    },
  };
  const formattedAmount = formatAmount(paymentData?.amount);

  const handleTryAgain = () => {
    navigate("/register/payment", {
      replace: true,
      state: paymentData,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-6 md:p-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="mb-2 text-2xl font-black text-slate-800 sm:text-3xl">Payment Unsuccessful</h1>
          <p className="text-slate-600 mb-2">
            We regret to inform you that your payment for Unified Council Olympiads 2026-27 could not be processed successfully.
          </p>
          <p className="text-slate-500 mb-6">
            {paymentData?.error || "Please try again after a few minutes."}
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-2">
            {paymentData?.registrationCode && (
              <div className="flex justify-between">
                <span className="text-slate-500">Reference</span>
                <span className="font-semibold text-slate-800">{paymentData.registrationCode}</span>
              </div>
            )}
            {paymentData?.formData?.studentName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Student</span>
                <span className="font-semibold text-slate-800">{paymentData.formData.studentName}</span>
              </div>
            )}
            {paymentData?.amount && (
              <div className="flex justify-between">
                <span className="text-slate-500">Amount</span>
                <span className="font-black text-red-600">{formattedAmount}</span>
              </div>
            )}
          </div>

          {formattedAmount && (
            <p className="text-left text-sm font-semibold text-slate-700 mb-4">
              Retry payment of {formattedAmount} with
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-4">
            {["Pay Later", "Cards", "Netbanking", "Show All Options"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={handleTryAgain}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:bg-sky-50"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mb-6 rounded-2xl bg-slate-50 p-5 text-left text-sm leading-6 text-slate-700 space-y-3">
            <p className="font-semibold text-slate-800">This may happen due to reasons such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Network connectivity issues</li>
              <li>Bank or card authorization failure</li>
              <li>UPI/payment gateway timeout</li>
              <li>Transaction cancellation before completion</li>
            </ul>
            <p>Please try making the payment again after a few minutes.</p>
            <p>
              If the payment amount has been deducted from your account but the registration status is not confirmed,
              please wait for some time as banks may take a while to update the transaction status.
            </p>
            <p>
              For assistance, please contact our support team on 9030007882 | 9603064939 with your transaction
              details.
            </p>
            <p>Thank you for your patience and understanding.</p>
            <p className="font-semibold text-slate-800">Team Unified Council</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleTryAgain} className="flex-1 rounded-full py-6 bg-sky-500 hover:bg-sky-400">
              <CreditCard className="w-4 h-4 mr-2" />
              Retry Payment
            </Button>
            <Button variant="outline" onClick={() => navigate("/register")} className="flex-1 rounded-full py-6">
              Back to Register
            </Button>
          </div>

          <Button
            type="button"
            onClick={() => {
              window.location.href = "tel:+919603064939";
            }}
            className="mt-4 w-full rounded-full py-6 bg-slate-900 hover:bg-slate-800"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call our Expert Support
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mt-4 rounded-full text-slate-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailedPage;
