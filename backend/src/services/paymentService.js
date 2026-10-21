const axios = require("axios");
const crypto = require("crypto");
const {
  getRegistrationByCode,
  updateRegistrationPaymentStatus,
} = require("../models/registrationModel");
const {
  getSchoolEnrollmentByCode,
  repriceSchoolEnrollment,
  updateSchoolEnrollmentPayment,
} = require("../models/school/studentRegistrationModal");
const { getSchoolRegistrationById } = require("../models/school/schoolRegistrationModal");
const { getExamOptionPrices } = require("../models/pricingModal");
const {
  sendPaymentFailureSms,
  sendPaymentSuccessSms,
} = require("./smsService");
const {
  sendEmailWithHtml,
  sendRegistrationFailureEmail,
} = require("./emailService");
const {
  sendPaymentFailedWhatsApp,
  sendPaymentSuccessWhatsApp,
} = require("./whatsappService");
const { sendUnifiedCouncilEbookEmail } = require("./ebookEmailService");
const { ensureInvoicePdf, getInvoiceDownloadUrl } = require("./invoiceService");
const { generatePaymentSuccessEmailHtml } = require("../templates/paymentSuccessEmail");
const { normalizeStoredPackageList } = require("../utils/packageFormat");

function getPaymentSmsPackageName(registration) {
  return normalizeStoredPackageList(registration?.packagesBought || "registration");
}

function getPaymentSmsAcademicYear() {
  return String(process.env.INTERAKT_ACADEMIC_YEAR || "2026-27").trim();
}

function getPaymentSmsStudentName(registration) {
  return String(registration?.studentName || registration?.parentName || "Student").trim();
}

function getPaymentSmsAmount(registration) {
  const amount = Number(registration?.amount ?? 0);
  return Number.isFinite(amount) ? String(Math.round(amount)) : "0";
}

function getPaymentFailureRetryLink() {
  return (
    process.env.SMS_PAYMENT_FAILURE_LINK ||
    "https://www.unifiedcouncil.com/options.html"
  );
}

function getPaymentWhatsappCourses(registration) {
  return normalizeStoredPackageList(registration?.packagesBought || "registration");
}

function getPaymentWhatsappName(registration) {
  return String(registration?.studentName || registration?.parentName || "Student").trim();
}

function getPaymentWhatsappAmount(registration, overrideAmount) {
  const amount = Number(overrideAmount ?? registration?.amount ?? 0);
  return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
}

function getConfiguredCcaVenueCredentials() {
  const mode = getCcaVenueMode();

  const merchantId = String(
    getFirstDefinedEnvValue([
      `CCAVENUE_${mode.toUpperCase()}_MERCHANT_ID`,
      "CCAVENUE_MERCHANT_ID",
      "REACT_APP_CCAVENUE_MERCHANT_ID",
    ])
  ).trim();

  const accessCode = String(
    getFirstDefinedEnvValue([
      `CCAVENUE_${mode.toUpperCase()}_ACCESS_CODE`,
      "CCAVENUE_ACCESS_CODE",
      "REACT_APP_CCAVENUE_ACCESS_CODE",
    ])
  ).trim();

  const workingKey = String(
    getFirstDefinedEnvValue([
      `CCAVENUE_${mode.toUpperCase()}_WORKING_KEY`,
      "CCAVENUE_WORKING_KEY",
      "REACT_APP_CCAVENUE_WORKING_KEY",
    ])
  ).trim();

  return {
    merchantId,
    accessCode,
    workingKey,
    mode,
  };
}

function getCcaVenueGatewayUrl() {
  const mode = getCcaVenueMode();
  const defaultUrl =
    mode === "test"
      ? "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"
      : "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

  return String(
    getFirstDefinedEnvValue([
      `CCAVENUE_${mode.toUpperCase()}_PAYMENT_URL`,
      "CCAVENUE_PAYMENT_URL",
      defaultUrl,
    ])
  ).trim();
}

function getCcaVenueMode() {
  const rawMode = String(process.env.CCAVENUE_MODE || "").trim().toLowerCase();
  return rawMode === "test" ? "test" : "live";
}

