const express = require("express");
const {
  createRegistration,
  exportRegisteredSchools,
  getSchoolDetails,
  getSelectedSchoolDetails,
  getSelectedSchoolExams,
  updateSelectedSchool,
  updateSelectedSchoolExam,
  listExamDates,
  listRegisteredSchools,
  getRegisteredSchoolPassword,
} = require("../../controllers/school/schoolRegistrationController");
const { listRegisteredStudentsBySchool } = require("../../controllers/school/studentRegistrationController");
const { requireAdmin } = require("../../middleware/adminAuth");
const studentRegistrationRoutes = require("./studentRegistrationRoutes");

const router = express.Router();

router.get("/exam-dates", listExamDates);
router.get("/registered-schools", requireAdmin, listRegisteredSchools);
router.get("/registered-schools/export", requireAdmin, exportRegisteredSchools);
router.get("/registered-schools/:schoolId/password", requireAdmin, getRegisteredSchoolPassword);
router.get("/registered-schools/:schoolId/students", requireAdmin, listRegisteredStudentsBySchool);
router.get("/registered-schools/:schoolId", requireAdmin, getSelectedSchoolDetails);
router.get("/registered-schools/:schoolId/exams", requireAdmin, getSelectedSchoolExams);
router.patch("/registered-schools/:schoolId", requireAdmin, updateSelectedSchool);
router.patch("/registered-schools/:schoolId/exams/:examCode", requireAdmin, updateSelectedSchoolExam);
router.get("/:schoolId", getSchoolDetails);
router.use("/:schoolId/students", studentRegistrationRoutes);
router.post("/", createRegistration);

module.exports = router;
