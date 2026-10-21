const express = require("express");
const {
  changeEnquiryStatus,
  getEnquiries,
  removeEnquiry,
  submitEnquiry,
} = require("../controllers/enquiryController");
const { requireAdmin } = require("../middleware/adminAuth");

const router = express.Router();

router.post("/", submitEnquiry);
router.get("/", requireAdmin, getEnquiries);
router.patch("/:id/status", requireAdmin, changeEnquiryStatus);
router.delete("/:id", requireAdmin, removeEnquiry);

module.exports = router;
