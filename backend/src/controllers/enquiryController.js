const {
  createEnquiry,
  deleteEnquiry,
  listEnquiries,
  updateEnquiryStatus,
} = require("../models/enquiryModel");

const allowedStatuses = new Set([
  "New Enquiry",
  "Contacted",
  "In Progress",
  "Awaiting Action",
  "Completed",
  "Closed",
]);

function validateEnquiry(body = {}) {
  const required = ["schoolName", "contactPersonName", "designation", "phone", "email"];
  const missing = required.filter((field) => !String(body[field] || "").trim());
  if (missing.length) return `Missing required fields: ${missing.join(", ")}`;
  if (!/^\d{10}$/.test(String(body.phone).trim())) return "Please enter a valid 10-digit phone number.";
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(String(body.email).trim())) {
    return "Please enter a valid email address.";
  }
  const allowedSources = new Set(["Google", "Facebook", "Instagram", "Others", "Previous School"]);
  if (body.sourceOfInformation && !allowedSources.has(String(body.sourceOfInformation).trim())) {
    return "Please select a valid source of information.";
  }
  return null;
}

async function submitEnquiry(req, res, next) {
  try {
    const validationError = validateEnquiry(req.body);
    if (validationError) return res.status(400).json({ success: false, message: validationError });
    return res.status(201).json({ success: true, message: "Enquiry submitted successfully.", data: await createEnquiry(req.body) });
  } catch (error) {
    return next(error);
  }
}

async function getEnquiries(req, res, next) {
  try {
    const result = await listEnquiries(req.query);
    return res.json({ success: true, data: result.rows, pagination: result.pagination });
  } catch (error) {
    return next(error);
  }
}

async function changeEnquiryStatus(req, res, next) {
  try {
    if (!allowedStatuses.has(req.body?.status)) {
      return res.status(400).json({ success: false, message: "Invalid enquiry status." });
    }
    const updated = await updateEnquiryStatus(req.params.id, req.body.status);
    if (!updated) return res.status(404).json({ success: false, message: "Enquiry not found." });
    return res.json({ success: true, message: "Enquiry status updated successfully." });
  } catch (error) {
    return next(error);
  }
}

async function removeEnquiry(req, res, next) {
  try {
    const deleted = await deleteEnquiry(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Enquiry not found." });
    return res.json({ success: true, message: "Enquiry deleted successfully." });
  } catch (error) {
    return next(error);
  }
}

module.exports = { changeEnquiryStatus, getEnquiries, removeEnquiry, submitEnquiry };
