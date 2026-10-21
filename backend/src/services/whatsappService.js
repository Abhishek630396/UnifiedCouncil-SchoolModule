const axios = require("axios");

const INTERAKT_MESSAGE_URL = "https://api.interakt.ai/v1/public/message/";

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required WhatsApp configuration: ${name}`);
  }

  return value;
}

function maskApiKey(value) {
  if (!value) {
    return "";
  }

  return `${String(value).slice(0, 6)}******`;
}

function getOptionalEnv(name, fallback = "") {
  const value = process.env[name];
  return value === undefined ? fallback : value;
}

function normalizePhoneNumber(phoneNumber) {
  return String(phoneNumber || "").replace(/\D/g, "").slice(-10);
}

function normalizeBodyValues(bodyValues = []) {
  return bodyValues.map((value) => String(value ?? "").trim());
}

async function sendWhatsApp({
  phoneNumber,
  templateName,
  bodyValues = [],
  callbackData = "UnifiedCouncil",
  languageCode = "en",
  countryCode = "+91",
}) {
  const apiKey = getRequiredEnv("INTERAKT_API_KEY");
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  if (!normalizedPhoneNumber || normalizedPhoneNumber.length !== 10) {
    const error = new Error("A valid 10-digit WhatsApp phone number is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!templateName) {
    const error = new Error("templateName is required for WhatsApp notifications.");
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    countryCode,
    phoneNumber: normalizedPhoneNumber,
    callbackData,
    type: "Template",
    template: {
      name: templateName,
      languageCode,
      bodyValues: normalizeBodyValues(bodyValues),
    },
  };

  console.log("[Interakt] WhatsApp request started", {
    phoneNumber: normalizedPhoneNumber,
    templateName,
    status: "running",
    authorization: maskApiKey(apiKey),
  });

  try {
    const response = await axios.post(INTERAKT_MESSAGE_URL, payload, {
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      validateStatus: () => true,
    });

    console.log("[Interakt] WhatsApp response", {
      status: response.status,
      ok: response.status >= 200 && response.status < 300,
      templateName,
      phoneNumber: normalizedPhoneNumber,
      queued: Boolean(response.data?.result),
      messageId: response.data?.id || "",
      message: response.data?.message || "",
    });

    if (response.status < 200 || response.status >= 300) {
      const error = new Error("Interakt API request failed.");
      error.statusCode = response.status;
      error.details = response.data;
      throw error;
    }

    return response.data;
  } catch (error) {
    console.error("[Interakt] WhatsApp send failed", {
      templateName,
      phoneNumber: normalizedPhoneNumber,
      message: error.message,
      statusCode: error.statusCode || error.response?.status || null,
      details: error.details || error.response?.data || null,
    });
    throw error;
  }
}

async function sendPaymentSuccessWhatsApp({
  phoneNumber,
  student_name,
  registration_code,
  mobile,
  amount,
  courses,
}) {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const academicYear = getOptionalEnv("INTERAKT_ACADEMIC_YEAR", "2026-27").trim();
  const bodyValues = [
    String(student_name || "").trim(),
    String(student_name || "").trim(),
    String(registration_code || "").trim(),
    String(mobile || normalizedPhoneNumber).trim(),
    String(amount || "").trim(),
    String(courses || "").trim(),
    academicYear,
  ];

  console.log("[Interakt] Payment success template payload", {
    templateName: getOptionalEnv("INTERAKT_PAYMENT_SUCCESS_TEMPLATE_NAME", "exam_reg_payment_success"),
    phoneNumber: normalizedPhoneNumber,
    bodyValues,
  });

  return sendWhatsApp({
    phoneNumber,
    templateName: getOptionalEnv("INTERAKT_PAYMENT_SUCCESS_TEMPLATE_NAME", "exam_reg_payment_success"),
    bodyValues,
  });
}

async function sendPaymentFailedWhatsApp({
  phoneNumber,
  courses,
}) {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const bodyValues = [
    String(courses || "").trim(),
  ];

  console.log("[Interakt] Payment failed template payload", {
    templateName: getOptionalEnv("INTERAKT_PAYMENT_FAILED_TEMPLATE_NAME", "exam_reg_payment_failed"),
    phoneNumber: normalizedPhoneNumber,
    bodyValues,
  });

  return sendWhatsApp({
    phoneNumber,
    templateName: getOptionalEnv("INTERAKT_PAYMENT_FAILED_TEMPLATE_NAME", "exam_reg_payment_failed"),
    bodyValues,
  });
}

async function sendOtpWhatsApp({ phoneNumber, otp }) {
  const templateName = getOptionalEnv("INTERAKT_OTP_TEMPLATE_NAME", "").trim();

  if (!templateName) {
    console.log("[Interakt] OTP WhatsApp skipped", {
      phoneNumber: normalizePhoneNumber(phoneNumber),
      status: "not-configured",
    });
    return null;
  }

  return sendWhatsApp({
    phoneNumber,
    templateName,
    bodyValues: [otp],
  });
}

module.exports = {
  sendWhatsApp,
  sendPaymentSuccessWhatsApp,
  sendPaymentFailedWhatsApp,
  sendOtpWhatsApp,
};
