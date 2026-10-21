const axios = require("axios");

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required SMS configuration: ${name}`);
  }
  return value;
}

function buildOtpMessage(otp) {
  const template =
    process.env.SMS_OTP_TEMPLATE ||
    "Your OTP for login is {#var#}. Do not share this OTP with anyone. It is valid for 5 minutes. - UnifiedCouncil.com";

  return template
    .replace(/\{#var#\}/g, otp)
    .replace(/\{otp\}/gi, otp);
}

function replaceTemplateVariables(template, variables = []) {
  let index = 0;

  return String(template || "")
    .replace(/\{#var#\}/gi, () => {
      const value = variables[index];
      index += 1;
      return value === undefined || value === null ? "" : String(value);
    })
    .replace(/\\n/g, "\n");
}

function buildPaymentSuccessMessage({
  academicYear,
  studentName,
  registrationCode,
  mobile,
  amount,
  examsRegistered,
}) {
  const template =
    process.env.SMS_PAYMENT_SUCCESS_TEMPLATE ||
    "Dear Parent, Your payment for Unified Council Olympiads {#var#} has been received successfully. Student: {#var#} Ref. No: {#var#} Reg. Mobile No.: {#var#} Amount: Rs. {#var#} Exam(s) Registered: {#var#} Login: https://www.unifiedcouncil.com/userlogin.aspx Books: www.bmatalent.com Thank you, Unified Council Helpline(s): 9603064939 / 6302902378 / 040-24545862 / 24557708";

  return replaceTemplateVariables(template, [
    academicYear,
    studentName,
    registrationCode,
    mobile,
    amount,
    examsRegistered,
  ]);
}

function buildPaymentFailureMessage(packageName, retryLink) {
  const template =
    process.env.SMS_PAYMENT_FAILURE_TEMPLATE ||
    "Dear Parent, Our records show your attempt to register for Unified Council Olympiads {#var#} was unsuccessful. Please try again using the updated link {#var#} . Ignore this message if payment was successful. Team Unified Council, Helpline(s): 9603064939 / 6302902378 / 040-24545862 / 24557708";

  return replaceTemplateVariables(template, [packageName, retryLink]);
}

function getEnv(name, fallback = "") {
  const value = process.env[name];
  return value === undefined ? fallback : value;
}

function includesIgnoreCase(value, searchText) {
  return String(value || "")
    .toLowerCase()
    .includes(String(searchText || "").toLowerCase());
}

function normalizeSmsResponse(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCampId(responseText) {
  const match = String(responseText || "").match(/campid['"]?\s*:\s*['"]([^'"}]+)/i);
  return match ? match[1] : "";
}

function maskSensitiveUrl(urlString) {
  const url = new URL(urlString);

  for (const [name] of url.searchParams) {
    if (/api.?key|password|^pwd$|message|mobile|username/i.test(name)) {
      url.searchParams.set(name, "******");
    }
  }

  return url.toString();
}

function buildRequest({ mobile, message, templateId }) {
  const baseUrl =
    process.env.SMS_API_URL || "http://bulk.kitesms.com/v3/api.php";
  const query = new URLSearchParams();

  query.set(
    getEnv("SMS_USER_PARAM", "username"),
    getRequiredEnv("SMS_USERNAME")
  );
  query.set(
    getEnv("SMS_APIKEY_PARAM", "apikey"),
    getRequiredEnv("SMS_API_KEY")
  );
  query.set(
    getEnv("SMS_SENDER_PARAM", "senderid"),
    getRequiredEnv("SMS_SENDER_ID")
  );
  query.set(getEnv("SMS_MOBILE_PARAM", "mobile"), mobile);
  query.set(getEnv("SMS_MESSAGE_PARAM", "message"), message);

  if (templateId) {
    query.set(getEnv("SMS_TEMPLATE_PARAM", "templateid"), templateId);
  }

  return {
    requestUrl: `${baseUrl}?${query.toString()}`,
    message,
  };
}

async function sendSms({ mobile, message, templateId, sensitive = false }) {
  const { requestUrl } = buildRequest({ mobile, message, templateId });

  console.log("SMS request", {
    mobile: "******",
    templateId: templateId || "",
    senderId: process.env.SMS_SENDER_ID || "",
    message: sensitive ? "[REDACTED]" : message,
    endpoint: process.env.SMS_API_URL || "http://bulk.kitesms.com/v3/api.php",
    requestUrl: maskSensitiveUrl(requestUrl),
  });

  const response = await axios.get(requestUrl, {
    headers: {
      Accept: "text/plain, application/json, */*",
    },
    responseType: "text",
    transformResponse: [(data) => data],
    validateStatus: () => true,
  });

  const responseText = String(response.data || "").trim();
  const normalizedResponseText = normalizeSmsResponse(responseText);

  console.log("SMS response", {
    status: response.status,
    ok: response.status >= 200 && response.status < 300,
    redirected: false,
    finalUrl: maskSensitiveUrl(requestUrl),
    body: responseText || "<empty>",
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `SMS gateway returned HTTP ${response.status}: ${responseText || "<empty>"}`
    );
  }

  if (
    normalizedResponseText.includes(
      normalizeSmsResponse(getEnv("SMS_LOW_CREDITS_TEXT", "less credits"))
    )
  ) {
    throw new Error("SMS credits exhausted. Please recharge.");
  }

  if (/error|invalid|failed|denied|unauthori[sz]ed|not\s*found/i.test(responseText)) {
    throw new Error(responseText);
  }

  if (!responseText) {
    return {
      success: true,
      providerResponse: "Accepted with empty response body",
      campId: "",
    };
  }

  return {
    success: true,
    providerResponse: responseText,
    campId: extractCampId(responseText),
  };
}

async function sendOtpSms(mobile, otp) {
  return sendSms({
    mobile,
    message: buildOtpMessage(otp),
    templateId: getEnv("SMS_TEMPLATE_ID"),
    sensitive: true,
  });
}

async function sendPaymentSuccessSms(mobile, paymentDetails) {
  return sendSms({
    mobile,
    message: buildPaymentSuccessMessage(paymentDetails),
    templateId: getEnv("SMS_PAYMENT_SUCCESS_TEMPLATE_ID"),
  });
}

async function sendPaymentFailureSms(mobile, packageName, retryLink) {
  return sendSms({
    mobile,
    message: buildPaymentFailureMessage(packageName, retryLink),
    templateId: getEnv("SMS_PAYMENT_FAILURE_TEMPLATE_ID"),
  });
}

module.exports = {
  buildPaymentFailureMessage,
  buildPaymentSuccessMessage,
  sendOtpSms,
  sendPaymentFailureSms,
  sendPaymentSuccessSms,
  buildRequest,
  buildOtpMessage,
  sendSms,
};
