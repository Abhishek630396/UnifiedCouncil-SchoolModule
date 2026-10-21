const express = require("express");
const {
  getOverview,
  getSchoolStudent,
  listSchoolStudents,
} = require("../controllers/schoolDashboardController");
const { requireSchool } = require("../middleware/schoolAuth");

const router = express.Router();

router.use(requireSchool);
router.get("/overview", getOverview);
router.get("/students", listSchoolStudents);
router.get("/students/:studentId", getSchoolStudent);

module.exports = router;
