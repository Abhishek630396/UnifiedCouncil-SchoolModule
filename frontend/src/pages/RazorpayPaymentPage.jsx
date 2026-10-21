import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "@/services/apiBaseUrl";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";

const PAYMENT_SESSION_KEY = "uc_pending_payment";
let razorpayScriptPromise = null;

function readPendingPaymentData(locationState) {
  if (locationState?.registrationCode) {
    return locationState;
  }

  try {
    const storedValue = sessionStorage.getItem(PAYMENT_SESSION_KEY);
    if (!storedValue) {
      return null;
    }

    const parsed = JSON.parse(storedValue);
    return parsed?.registrationCode ? parsed : null;
  } catch (_error) {
    return null;
  }
}

function redirectToFailurePage(navigate, paymentData, error) {
  navigate("/register/payment/failed", {
    replace: true,
    state: {
      ...paymentData,
      error,
    },
  });
}

async function recordPaymentFailure(registrationCode, reason) {
  if (!registrationCode) {
    return;
  }

  try {
    await axios.post(`${API_BASE_URL}/payments/razorpay/failure`, {
      registrationCode,
      reason,
    });
  } catch (_error) {
    // Ignore failure recording errors in the UI flow.
  }
}

function loadRazorpayScript() {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return razorpayScriptPromise;
}

function RazorpayPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const openedRef = useRef(false);
  const failureHandledRef = useRef(false);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const paymentData = readPendingPaymentData(location.state);
  const displayAmount = Number(
    paymentData?.invoiceBreakdown?.summary?.amountToPay ?? paymentData?.amount ?? 0
  );
  const registrationCode = paymentData?.registrationCode || "";
  const paymentAmount = paymentData?.amount ?? 0;
  const studentName = paymentData?.formData?.studentName || "";
  const studentEmail = paymentData?.formData?.email || "";
  const studentMobile = paymentData?.formData?.mobile || "";

  const handleFailure = useCallback(async (reason) => {
    if (failureHandledRef.current) {
      return;
    }

    failureHandledRef.current = true;
    await recordPaymentFailure(registrationCode, reason);
    sessionStorage.removeItem(PAYMENT_SESSION_KEY);
    redirectToFailurePage(navigate, paymentData, reason);
  }, [navigate, paymentData, registrationCode]);

  const openCheckout = useCallback(async () => {
    if (!registrationCode || !paymentAmount || isStartingCheckout) {
      return;
    }

    setIsStartingCheckout(true);
    setCheckoutError("");

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Failed to load Razorpay checkout.");
      }

      const orderResponse = await axios.post(`${API_BASE_URL}/payments/razorpay/order`, {
        registrationCode,
        amount: displayAmount,
        customerName: studentName,
        customerEmail: studentEmail,
        customerPhone: studentMobile,
      });

      const order = orderResponse.data?.data;
      if (!order?.orderId) {
        throw new Error("Payment order could not be created.");
      }

      const checkoutKey = order.key;
      if (!checkoutKey) {
        throw new Error("Razorpay key is missing in the order response.");
      }

      const razorpay = new window.Razorpay({
        key: checkoutKey,
        amount: order.amount,
        currency: order.currency || "INR",
        order_id: order.orderId,
        name: "Unified Council",
        description: `Registration ${registrationCode}`,
        prefill: {
          name: studentName,
          email: studentEmail,
          contact: studentMobile,
        },
        theme: {
          color: "#0ea5e9",
        },
        modal: {
          ondismiss: async () => {
            await handleFailure("Payment was cancelled before completion.");
          },
        },
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(`${API_BASE_URL}/payments/razorpay/verify`, {
              registrationCode,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyResponse.data?.success) {
              throw new Error("Payment verification failed.");
            }

            toast.success(`Payment successful. Ref: ${registrationCode}`);
            sessionStorage.removeItem(PAYMENT_SESSION_KEY);
            navigate("/register/payment/success", {
              replace: true,
              state: {
                ...paymentData,
                invoiceUrl: verifyResponse.data?.data?.invoiceUrl || null,
                invoiceBreakdown: verifyResponse.data?.data?.invoiceBreakdown || paymentData?.invoiceBreakdown || null,
                transactionId: verifyResponse.data?.data?.transactionId || response.razorpay_payment_id,
              },
            });
          } catch (verifyError) {
            await handleFailure(
              verifyError.response?.data?.message || verifyError.message || "Payment verification failed."
            );
          }
        },
      });

      razorpay.on("payment.failed", async (response) => {
        try {
          razorpay.close();
        } catch (_error) {
          // Ignore close errors and continue to failure page.
        }

        await handleFailure(response.error?.description || "Payment failed.");
      });

      razorpay.open();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Unable to start payment.";
      console.error("[Frontend] Razorpay checkout failed:", error.response?.data || error.message);
      setCheckoutError(message);
      toast.error(message);
    } finally {
      setIsStartingCheckout(false);
    }
  }, [
    displayAmount,
    handleFailure,
    isStartingCheckout,
    navigate,
    paymentAmount,
    paymentData,
    registrationCode,
    studentEmail,
    studentMobile,
    studentName,
  ]);

  useEffect(() => {
    if (!registrationCode || !paymentAmount) {
      navigate("/register", { replace: true });
      return;
    }
  }, [navigate, paymentAmount, registrationCode]);

  useEffect(() => {
    if (!registrationCode || !paymentAmount || openedRef.current) {
      return;
    }

    openedRef.current = true;
    openCheckout();
  }, [openCheckout, paymentAmount, registrationCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-sky-600 animate-spin" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Opening Razorpay</h1>
          <p className="text-slate-600 mb-6">If the payment popup does not open automatically, tap the button below.</p>
          <div className="bg-slate-50 rounded-2xl p-5 text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Reference</span>
              <span className="font-semibold text-slate-800">{paymentData?.registrationCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Student</span>
              <span className="font-semibold text-slate-800">{paymentData?.formData?.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount</span>
              <span className="font-black text-sky-600">Rs. {Number.isFinite(displayAmount) ? displayAmount.toFixed(2) : "0.00"}</span>
            </div>
          </div>
          {checkoutError ? (
            <p className="mt-4 text-sm font-medium text-rose-600">{checkoutError}</p>
          ) : null}
          <Button
            type="button"
            onClick={openCheckout}
            disabled={isStartingCheckout}
            className="mt-6 w-full rounded-full bg-sky-500 py-6 text-base font-bold hover:bg-sky-400"
          >
            {isStartingCheckout ? "Opening Payment Gateway..." : "Continue to Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RazorpayPaymentPage;