function getFirstDefinedEnvValue(keys = []) {
  for (const key of keys) {
    if (typeof key !== "string") {
      continue;
    }

    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      if (!key.includes("://")) {
        continue;
      }
      return key;
    }

    const value = process.env[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return "";
}

function buildCcaVenueRedirectUrl() {
  return String(
    process.env.CCAVENUE_REDIRECT_URL ||
      `${String(process.env.BACKEND_PUBLIC_URL || "http://localhost:5000").trim().replace(/\/$/, "")}/api/payments/ccavenue/response`
  ).trim();
}

function buildCcaVenueRequestQuery(payload) {
  return Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");
}

function encryptCcaVenueRequest(plainText, workingKey) {
  const key = crypto.createHash("md5").update(String(workingKey || ""), "utf8").digest();
  const iv = Buffer.from(Array.from({ length: 16 }, (_, index) => index));
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(String(plainText || ""), "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decryptCcaVenueResponse(encResp, workingKey) {
  const key = crypto.createHash("md5").update(String(workingKey || ""), "utf8").digest();
  const iv = Buffer.from(Array.from({ length: 16 }, (_, index) => index));
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let decrypted = decipher.update(String(encResp || ""), "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function parseCcaVenueResponse(encResp, workingKey) {
  const decrypted = decryptCcaVenueResponse(encResp, workingKey);
  const params = new URLSearchParams(decrypted);
  const data = {};

  for (const [key, value] of params.entries()) {
    data[key] = value;
  }

  return data;
}

function getFrontendBaseUrl() {
  const configuredFrontendUrls = String(process.env.FRONTEND_URLS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return String(
    process.env.CCAVENUE_FRONTEND_URL ||
      process.env.FRONTEND_URL ||
      configuredFrontendUrls[0] ||
      "http://localhost:3000"
  ).trim().replace(/\/$/, "");
}

function getConfiguredFrontendRedirectUrl(pathname) {
  const normalizedPathname = String(pathname || "").trim();
  const isSuccessPath = normalizedPathname === "/payment-success";
  const explicitUrl = String(
    isSuccessPath
      ? process.env.CCAVENUE_SUCCESS_URL || ""
      : process.env.CCAVENUE_FAILURE_URL || ""
  ).trim();

  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  return `${getFrontendBaseUrl()}${normalizedPathname}`;
}

function buildFrontendPaymentRedirect(pathname, paymentData = {}) {
  const redirectUrl = getConfiguredFrontendRedirectUrl(pathname);
  const params = new URLSearchParams();

  Object.entries(paymentData).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    params.set(key, String(value));
  });

  return `${redirectUrl}${params.toString() ? `?${params.toString()}` : ""}`;
}

function getUniqueNonEmptyValues(values = []) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function getRazorpayTransactionReference(payment = {}) {
  const acquirerData = payment?.acquirer_data || {};
  const candidates = [
    acquirerData.bank_rrn,
    acquirerData.rrn,
    acquirerData.bank_transaction_id,
    acquirerData.upi_transaction_id,
    acquirerData.reference16,
    acquirerData.arn,
  ];

  return candidates.map((value) => String(value || "").trim()).find(Boolean) || "";
}

async function generateInvoiceWithFallback(registration, fallbackCode) {
  const candidateCodes = getUniqueNonEmptyValues([
    fallbackCode,
    registration?.registrationCode,
    registration?.transactionId,
  ]);

  let lastError = null;

  for (const candidateCode of candidateCodes) {
    try {
      return await ensureInvoicePdf(candidateCode);
    } catch (error) {
      lastError = error;
      console.error("[Invoice] Invoice generation attempt failed:", {
        candidateCode,
        message: error?.message || null,
      });
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
}

async function createCcaVenuePaymentRequest(payload = {}) {
  const {
    registrationCode,
    formData = {},
    cart = [],
    selectedClass = "",
  } = payload;

  const normalizedRegistrationCode = String(registrationCode || "").trim();
  if (!normalizedRegistrationCode) {
    throw new Error("Registration code is required for CCAvenue payment.");
  }

  const credentials = getConfiguredCcaVenueCredentials();
  if (!credentials.merchantId || !credentials.accessCode || !credentials.workingKey) {
    throw new Error("CCAvenue credentials are not configured on the backend.");
  }

  const registration = await getRegistrationByCode(normalizedRegistrationCode);
  if (!registration) {
    throw new Error("Registration not found for the provided registration code.");
  }

  const payableAmount = Number(registration?.amount ?? 0);
  if (!Number.isFinite(payableAmount) || payableAmount <= 0) {
    throw new Error("The registration does not have a valid server-calculated payment amount.");
  }

  const redirectUrl = buildCcaVenueRedirectUrl();
  const normalizedCart = Array.isArray(cart) ? cart : [];
  const packageLabel = normalizedCart
    .map((item) => `${item.examName || ""}-${item.optionName || ""}`.trim())
    .filter(Boolean)
    .join(", ");

  const requestPayload = {
    merchant_id: credentials.merchantId,
    order_id: normalizedRegistrationCode,
    currency: "INR",
    amount: payableAmount.toFixed(2),
    redirect_url: redirectUrl,
    cancel_url: redirectUrl,
    language: "EN",
    billing_name: formData.parentName || formData.studentName || registration.parentName || registration.studentName || "",
    billing_address: `${formData.address1 || ""} ${formData.address2 || ""}`.trim(),
    billing_city: formData.city || "",
    billing_state: formData.state || "",
    billing_zip: formData.pincode || "",
    billing_country: "India",
    billing_tel: formData.mobile || registration.mobile || "",
    billing_email: formData.email || registration.email || "",
    delivery_name: formData.parentName || formData.studentName || registration.parentName || registration.studentName || "",
    delivery_address: `${formData.address1 || ""} ${formData.address2 || ""}`.trim(),
    delivery_city: formData.city || "",
    delivery_state: formData.state || "",
    delivery_zip: formData.pincode || "",
    delivery_country: "India",
    delivery_tel: formData.mobile || registration.mobile || "",
    merchant_param1: normalizedRegistrationCode,
    merchant_param2: formData.studentName || registration.studentName || "",
    merchant_param3: selectedClass || registration.className || "",
    merchant_param4: packageLabel || registration.packagesBought || "",
    merchant_param5: formData.schoolName || "",
  };

  const requestQuery = buildCcaVenueRequestQuery(requestPayload);
  const encRequest = encryptCcaVenueRequest(requestQuery, credentials.workingKey);

  return {
    paymentUrl: getCcaVenueGatewayUrl(),
    accessCode: credentials.accessCode,
    encRequest,
    orderId: normalizedRegistrationCode,
  };
}

async function createSchoolCcaVenuePaymentRequest(payload = {}) {
  const registrationCode = String(payload.registrationCode || "").trim();
  if (!registrationCode) {
    const error = new Error("Registration code is required for CCAvenue payment.");
    error.statusCode = 400;
    throw error;
  }

  const credentials = getConfiguredCcaVenueCredentials();
  if (!credentials.merchantId || !credentials.accessCode || !credentials.workingKey) {
    throw new Error("CCAvenue credentials are not configured on the backend.");
  }

  const registration = await getSchoolEnrollmentByCode(registrationCode);
  if (!registration) {
    const error = new Error("Student registration was not found.");
    error.statusCode = 404;
    throw error;
  }
  if (registration.status.toLowerCase() === "success" || registration.status.toLowerCase() === "completed") {
    const error = new Error("This student registration has already been paid.");
    error.statusCode = 409;
    throw error;
  }
  const currentPrices = await getExamOptionPrices();
  const repriced = await repriceSchoolEnrollment(registrationCode, currentPrices);
  const payableAmount = Number(repriced.amount);
  if (!Number.isFinite(payableAmount) || payableAmount <= 0) {
    const error = new Error("A valid payment amount is not configured for this registration.");
    error.statusCode = 400;
    throw error;
  }
  if (payload.expectedAmount !== undefined) {
    const expectedAmount = Number(payload.expectedAmount);
    if (!Number.isFinite(expectedAmount) || expectedAmount < 0) {
      const error = new Error("The displayed payment amount is invalid. Please refresh and try again.");
      error.statusCode = 400;
      throw error;
    }
    if (Math.abs(expectedAmount - payableAmount) >= 0.01) {
      const error = new Error("Exam prices have changed. Review the updated total before continuing to payment.");
      error.statusCode = 409;
      error.code = "EXAM_PRICE_CHANGED";
      error.amount = payableAmount;
      throw error;
    }
  }

  const school = await getSchoolRegistrationById(registration.schoolId);
  const callbackUrl = buildCcaVenueRedirectUrl();
  const address = `${registration.address1} ${registration.address2}`.trim();
  const requestPayload = {
    merchant_id: credentials.merchantId,
    order_id: registration.registrationCode,
    currency: "INR",
    amount: payableAmount.toFixed(2),
    redirect_url: callbackUrl,
    cancel_url: callbackUrl,
    language: "EN",
    billing_name: registration.parentName || registration.studentName,
    billing_address: address,
    billing_city: registration.city,
    billing_state: registration.state,
    billing_zip: registration.pincode,
    billing_country: "India",
    billing_tel: registration.mobile,
    billing_email: registration.email,
    delivery_name: registration.parentName || registration.studentName,
    delivery_address: address,
    delivery_city: registration.city,
    delivery_state: registration.state,
    delivery_zip: registration.pincode,
    delivery_country: "India",
    delivery_tel: registration.mobile,
    merchant_param1: registration.registrationCode,
    merchant_param2: registration.studentName,
    merchant_param3: registration.className,
    merchant_param4: registration.packagesBought,
    merchant_param5: school?.schoolName || "",
  };
  const encRequest = encryptCcaVenueRequest(
    buildCcaVenueRequestQuery(requestPayload),
    credentials.workingKey
  );

  return {
    paymentUrl: getCcaVenueGatewayUrl(),
    accessCode: credentials.accessCode,
    encRequest,
    orderId: registration.registrationCode,
    registrationCode: registration.registrationCode,
    amount: payableAmount,
  };
}

async function getSchoolCcaVenuePaymentStatus(registrationCode) {
  const registration = await getSchoolEnrollmentByCode(registrationCode);
  if (!registration) {
    const error = new Error("Student registration was not found.");
    error.statusCode = 404;
    throw error;
  }
  return {
    registrationCode: registration.registrationCode,
    amount: registration.amount,
    status: registration.status,
  };
}

async function handleSchoolCcaVenuePaymentResponse(encResp = "") {
  const credentials = getConfiguredCcaVenueCredentials();
  if (!credentials.workingKey) {
    throw new Error("CCAvenue working key is not configured on the backend.");
  }
  if (!String(encResp || "").trim()) {
    throw new Error("CCAvenue response payload is missing.");
  }

  const response = parseCcaVenueResponse(encResp, credentials.workingKey);
  const registrationCode = String(response.order_id || response.merchant_param1 || "").trim();
  if (!registrationCode) {
    throw new Error("CCAvenue response did not include an order id.");
  }

  const registration = await getSchoolEnrollmentByCode(registrationCode);
  if (!registration) {
    const error = new Error("Student registration was not found for the CCAvenue response.");
    error.statusCode = 404;
    throw error;
  }

  return finalizeSchoolCcaVenuePayment(response, registrationCode, registration);
}

async function finalizeSchoolCcaVenuePayment(response, registrationCode, registration) {
  const orderStatus = String(response.order_status || "").trim();
  const gatewaySucceeded = orderStatus.toLowerCase() === "success";
  const gatewayAmount = Number(response.amount);
  const expectedAmount = Number(registration.amount);
  const amountMatches = Number.isFinite(gatewayAmount) && Number.isFinite(expectedAmount) &&
    Math.abs(gatewayAmount - expectedAmount) < 0.01;
  const amountMismatch = gatewaySucceeded && !amountMatches;
  const normalizedStatus = gatewaySucceeded && !amountMismatch
    ? "Success"
    : ["aborted", "failure"].includes(orderStatus.toLowerCase())
      ? "Failure"
      : amountMismatch
        ? "Failure"
        : "Pending";
  await updateSchoolEnrollmentPayment(
    registrationCode,
    normalizedStatus,
    amountMismatch ? "CCAvenue payment amount did not match the registration total" : orderStatus || "CCAvenue response received"
  );

  const paymentOutcome = normalizedStatus === "Success"
    ? "success"
    : normalizedStatus === "Failure"
      ? "failed"
      : "pending";
  const params = new URLSearchParams({
    registrationCode,
    payment: paymentOutcome,
    ...(response.tracking_id ? { transactionId: String(response.tracking_id) } : {}),
    ...(paymentOutcome !== "success"
      ? { error: amountMismatch ? "The payment amount could not be verified. Please contact support." : orderStatus || "Your payment could not be completed." }
      : {}),
  });
  const redirectUrl = `${getFrontendBaseUrl()}/student-registration-through-school/payment/${paymentOutcome === "success" ? "success" : "failed"}?${params.toString()}`;

  return { status: normalizedStatus, redirectUrl };
}

async function handleCcaVenuePaymentResponse(encResp = "") {
  const credentials = getConfiguredCcaVenueCredentials();
  if (!credentials.workingKey) {
    throw new Error("CCAvenue working key is not configured on the backend.");
  }

  if (!String(encResp || "").trim()) {
    throw new Error("CCAvenue response payload is missing.");
  }

  const response = parseCcaVenueResponse(encResp, credentials.workingKey);
  const registrationCode = String(
    response.order_id ||
      response.merchant_param1 ||
      ""
  ).trim();

  if (!registrationCode) {
    throw new Error("CCAvenue response did not include an order id.");
  }

  const schoolRegistration = await getSchoolEnrollmentByCode(registrationCode);
  if (schoolRegistration) {
    return finalizeSchoolCcaVenuePayment(response, registrationCode, schoolRegistration);
  }

  const registration = await getRegistrationByCode(registrationCode);
  if (!registration) {
    const error = new Error("Registration was not found for the CCAvenue response.");
    error.statusCode = 404;
    throw error;
  }
  const orderStatus = String(response.order_status || "").trim();
  const gatewaySucceeded = orderStatus.toLowerCase() === "success";
  const gatewayAmount = Number(response.amount);
  const expectedAmount = Number(registration.amount);
  const amountMismatch = gatewaySucceeded && (
    !Number.isFinite(gatewayAmount) ||
    !Number.isFinite(expectedAmount) ||
    Math.abs(gatewayAmount - expectedAmount) >= 0.01
  );
  const normalizedStatus = gatewaySucceeded && !amountMismatch
      ? "Success"
      : orderStatus.toLowerCase() === "aborted" || orderStatus.toLowerCase() === "failure"
        ? "Failure"
        : amountMismatch
          ? "Failure"
          : "Pending";

  const transactionId = String(
    response.tracking_id ||
      response.bank_ref_no ||
      response.order_id ||
      ""
  ).trim();

  await updateRegistrationPaymentStatus({
    registrationCode,
    status: normalizedStatus,
    message: amountMismatch ? "CCAvenue payment amount did not match the registration total" : orderStatus || "CCAvenue response received",
    userStatus: normalizedStatus === "Success" ? 2 : normalizedStatus === "Failure" ? 3 : 1,
    transactionId,
  });

  const refreshedRegistration = (await getRegistrationByCode(registrationCode)) || registration || {};
  let immediateInvoiceResult = {
    invoiceUrl: null,
    invoiceBreakdown: null,
  };

  if (normalizedStatus === "Success") {
    try {
      const generatedInvoice = await generateInvoiceWithFallback(refreshedRegistration, registrationCode);
      immediateInvoiceResult = {
        invoiceUrl:
          generatedInvoice?.invoiceUrl ||
          getInvoiceDownloadUrl(refreshedRegistration?.registrationCode || registrationCode),
        invoiceBreakdown: generatedInvoice?.invoiceData || null,
      };
    } catch (error) {
      console.error("[Invoice] CCAvenue success invoice generation failed:", {
        registrationCode: refreshedRegistration?.registrationCode || registrationCode,
        transactionId: refreshedRegistration?.transactionId || transactionId,
        message: error?.message || "Unknown invoice generation error",
      });
      immediateInvoiceResult.invoiceUrl =
        getInvoiceDownloadUrl(refreshedRegistration?.registrationCode || registrationCode);
    }

    runBackgroundTask("CCAvenue payment success notifications", async () => {
      await notifyPaymentSuccess(refreshedRegistration, registrationCode);
    });
  } else if (normalizedStatus === "Failure") {
    runBackgroundTask("CCAvenue payment failure notifications", async () => {
      await notifyPaymentFailure(refreshedRegistration);
    });
  }

  const paymentData = {
    registrationCode,
    transactionId,
    amount: refreshedRegistration?.amount ?? response.amount ?? "",
    studentName: refreshedRegistration?.studentName || response.merchant_param2 || "",
    invoiceUrl: immediateInvoiceResult.invoiceUrl || null,
    error:
      normalizedStatus === "Success"
        ? ""
        : amountMismatch
          ? "The payment amount could not be verified. Please contact support."
          : orderStatus || "Your payment could not be completed.",
  };

  return {
    status: normalizedStatus,
    redirectUrl:
      normalizedStatus === "Success"
        ? buildFrontendPaymentRedirect("/payment-success", paymentData)
        : buildFrontendPaymentRedirect("/payment-failure", paymentData),
    paymentData,
    response,
  };
}

async function notifyPaymentFailureEmail(registration) {
  if (!registration?.email) {
    return;
  }

  try {
    await sendRegistrationFailureEmail({
      email: registration.email,
      student_name: getPaymentWhatsappName(registration),
      registration_code: registration.registrationCode,
      mobile: registration.mobile || "",
      amount: getPaymentWhatsappAmount(registration),
      courses: getPaymentWhatsappCourses(registration) || getPaymentSmsPackageName(registration),
    });
  } catch (error) {
    console.error("[Email] Payment failure email failed:", error.message);
  }
}

async function notifyPaymentSuccess(registration, fallbackRegistrationCode = "", preGeneratedInvoice = null) {
  let invoice = preGeneratedInvoice;
  const effectiveRegistrationCode = String(
    registration?.registrationCode || fallbackRegistrationCode || registration?.transactionId || ""
  ).trim();
  const invoiceUrl = getInvoiceDownloadUrl(effectiveRegistrationCode);

  if (!invoice) {
    try {
      invoice = await generateInvoiceWithFallback(registration, fallbackRegistrationCode);
    } catch (error) {
      console.error("[Invoice] Payment success invoice generation failed:", error.message);
    }
  }

  if (registration?.mobile) {
    try {
      await sendPaymentSuccessSms(
        registration.mobile,
        {
          academicYear: getPaymentSmsAcademicYear(),
          studentName: getPaymentSmsStudentName(registration),
          registrationCode: registration.registrationCode || "",
          mobile: registration.mobile || "",
          amount: getPaymentSmsAmount(registration),
          examsRegistered: getPaymentSmsPackageName(registration),
        }
      );
    } catch (error) {
      console.error("[SMS] Payment success SMS failed:", error.message);
    }
  }

  if (registration?.mobile) {
    try {
      await sendPaymentSuccessWhatsApp({
        phoneNumber: registration.mobile,
        student_name: getPaymentWhatsappName(registration),
        registration_code: registration.registrationCode,
        mobile: registration.mobile,
        amount: getPaymentWhatsappAmount(registration),
        courses: getPaymentWhatsappCourses(registration),
      });
    } catch (error) {
      console.error("[WhatsApp] Payment success notification failed:", error.message);
    }
  }

  if (registration?.email) {
    try {
      await sendEmailWithHtml({
        email: registration.email,
        subject: `Unified Council Registration Confirmation - ${effectiveRegistrationCode}`,
        htmlContent: generatePaymentSuccessEmailHtml({
          student_name: getPaymentWhatsappName(registration),
          courses: getPaymentWhatsappCourses(registration),
          registration_code: effectiveRegistrationCode,
          transaction_id: registration?.transactionId || "",
          mobile: registration.mobile || "",
          amount: getPaymentWhatsappAmount(registration),
          invoice_url: invoice?.invoiceUrl || invoiceUrl,
          invoice_breakdown: invoice?.invoiceData?.summary || null,
          invoice_rows: invoice?.invoiceData?.rows || [],
        }),
        logLabel: "payment success",
      });
    } catch (error) {
      console.error("[Email] Payment success email failed:", error.message);
    }

    try {
      await sendUnifiedCouncilEbookEmail({
        registrationCode: registration.registrationCode,
        email: registration.email,
      });
    } catch (error) {
      console.error("[Email] Ebook email failed after payment success:", error.message);
    }
  }

  return {
    invoiceUrl: invoice?.invoiceUrl || invoiceUrl || null,
    invoiceBreakdown: invoice?.invoiceData || null,
  };
}

function runBackgroundTask(taskName, taskFactory) {
  Promise.resolve()
    .then(taskFactory)
    .catch((error) => {
      console.error(`[Background] ${taskName} failed:`, error?.message || error);
    });
}

async function notifyPaymentFailure(registration) {
  if (!registration?.mobile) {
    await notifyPaymentFailureEmail(registration);
    return;
  }

  try {
    await sendPaymentFailureSms(
      registration.mobile,
      getPaymentSmsPackageName(registration),
      getPaymentFailureRetryLink()
    );
  } catch (error) {
    console.error("[SMS] Payment failure SMS failed:", error.message);
  }

  try {
    await sendPaymentFailedWhatsApp({
      phoneNumber: registration.mobile,
      courses: getPaymentWhatsappCourses(registration),
    });
  } catch (error) {
    console.error("[WhatsApp] Payment failure notification failed:", error.message);
  }

  await notifyPaymentFailureEmail(registration);
}

function getRazorpayConfig() {
  const nodeEnv = String(process.env.NODE_ENV || "").trim().toLowerCase();
  const configuredMode = String(process.env.RAZORPAY_MODE || "").trim().toLowerCase();
  const effectiveMode = configuredMode || (nodeEnv === "production" ? "live" : "test");
  const testKeyId = process.env.RAZORPAY_TEST_KEY_ID;
  const testKeySecret = process.env.RAZORPAY_TEST_KEY_SECRET;
  const liveKeyId = process.env.RAZORPAY_LIVE_KEY_ID;
  const liveKeySecret = process.env.RAZORPAY_LIVE_KEY_SECRET;

  // let keyId = process.env.RAZORPAY_KEY_ID;
  // let keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.KEY_SECRET;

  if (effectiveMode === "test") {
    keyId = testKeyId || keyId;
    keySecret = testKeySecret || keySecret;
  } else if (effectiveMode === "live") {
    keyId = liveKeyId || keyId;
    keySecret = liveKeySecret || keySecret;
  }

  if (!keyId || !keySecret) {
    const error = new Error("Razorpay credentials are not configured on the server.");
    error.statusCode = 500;
    throw error;
  }

  return { keyId, keySecret };
}

function sanitizeAmount(amount) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    const error = new Error("A valid payment amount is required.");
    error.statusCode = 400;
    throw error;
  }

  return Math.round(numeric * 100);
}

async function createRazorpayOrder({ registrationCode, amount, customerName, customerEmail, customerPhone }) {
  if (!registrationCode) {
    const error = new Error("registrationCode is required.");
    error.statusCode = 400;
    throw error;
  }

  const registration = await getRegistrationByCode(registrationCode);
  if (!registration) {
    const error = new Error("Registration not found.");
    error.statusCode = 404;
    throw error;
  }

  const { keyId, keySecret } = getRazorpayConfig();
  const authoritativeAmount = Number(registration.amount ?? amount ?? 0);
  const amountInPaise = sanitizeAmount(authoritativeAmount);

  console.log("[Razorpay] Creating order", {
    registrationCode,
    mode: keyId.startsWith("rzp_live_") ? "live" : keyId.startsWith("rzp_test_") ? "test" : "unknown",
    keyPrefix: keyId ? keyId.slice(0, 12) : "not-configured",
  });

  let response;
  try {
    response = await axios.post(
      "https://api.razorpay.com/v1/orders",
      {
        amount: amountInPaise,
        currency: "INR",
        receipt: String(registrationCode).slice(0, 40),
        payment_capture: 1,
        notes: {
          registrationCode,
          studentName: customerName || registration.studentName || "",
          email: customerEmail || registration.email || "",
          mobile: customerPhone || registration.mobile || "",
        },
      },
      {
        auth: {
          username: keyId,
          password: keySecret,
        },
      }
    );
  } catch (error) {
    const razorpayMessage =
      error.response?.data?.error?.description ||
      error.response?.data?.error?.reason ||
      error.response?.data?.error?.code ||
      error.message;

    console.error("[Razorpay] Order creation failed", {
      registrationCode,
      status: error.response?.status || null,
      mode: keyId.startsWith("rzp_live_") ? "live" : keyId.startsWith("rzp_test_") ? "test" : "unknown",
      keyPrefix: keyId ? keyId.slice(0, 12) : "not-configured",
      message: razorpayMessage,
    });

    const serviceError = new Error(`Razorpay order creation failed: ${razorpayMessage}`);
    serviceError.statusCode = error.response?.status || 502;
    throw serviceError;
  }

  return {
    key: keyId,
    orderId: response.data.id,
    amount: response.data.amount,
    displayAmount: authoritativeAmount,
    currency: response.data.currency,
    registrationCode,
    studentName: registration.studentName,
    email: registration.email,
    mobile: registration.mobile,
  };
}

async function verifyRazorpayPayment({
  registrationCode,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  if (!registrationCode || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    const error = new Error("Missing Razorpay verification fields.");
    error.statusCode = 400;
    throw error;
  }

  const registration = await getRegistrationByCode(registrationCode);
  if (!registration) {
    const error = new Error("Registration not found.");
    error.statusCode = 404;
    throw error;
  }

  const { keySecret, keyId } = getRazorpayConfig();
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    await updateRegistrationPaymentStatus({
      registrationCode,
      status: "Failure",
      message: "Razorpay signature verification failed",
      userStatus: 3,
      transactionId: razorpay_payment_id,
    });
    await notifyPaymentFailure(registration);

    const error = new Error("Razorpay signature verification failed.");
    error.statusCode = 400;
    throw error;
  }

  const paymentResponse = await axios.get(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
    auth: {
      username: keyId,
      password: keySecret,
    },
  });

  const payment = paymentResponse.data;
  const transactionReference = getRazorpayTransactionReference(payment);
  if (payment.order_id !== razorpay_order_id) {
    const error = new Error("Payment order mismatch.");
    error.statusCode = 400;
    throw error;
  }

  const isCaptured = payment.status === "captured";
  if (isCaptured && !transactionReference) {
    console.warn("[Razorpay] Captured payment is missing RRN/acquirer reference.", {
      registrationCode,
      paymentId: razorpay_payment_id,
      acquirerData: payment?.acquirer_data || null,
    });
  }
  await updateRegistrationPaymentStatus({
    registrationCode,
    status: isCaptured ? "Success" : "Failure",
    message: isCaptured ? "Paid via Razorpay" : `Payment ${payment.status}`,
    userStatus: isCaptured ? 2 : 3,
    transactionId: transactionReference,
  });

  if (isCaptured) {
    const refreshedRegistration = (await getRegistrationByCode(registrationCode)) || registration;
    let generatedInvoice = null;

    try {
      generatedInvoice = await generateInvoiceWithFallback(refreshedRegistration, registrationCode);
      console.log("[Invoice] Payment verification generated invoice:", {
        registrationCode: refreshedRegistration?.registrationCode || registrationCode,
        transactionId: refreshedRegistration?.transactionId || "",
        invoicePath: generatedInvoice?.invoicePath || "",
        invoiceFilename: generatedInvoice?.invoiceFilename || "",
      });
    } catch (error) {
      console.error("[Invoice] Payment verification invoice generation failed:", {
        registrationCode: refreshedRegistration?.registrationCode || registrationCode,
        transactionId: refreshedRegistration?.transactionId || "",
        message: error?.message || "Unknown invoice generation error",
      });
    }

    const immediateResult = {
      invoiceUrl: generatedInvoice?.invoiceUrl || getInvoiceDownloadUrl(refreshedRegistration?.registrationCode || registrationCode),
      invoiceBreakdown: generatedInvoice?.invoiceData || null,
    };

    runBackgroundTask("payment success notifications", async () => {
      await notifyPaymentSuccess(refreshedRegistration, registrationCode, generatedInvoice);
    });

    return {
      success: true,
      registrationCode: refreshedRegistration?.registrationCode || registrationCode,
      paymentId: razorpay_payment_id,
      transactionId: refreshedRegistration?.transactionId || "",
      orderId: razorpay_order_id,
      paymentStatus: payment.status,
      amount: Number(payment.amount || 0) / 100,
      invoiceUrl: immediateResult.invoiceUrl || null,
      invoiceBreakdown: immediateResult.invoiceBreakdown || null,
    };
  } else {
    runBackgroundTask("payment failure notifications", async () => {
      await notifyPaymentFailure(registration);
    });
  }

  return {
    success: true,
    registrationCode,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    paymentStatus: payment.status,
    amount: Number(payment.amount || 0) / 100,
  };
}

async function markRazorpayPaymentFailed({ registrationCode, reason }) {
  if (!registrationCode) {
    const error = new Error("registrationCode is required.");
    error.statusCode = 400;
    throw error;
  }

  const registration = await getRegistrationByCode(registrationCode);
  if (!registration) {
    const error = new Error("Registration not found.");
    error.statusCode = 404;
    throw error;
  }

  await updateRegistrationPaymentStatus({
    registrationCode,
    status: "Failure",
    message: reason || "Payment failed or cancelled",
    userStatus: 3,
  });

  await notifyPaymentFailure(registration);

  return { success: true };
}

module.exports = {
  createCcaVenuePaymentRequest,
  createSchoolCcaVenuePaymentRequest,
  getSchoolCcaVenuePaymentStatus,
  handleSchoolCcaVenuePaymentResponse,
  handleCcaVenuePaymentResponse,
  createRazorpayOrder,
  verifyRazorpayPayment,
  markRazorpayPaymentFailed,
};
