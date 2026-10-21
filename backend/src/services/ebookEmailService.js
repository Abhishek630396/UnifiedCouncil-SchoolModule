const { getRegistrationByCode } = require("../models/registrationModel");
const {
  getClassDocByClassAndExamType,
  getNearestClassDocByExamType,
} = require("../models/classDocModel");
const { normalizeStoredPackageLabel } = require("../utils/packageFormat");
const { buildEbookLinksHtml } = require("../utils/ebookHtmlBuilder");
const { generateUnifiedCouncilHtmlEmail } = require("../templates/unifiedCouncilEbookEmail");
const { sendEmailWithHtml } = require("./emailService");

const EXAM_TYPE_BY_NAME = [
  { pattern: /NSTSE/i, examType: 1, displayName: "NSTSE" },
  { pattern: /UIEO/i, examType: 2, displayName: "UIEO" },
  { pattern: /UIMO/i, examType: 3, displayName: "UIMO" },
  { pattern: /UICO|UCO/i, examType: 4, displayName: "UICO" },
  { pattern: /UIGKO/i, examType: 5, displayName: "UIGKO" },
];

function getExamMeta(examName) {
  return (
    EXAM_TYPE_BY_NAME.find((entry) => entry.pattern.test(String(examName || ""))) || {
      examType: 6,
      displayName: String(examName || "").trim() || "Exam",
    }
  );
}

function extractExamNames(packagesBought) {
  const labels = String(packagesBought || "")
    .split(",")
    .map((item) => normalizeStoredPackageLabel(item))
    .filter(Boolean);

  return [
    ...new Set(
      labels
        .map((label) => String(label).split("-")[0].trim())
        .filter(Boolean)
    ),
  ];
}

function normalizeClassValue(className) {
  return String(className || "").trim();
}

function extractLinksFromClassDoc(row, examName) {
  const links = ["File1", "File2", "File3", "File4", "File5"]
    .map((field) => String(row?.[field] || "").trim())
    .filter(Boolean)
    .map((url) => ({ examName, url }));

  return links;
}

async function getEbookLinksByClassAndExam(studentClass, examName) {
  const examMeta = getExamMeta(examName);
  const normalizedClass = normalizeClassValue(studentClass);
  const classDoc =
    (await getClassDocByClassAndExamType(normalizedClass, examMeta.examType)) ||
    (await getNearestClassDocByExamType(normalizedClass, examMeta.examType));

  return {
    examName: examMeta.displayName || examName,
    links: extractLinksFromClassDoc(classDoc, examMeta.displayName || examName),
  };
}

async function buildUnifiedCouncilEmailPayload(registration) {
  const examNames = extractExamNames(registration?.packagesBought);
  const ebookSectionsRaw = await Promise.all(
    examNames.map((examName) => getEbookLinksByClassAndExam(registration?.className, examName))
  );
  const ebookSections = ebookSectionsRaw.filter((section) => section.links.length > 0);

  if (ebookSections.length === 0) {
    return null;
  }

  return {
    email: registration.email,
    student_name: registration.studentName || registration.parentName || "Student",
    reference_number: registration.registrationCode,
    exam_names: examNames.join(", "),
    ebook_links_html: buildEbookLinksHtml(ebookSections),
  };
}

async function sendUnifiedCouncilEbookEmail({ registrationCode, email }) {
  if (!registrationCode) {
    const error = new Error("registrationCode is required for ebook email.");
    error.statusCode = 400;
    throw error;
  }

  const registration = await getRegistrationByCode(registrationCode);
  if (!registration) {
    const error = new Error("Registration not found for ebook email.");
    error.statusCode = 404;
    throw error;
  }

  if (!registration.email && !email) {
    const error = new Error("Registration email is missing for ebook email.");
    error.statusCode = 400;
    throw error;
  }

  const payload = await buildUnifiedCouncilEmailPayload({
    ...registration,
    email: registration.email || email,
  });

  if (!payload) {
    console.warn("[Ebook Email] No ebook links found for registration:", registrationCode);
    return {
      skipped: true,
      reason: "No ebook links found for the selected class and exams.",
    };
  }

  return sendEmailWithHtml({
    email: payload.email,
    subject: `Unified Council Registration Confirmation - ${payload.exam_names}`,
    htmlContent: generateUnifiedCouncilHtmlEmail(payload),
    logLabel: "ebook",
  });
}

module.exports = {
  getEbookLinksByClassAndExam,
  sendUnifiedCouncilEbookEmail,
};
