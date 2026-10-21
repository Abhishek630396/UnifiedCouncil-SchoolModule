const express = require("express");
const { createStudentRegistration } = require("../../controllers/school/studentRegistrationController");

const router = express.Router({ mergeParams: true });

router.post("/:schoolId/enrollments", createStudentRegistration);
router.post("/", createStudentRegistration);
router.post("/:schoolId", createStudentRegistration);

module.exports = router;
