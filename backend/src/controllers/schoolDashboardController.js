const {
  getSchoolDashboardProfile,
} = require("../models/school/schoolRegistrationModal");
const {
  getRegisteredStudentsBySchool,
  getSchoolStudentById,
  getStudentRegistrationSummary,
} = require("../models/school/studentRegistrationModal");

async function getOverview(req, res, next) {
  try {
    const schoolId = req.school.schoolId;
    const requestedYear = Number(req.query.year);
    const year = Number.isInteger(requestedYear) && requestedYear >= 2000 && requestedYear <= 2100
      ? requestedYear
      : new Date().getFullYear();
    const [school, statistics, recentResult] = await Promise.all([
      getSchoolDashboardProfile(schoolId),
      getStudentRegistrationSummary(schoolId, year),
      getRegisteredStudentsBySchool(schoolId, { page: 1, pageSize: 5 }),
    ]);

    if (!school) {
      return res.status(401).json({ success: false, message: "School account was not found." });
    }

    return res.json({
      success: true,
      data: { school, statistics, recentStudents: recentResult.rows },
    });
  } catch (error) {
    return next(error);
  }
}

async function listSchoolStudents(req, res, next) {
  try {
    const result = await getRegisteredStudentsBySchool(req.school.schoolId, {
      page: req.query.page,
      pageSize: req.query.pageSize,
      search: req.query.search,
      className: req.query.className,
      exam: req.query.exam,
      status: req.query.status,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
    });
    return res.json({ success: true, data: result.rows, pagination: result.pagination });
  } catch (error) {
    return next(error);
  }
}

async function getSchoolStudent(req, res, next) {
  try {
    const student = await getSchoolStudentById(req.school.schoolId, req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student registration was not found." });
    }
    return res.json({ success: true, data: student });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getOverview, getSchoolStudent, listSchoolStudents };
