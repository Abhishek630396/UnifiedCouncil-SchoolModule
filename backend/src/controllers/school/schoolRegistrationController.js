const { createSchoolRegistration, getFullSchoolRegistrationById, getSchoolPasswordById, getSchoolRegistrationById, getRegisteredSchools, normalizePayload, updateSchoolExamDetails, updateSchoolRegistration } = require("../../models/school/schoolRegistrationModal");
const { getSchoolExamDates } = require("../../models/school/schoolExamDateModel");
const { getExamOptionPrices } = require("../../models/pricingModal");
const { getStudentCountsBySchoolIds } = require("../../models/school/studentRegistrationModal");

function validateSchoolRegistrationPayload(body) {
  const payload = normalizePayload(body);

  if (!payload.SchoolName) {
    return "School name is required.";
  }

  if (!payload.Place) {
    return "Place is required.";
  }

  if (!payload.District) {
    return "District is required.";
  }

  if (!payload.PrinciContact) {
    return "Principal contact number is required.";
  }

  if (
    !payload.IsNSTSEselected &&
    !payload.IsUIEOSelected &&
    !payload.IsUIMOSelected &&
    !payload.IsUCOSelected &&
    !payload.IsUIGKOSelected
  ) {
    return "Please select at least one Olympiad.";
  }

  return null;
}

