import axios from "axios";

let razorpayScriptPromise;

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve();
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      script.onerror = () => {
        razorpayScriptPromise = null;
        reject(new Error("Unable to load Razorpay checkout."));
      };
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}

export async function openRazorpayCheckout(order) {
  await loadRazorpayScript();
  if (!order?.key || !order?.orderId) {
    throw new Error("Razorpay did not return complete payment details.");
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    const settle = (callback, value) => {
      if (settled) return;
      settled = true;
      callback(value);
    };
    const checkout = new window.Razorpay({
      key: order.key,
      amount: order.amount,
      currency: order.currency || "INR",
      order_id: order.orderId,
      name: "Unified Council",
      description: `Student registration ${order.registrationCode}`,
      prefill: {
        name: order.studentName || "",
        email: order.email || "",
        contact: order.mobile || "",
      },
      theme: { color: "#0ea5e9" },
      modal: {
        ondismiss: () => settle(reject, new Error("Payment was cancelled before completion.")),
      },
      handler: (response) => settle(resolve, response),
    });
    checkout.on("payment.failed", (response) => {
      settle(
        reject,
        new Error(response.error?.description || "Payment failed.")
      );
    });
    checkout.open();
  });
}

export async function verifyOrReconcileSchoolPayment(apiBaseUrl, order, checkoutResponse) {
  let verificationError = "";
  if (checkoutResponse?.razorpay_order_id && checkoutResponse?.razorpay_payment_id && checkoutResponse?.razorpay_signature) {
    try {
      const response = await axios.post(`${apiBaseUrl}/payments/razorpay/school/verify`, {
        registrationCode: order.registrationCode,
        razorpay_order_id: checkoutResponse.razorpay_order_id,
        razorpay_payment_id: checkoutResponse.razorpay_payment_id,
        razorpay_signature: checkoutResponse.razorpay_signature,
      });
      if (response.data?.data?.status === "Success") {
        return response.data.data;
      }
    } catch (error) {
      verificationError =
        error.response?.data?.message || error.message || "Payment verification could not be completed.";
    }
  }

  const response = await axios.post(`${apiBaseUrl}/payments/razorpay/school/reconcile`, {
    registrationCode: order.registrationCode,
    razorpay_order_id: order.orderId,
  });
  return {
    ...response.data?.data,
    error: verificationError,
  };
}
