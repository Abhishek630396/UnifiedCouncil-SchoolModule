const { getSchoolRegistrationById } = require("../../models/school/schoolRegistrationModal");
const { createStudentRegistration: saveStudentRegistration, getRegisteredStudentsBySchool } = require("../../models/school/studentRegistrationModal");
const {
  calculateSchoolRegistrationPricing,
  getExamOptionPrices,
} = require("../../models/pricingModal");

function normalizeIndianMobile(value) {
  const rawMobile = String(value || "").trim();
  if (!/^[+\d\s().-]+$/.test(rawMobile)) {
    return "";
  }

  let digits = rawMobile.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return /^\d{10}$/.test(digits) ? digits : "";
}

async function createStudentRegistration(req, res, next) {
  try {
    const school = await getSchoolRegistrationById(req.params.schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "No school was found for this School ID.",
      });
    }

    const {
      className,
      section,
      studentName,
      parentName,
      mobile,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      selections,
    } = req.body || {};

    const normalizedMobile = normalizeIndianMobile(mobile);
    const normalizedClass = Number(className);
    const missingStudentDetails = [];
    if (!String(studentName || "").trim()) missingStudentDetails.push("student name");
    if (!Number.isInteger(normalizedClass) || normalizedClass < 1 || normalizedClass > 12) {
      missingStudentDetails.push("class (1-12)");
    }
    if (!String(parentName || "").trim()) missingStudentDetails.push("parent/guardian name");
    if (!normalizedMobile) missingStudentDetails.push("valid 10-digit mobile number");

    if (missingStudentDetails.length) {
      return res.status(400).json({
        success: false,
        message: `Please check the following student details: ${missingStudentDetails.join(", ")}.`,
      });
    }

    const missingAddressDetails = [];
    if (!String(addressLine1 || "").trim()) missingAddressDetails.push("address line 1");
    if (!String(city || "").trim()) missingAddressDetails.push("city/town");
    if (!String(state || "").trim()) missingAddressDetails.push("state");
    if (!/^\d{6}$/.test(String(pincode || "").trim())) missingAddressDetails.push("6-digit pincode");

    if (missingAddressDetails.length) {
      return res.status(400).json({
        success: false,
        message: `Please check the following address details: ${missingAddressDetails.join(", ")}.`,
      });
    }

    const selectedOptions = selections && typeof selections === "object" ? selections : {};
    const allowedExams = {
      NSTSE: Boolean(school.isNSTSESelected),
      UIMO: Boolean(school.isUIMOSelected),
      UIEO: Boolean(school.isUIEOSelected),
      UCO: Boolean(school.isUCOSelected),
      UIGKO: Boolean(school.isUIGKOSelected),
    };
    const prices = await getExamOptionPrices();
    let feePending = false;
    const normalizedSelections = Object.entries(selectedOptions).map(([examCode, optionId]) => {
      if (optionId === null) {
        if (!allowedExams[examCode]) {
          const error = new Error(`Invalid option selected for ${examCode}.`);
          error.statusCode = 400;
          throw error;
        }
        feePending = true;
        return { examCode, optionId: null };
      }
      const price = prices.find(
        (row) => row.examCode === examCode && row.optionId === Number(optionId)
      );
      if (!allowedExams[examCode] || !price?.isConfigured) {
        const error = new Error(`Invalid option selected for ${examCode}.`);
        error.statusCode = 400;
        throw error;
      }
      return {
        examCode,
        optionId: Number(optionId),
      };
    });

    if (!normalizedSelections.length) {
      return res.status(400).json({
        success: false,
        message: "Select at least one Olympiad option.",
      });
    }

    const pricing = calculateSchoolRegistrationPricing(normalizedSelections, prices);
    const data = await saveStudentRegistration({
      schoolId: req.params.schoolId,
      className: normalizedClass,
      section: String(section || "").trim(),
      studentName: String(studentName).trim(),
      parentName: String(parentName).trim(),
      mobile: normalizedMobile,
      email: String(email || "").trim(),
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      selections: pricing.rows,
    });

    return res.status(201).json({
      success: true,
      message: "Student registration saved successfully.",
      data: { ...data, feePending },
    });
  } catch (error) {
    return next(error);
  }
}

async function listRegisteredStudentsBySchool(req, res, next) {
  try {
    const school = await getSchoolRegistrationById(req.params.schoolId);
    if (!school) {
      return res.status(404).json({ success: false, message: "School was not found." });
    }
    const result = await getRegisteredStudentsBySchool(req.params.schoolId, {
      page: req.query.page,
      pageSize: req.query.pageSize,
      search: req.query.search,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
    });
    return res.json({ success: true, data: result.rows, pagination: result.pagination });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createStudentRegistration, listRegisteredStudentsBySchool };
