const express = require("express");
const { createRegistration, markRegistrationSuccess } = require("../controllers/registrationController");
const { requireAdmin } = require("../middleware/adminAuth");

const router = express.Router();

router.post("/", createRegistration);
router.post("/admin/mark-success", requireAdmin, markRegistrationSuccess);

module.exports = router;