async function createRegistration(req, res, next) {
  try {
    const validationError = validateSchoolRegistrationPayload(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const result = await createSchoolRegistration(req.body);
    return res.status(201).json({
      success: true,
      message: "School registration saved successfully.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function listExamDates(_req, res, next) {
  try {
    const exams = await getSchoolExamDates();
    return res.json({
      success: true,
      data: exams,
    });
  } catch (error) {
    return next(error);
  }
}

async function getSchoolDetails(req, res, next) {
  try {
    const school = await getSchoolRegistrationById(req.params.schoolId);
    if (!school) {
      return res.status(404).json({ success: false, message: "No school was found for this School ID." });
    }
    return res.json({
      success: true,
      data: { school, prices: await getExamOptionPrices() },
    });
  } catch (error) {
    return next(error);
  }
}

async function listRegisteredSchools(req, res, next) {
  try {
    const result = await getRegisteredSchools({
      page: req.query.page,
      pageSize: req.query.pageSize,
      search: req.query.search,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
    });
    const counts = await getStudentCountsBySchoolIds(result.rows.map((school) => school.SchoolId));
    const rows = result.rows.map((school) => ({
      ...school,
      studentCount: counts[school.SchoolId] || 0,
    }));
    return res.json({ success: true, data: rows, pagination: result.pagination });
  } catch (error) {
    return next(error);
  }
}

async function getRegisteredSchoolPassword(req, res, next) {
  try {
    const credentials = await getSchoolPasswordById(req.params.schoolId);
    if (!credentials) {
      return res.status(404).json({ success: false, message: "School was not found." });
    }
    if (!credentials.password) {
      return res.status(404).json({ success: false, message: "No password is set for this school." });
    }
    return res.json({ success: true, data: credentials });
  } catch (error) {
    return next(error);
  }
}

function escapeExcelCell(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function exportRegisteredSchools(req, res, next) {
  try {
    const { rows } = await getRegisteredSchools({
      search: req.query.search,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      exportAll: true,
    });
    const counts = await getStudentCountsBySchoolIds(rows.map((school) => school.SchoolId));
    const rowsWithStudentCounts = rows.map((school) => ({
      ...school,
      studentCount: counts[school.SchoolId] || 0,
    }));
    const columns = [
      ["SchoolId", "Registration number"], ["SchoolName", "School name"], ["Place", "Place"],
      ["studentCount", "Students count"],
      ["SchoolAddress", "School address"], ["District", "District"], ["State", "State"],
      ["Country", "Country"], ["Pincode", "Pincode"], ["SchoolMail", "School email"],
      ["SchoolContact", "School contact"], ["Schoolprinciname", "Principal name"],
      ["PrinciContact", "Principal contact"], ["Exam_Mode", "Exam mode"],
      ["IsNSTSEselected", "NSTSE"], ["IsUIEOSelected", "UIEO"], ["IsUIMOSelected", "UIMO"],
      ["IsUCOSelected", "UCO"], ["IsUIGKOSelected", "UIGKO"], ["Updated_Date", "Updated date"],
      ["NSTSETeachername", "NSTSE in-charge"], ["NSTSETeachermobile", "NSTSE number"],
      ["UIMOTeachername", "UIMO in-charge"], ["UIMOTeacherMobile", "UIMO number"],
      ["UIEOTeachername", "UIEO in-charge"], ["UIEOTeacherMobile", "UIEO number"],
      ["UCOTeacherName", "UCO in-charge"], ["UCOTeacherMobile", "UCO number"],
      ["UIGKOTeacherName", "UIGKO in-charge"], ["UIGKOTeacherMobile", "UIGKO number"],
      ["REGNO", "REGNO"], ["Coor", "Coordinator"],
    ];
    const header = columns.map(([, label]) => `<th>${escapeExcelCell(label)}</th>`).join("");
    const body = rowsWithStudentCounts.map((row) => `<tr>${columns.map(([key]) => `<td>${escapeExcelCell(row[key])}</td>`).join("")}</tr>`).join("");
    const workbook = `<!doctype html><html><head><meta charset="utf-8"></head><body><table border="1"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></body></html>`;
    res.setHeader("Content-Type", "application/vnd.ms-excel; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=registered-schools.xls");
    return res.send(`\ufeff${workbook}`);
  } catch (error) {
    return next(error);
  }
}

async function getSelectedSchoolDetails(req, res, next) {
  try {
    const school = await getFullSchoolRegistrationById(req.params.schoolId);
    if (!school) return res.status(404).json({ success: false, message: "School was not found." });
    return res.json({ success: true, data: { school } });
  } catch (error) {
    return next(error);
  }
}

async function getSelectedSchoolExams(req, res, next) {
  try {
    const school = await getFullSchoolRegistrationById(req.params.schoolId);
    if (!school) return res.status(404).json({ success: false, message: "School was not found." });
    const exams = [
      ["NSTSE", "NSTSEExamdate", "NSTSETeachername", "NSTSETeachermobile", "NSTSETeachemail", "IsNSTSEselected"],
      ["UIEO", "UIEOExamdate", "UIEOTeachername", "UIEOTeacherMobile", "UIEOTeacherMail", "IsUIEOSelected"],
      ["UIMO", "UIMOExamdate", "UIMOTeachername", "UIMOTeacherMobile", "UIMOTeacherMail", "IsUIMOSelected"],
      ["UCO", "UCOExamdate", "UCOTeacherName", "UCOTeacherMobile", "UCOTeacherMail", "IsUCOSelected"],
      ["UIGKO", "UIGKOExamdate", "UIGKOTeacherName", "UIGKOTeacherMobile", "UIGKOTeacherMail", "IsUIGKOSelected"],
    ];
    return res.json({ success: true, data: exams.filter(([, , , , , selected]) => school[selected]).map(([examCode, date, teacher, mobile, email]) => ({ examCode, examName: examCode, examDate: school[date] || "", examMode: school.Exam_Mode, teacherInCharge: school[teacher] || "", mobile: school[mobile] || "", email: school[email] || "" })) });
  } catch (error) {
    return next(error);
  }
}

async function updateSelectedSchool(req, res, next) {
  try {
    const school = await updateSchoolRegistration(req.params.schoolId, req.body);
    if (!school) return res.status(404).json({ success: false, message: "School was not found." });
    return res.json({ success: true, message: "School details updated successfully.", data: { school } });
  } catch (error) { return next(error); }
}

async function updateSelectedSchoolExam(req, res, next) {
  try {
    const exam = await updateSchoolExamDetails(req.params.schoolId, req.params.examCode, req.body);
    if (!exam) return res.status(404).json({ success: false, message: "School was not found." });
    return res.json({ success: true, message: "Exam details updated successfully.", data: exam });
  } catch (error) { return next(error); }
}

module.exports = {
  createRegistration,
  getSchoolDetails,
  getSelectedSchoolDetails,
  getSelectedSchoolExams,
  updateSelectedSchool,
  updateSelectedSchoolExam,
  exportRegisteredSchools,
  getRegisteredSchoolPassword,
  listRegisteredSchools,
  listExamDates,
};
