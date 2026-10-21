const express = require("express");
const {
  addAdminAchiever,
  addAdminAchieverExam,
  addAdminCustomExamAchiever,
  addAdminHotLink,
  changeAdminHotLinkOrder,
  changeAdminHotLinkStatus,
  editAdminAchiever,
  editAdminHotLink,
  getAdminAchievers,
  getAdminAchieverCategoryCounts,
  getAdminAchieverExams,
  getAdminHotLink,
  getAdminHotLinks,
  getAdminTopAchievers,
  getPublicAchievers,
  getPublicAchieverExams,
  getPublicHotLinks,
  removeAdminAchiever,
  removeAdminAchieverExam,
  removeAdminHotLink,
} = require("../controllers/staticContentController");
const { requireAdmin } = require("../middleware/adminAuth");

const router = express.Router();

router.get("/hot-links/public", getPublicHotLinks);
router.get("/achievers/public", getPublicAchievers);
router.get("/achievers/exams/public", getPublicAchieverExams);
router.get("/static-content-admin/hot-links", requireAdmin, getAdminHotLinks);
router.post("/static-content-admin/hot-links", requireAdmin, addAdminHotLink);
router.patch("/static-content-admin/hot-links/reorder", requireAdmin, changeAdminHotLinkOrder);
router.get("/static-content-admin/hot-links/:id", requireAdmin, getAdminHotLink);
router.put("/static-content-admin/hot-links/:id", requireAdmin, editAdminHotLink);
router.delete("/static-content-admin/hot-links/:id", requireAdmin, removeAdminHotLink);
router.patch("/static-content-admin/hot-links/:id/status", requireAdmin, changeAdminHotLinkStatus);

router.get("/static-content-admin/achievers", requireAdmin, getAdminAchievers);
router.get("/static-content-admin/achievers/exams", requireAdmin, getAdminAchieverExams);
router.post("/static-content-admin/achievers/exams", requireAdmin, addAdminAchieverExam);
router.delete("/static-content-admin/achievers/exams/:id", requireAdmin, removeAdminAchieverExam);
router.post("/static-content-admin/achievers/exams/:id/records", requireAdmin, addAdminCustomExamAchiever);
router.get("/static-content-admin/achievers/counts", requireAdmin, getAdminAchieverCategoryCounts);
router.get("/static-content-admin/achievers/top-50", requireAdmin, getAdminTopAchievers);
router.post("/static-content-admin/achievers", requireAdmin, addAdminAchiever);
router.put("/static-content-admin/achievers/:id", requireAdmin, editAdminAchiever);
router.delete("/static-content-admin/achievers/:id", requireAdmin, removeAdminAchiever);

module.exports = router;
