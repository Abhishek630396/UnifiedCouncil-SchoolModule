const {
  createCcaVenuePaymentRequest,
  createSchoolCcaVenuePaymentRequest,
  getSchoolCcaVenuePaymentStatus,
  handleSchoolCcaVenuePaymentResponse,
  handleCcaVenuePaymentResponse,
} = require("../services/paymentService");
const { ensureInvoicePdf } = require("../services/invoiceService");

// Razorpay disabled. Keep controller code commented out for possible future reuse.
// async function createOrder(req, res, next) {
//   try {
//     console.log("[Payment Controller] Create order request", {
//       registrationCode: req.body?.registrationCode || "",
//     });
//     const result = await createRazorpayOrder(req.body || {});
//     res.status(201).json({
//       success: true,
//       message: "Razorpay order created successfully.",
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

async function createCcaVenueInitiation(req, res, next) {
  try {
    console.log("[Payment Controller] CCAvenue initiation request", {
      registrationCode: req.body?.registrationCode || "",
    });
    const result = await createCcaVenuePaymentRequest(req.body || {});
    res.status(201).json({
      success: true,
      message: "CCAvenue payment request created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function handleCcaVenueResponse(req, res, next) {
  try {
    console.log("[Payment Controller] CCAvenue response received", {
      hasEncResp: Boolean(req.body?.encResp),
    });
    const result = await handleCcaVenuePaymentResponse(req.body?.encResp || "");
    console.log("[Payment Controller] CCAvenue redirecting user", {
      status: result.status,
      redirectUrl: result.redirectUrl,
    });
    console.log("[CCAvenue] Final redirect URL:", result.redirectUrl);
    res.set("Location", result.redirectUrl);
    return res.status(302).end();
  } catch (error) {
    return next(error);
  }
}

async function createSchoolCcaVenueInitiation(req, res, next) {
  try {
    const result = await createSchoolCcaVenuePaymentRequest(req.body || {});
    return res.status(201).json({
      success: true,
      message: "CCAvenue payment request created successfully.",
      data: result,
    });
  } catch (error) {
    if (error.code === "EXAM_PRICE_CHANGED") {
      return res.status(409).json({
        success: false,
        code: error.code,
        message: error.message,
        amount: error.amount,
      });
    }
    return next(error);
  }
}

async function getSchoolCcaVenueStatus(req, res, next) {
  try {
    const data = await getSchoolCcaVenuePaymentStatus(req.params.registrationCode);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function handleSchoolCcaVenueResponse(req, res, next) {
  try {
    const result = await handleSchoolCcaVenuePaymentResponse(req.body?.encResp || "");
    res.set("Location", result.redirectUrl);
    return res.status(302).end();
  } catch (error) {
    return next(error);
  }
}

// async function verifyPayment(req, res, next) {
//   try {
//     console.log("[Payment Controller] Verify payment request", {
//       registrationCode: req.body?.registrationCode || "",
//       orderId: req.body?.razorpay_order_id || "",
//       paymentId: req.body?.razorpay_payment_id || "",
//     });
//     const result = await verifyRazorpayPayment(req.body || {});
//     res.json({
//       success: true,
//       message: "Payment verified successfully.",
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// async function markPaymentFailed(req, res, next) {
//   try {
//     console.log("[Payment Controller] Mark payment failed request", {
//       registrationCode: req.body?.registrationCode || "",
//       reason: req.body?.reason || "",
//     });
//     const result = await markRazorpayPaymentFailed(req.body || {});
//     res.json({
//       success: true,
//       message: "Payment failure recorded.",
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

async function downloadInvoice(req, res, next) {
  try {
    const registrationCode = String(req.params?.registrationCode || "").trim();
    const invoice = await ensureInvoicePdf(registrationCode);
    res.download(invoice.invoicePath, invoice.invoiceFilename);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCcaVenueInitiation,
  createSchoolCcaVenueInitiation,
  getSchoolCcaVenueStatus,
  handleSchoolCcaVenueResponse,
  handleCcaVenueResponse,
  downloadInvoice,
};
