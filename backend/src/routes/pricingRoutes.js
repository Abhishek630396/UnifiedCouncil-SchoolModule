const express = require("express");
const { listExamPrices, updateExamPrices } = require("../controllers/pricingController");
const { requireAdmin } = require("../middleware/adminAuth");

const router = express.Router();
router.get("/", requireAdmin, listExamPrices);
router.put("/", requireAdmin, updateExamPrices);
module.exports = router;
