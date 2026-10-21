const SibApiV3Sdk = require("sib-api-v3-sdk");

const REQUIRED_TEMPLATE_PARAMS = [
  "student_name",
  "registration_code",
  "mobile",
  "amount",
  "courses",
];

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

function validateEmailPayload(data = {}) {
  const missingFields = ["email", ...REQUIRED_TEMPLATE_PARAMS].filter((field) => {
    const value = data[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missingFields.length > 0) {
    const error = new Error(`Missing required email fields: ${missingFields.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
}

function getTemplateId() {
  const templateId = Number(process.env.BREVO_TEMPLATE_ID);

  if (!Number.isInteger(templateId) || templateId <= 0) {
    const error = new Error("BREVO_TEMPLATE_ID must be a valid numeric template id.");
    error.statusCode = 500;
    throw error;
  }

  return templateId;
}

function getFailureTemplateId() {
  const templateId = Number(process.env.BREVO_FAILED_TEMPLATE_ID);

  if (!Number.isInteger(templateId) || templateId <= 0) {
    const error = new Error("BREVO_FAILED_TEMPLATE_ID must be a valid numeric template id.");
    error.statusCode = 500;
    throw error;
  }

  return templateId;
}

function getEbookTemplateId() {
  const templateId = Number(process.env.BREVO_EBOOK_TEMPLATE_ID);

  if (!Number.isInteger(templateId) || templateId <= 0) {
    const error = new Error("BREVO_EBOOK_TEMPLATE_ID must be a valid numeric template id.");
    error.statusCode = 500;
    throw error;
  }

  return templateId;
}

function extractBrevoErrorDetails(error) {
  return (
    error?.response?.body ||
    error?.response?.text ||
    error?.response?.error ||
    error?.body ||
    error?.message ||
    null
  );
}

async function sendEmailWithTemplate(data, templateId, logLabel) {
  if (!process.env.BREVO_API_KEY) {
    const error = new Error("BREVO_API_KEY is not configured.");
    error.statusCode = 500;
    throw error;
  }

  validateEmailPayload(data);

  const payload = {
    to: [{ email: String(data.email).trim() }],
    sender: {
      email: process.env.BREVO_SENDER_EMAIL || "exam@unifiedcouncil.com",
      name: process.env.BREVO_SENDER_NAME || "Unified Council",
    },
    templateId,
    params: {
      student_name: String(data.student_name).trim(),
      registration_code: String(data.registration_code).trim(),
      mobile: String(data.mobile).trim(),
      amount: String(data.amount).trim(),
      courses: String(data.courses).trim(),
    },
  };

  console.log(`[Brevo] Preparing ${logLabel} email for:`, data.email);
  console.log(`[Brevo] Sending ${logLabel} email with template:`, payload.templateId);
  console.log("[Brevo] Sender configuration:", payload.sender);
  console.log("[Brevo] Template params:", payload.params);

  try {
    const response = await transactionalEmailsApi.sendTransacEmail(payload);
    console.log(`[Brevo] ${logLabel} email sent successfully:`, response);
    return response;
  } catch (error) {
    const details = extractBrevoErrorDetails(error);
    console.error(`[Brevo] Failed to send ${logLabel} email:`, {
      message: error?.message || null,
      statusCode: error?.statusCode || error?.response?.statusCode || null,
      details,
    });
    const serviceError = new Error(`Failed to send ${logLabel} email.`);
    serviceError.statusCode = error.statusCode || error.response?.statusCode || 502;
    serviceError.details = details;
    throw serviceError;
  }
}

async function sendEmailWithHtml({ email, subject, htmlContent, logLabel = "html" }) {
  if (!process.env.BREVO_API_KEY) {
    const error = new Error("BREVO_API_KEY is not configured.");
    error.statusCode = 500;
    throw error;
  }

  if (!email || !subject || !htmlContent) {
    const error = new Error("email, subject, and htmlContent are required.");
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    to: [{ email: String(email).trim() }],
    sender: {
      email: process.env.BREVO_SENDER_EMAIL || "exam@unifiedcouncil.com",
      name: process.env.BREVO_SENDER_NAME || "Unified Council",
    },
    subject: String(subject).trim(),
    htmlContent: String(htmlContent),
  };

  console.log(`[Brevo] Preparing ${logLabel} email for:`, payload.to[0].email);
  console.log(`[Brevo] Sending ${logLabel} email with subject:`, payload.subject);
  console.log("[Brevo] Sender configuration:", payload.sender);

  try {
    const response = await transactionalEmailsApi.sendTransacEmail(payload);
    console.log(`[Brevo] ${logLabel} email sent successfully:`, response);
    return response;
  } catch (error) {
    const details = extractBrevoErrorDetails(error);
    console.error(`[Brevo] Failed to send ${logLabel} email:`, {
      message: error?.message || null,
      statusCode: error?.statusCode || error?.response?.statusCode || null,
      details,
    });
    const serviceError = new Error(`Failed to send ${logLabel} email.`);
    serviceError.statusCode = error.statusCode || error.response?.statusCode || 502;
    serviceError.details = details;
    throw serviceError;
  }
}

async function sendRegistrationEmail(data) {
  return sendEmailWithTemplate(data, getTemplateId(), "confirmation");
}

async function sendRegistrationFailureEmail(data) {
  return sendEmailWithTemplate(data, getFailureTemplateId(), "failure");
}

async function sendEbookTemplateEmail(data) {
  if (!process.env.BREVO_API_KEY) {
    const error = new Error("BREVO_API_KEY is not configured.");
    error.statusCode = 500;
    throw error;
  }

  const requiredFields = [
    "email",
    "student_name",
    "reference_number",
    "exam_names",
    "ebook_links_html",
  ];
  const missingFields = requiredFields.filter((field) => {
    const value = data?.[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missingFields.length > 0) {
    const error = new Error(`Missing required ebook email fields: ${missingFields.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    to: [{ email: String(data.email).trim() }],
    sender: {
      email: process.env.BREVO_SENDER_EMAIL || "exam@unifiedcouncil.com",
      name: process.env.BREVO_SENDER_NAME || "Unified Council",
    },
    templateId: getEbookTemplateId(),
    params: {
      student_name: String(data.student_name).trim(),
      reference_number: String(data.reference_number).trim(),
      exam_names: String(data.exam_names).trim(),
      ebook_links_html: String(data.ebook_links_html),
    },
  };

  console.log("[Brevo] Preparing ebook email for:", data.email);
  console.log("[Brevo] Sending ebook email with template:", payload.templateId);
  console.log("[Brevo] Sender configuration:", payload.sender);
  console.log("[Brevo] Template params:", payload.params);

  try {
    const response = await transactionalEmailsApi.sendTransacEmail(payload);
    console.log("[Brevo] ebook email sent successfully:", response);
    return response;
  } catch (error) {
    const details = extractBrevoErrorDetails(error);
    console.error("[Brevo] Failed to send ebook email:", {
      message: error?.message || null,
      statusCode: error?.statusCode || error?.response?.statusCode || null,
      details,
    });
    const serviceError = new Error("Failed to send ebook email.");
    serviceError.statusCode = error.statusCode || error.response?.statusCode || 502;
    serviceError.details = details;
    throw serviceError;
  }
}

module.exports = {
  sendEbookTemplateEmail,
  sendEmailWithHtml,
  sendEmailWithTemplate,
  sendRegistrationEmail,
  sendRegistrationFailureEmail,
};
