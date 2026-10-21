const express = require("express");
const {
  createExamDate,
  loginAdmin,
  createAdminCoordinator,
  getAdminCoordinatorPassword,
  createAdminTest,
  closeAdminUnsubmittedRegistration,
  listAdminExamDates,
  listAdminIndividualRegistrations,
  listAdminRegistrations,
  listAdminSchoolStudents,
  listAdminTableData,
  listExamDates,
  markAdminSchoolStudentSuccess,
  deleteAdminTableRow,
  toggleExamDateStatus,
  updateAdminTableRow,
  updateAdminTestStatus,
  updateExamDate,
  updateExamDates,
} = require("../controllers/adminController");
const {
  changeEnquiryStatus,
  getEnquiries,
  removeEnquiry,
} = require("../controllers/enquiryController");
const { requireAdmin, requireSuperAdmin } = require("../middleware/adminAuth");
const {
  ADMIN_PERMISSION_GROUPS,
  createManagedRole,
  createManagedUser,
  deleteManagedRole,
  listManagedRoles,
  listManagedUsers,
  setManagedUserStatus,
  updateManagedRolePermissions,
} = require("../controllers/adminUserManagementController");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/managed-roles/permissions", requireSuperAdmin, (_req, res) => {
  res.json({ success: true, data: ADMIN_PERMISSION_GROUPS });
});
router.get("/managed-roles", requireSuperAdmin, listManagedRoles);
router.post("/managed-roles", requireSuperAdmin, createManagedRole);
router.put("/managed-roles/:roleId/permissions", requireSuperAdmin, updateManagedRolePermissions);
router.delete("/managed-roles/:roleId", requireSuperAdmin, deleteManagedRole);
router.get("/managed-users", requireSuperAdmin, listManagedUsers);
router.post("/managed-users", requireSuperAdmin, createManagedUser);
router.patch("/managed-users/:userId/status", requireSuperAdmin, setManagedUserStatus);
router.get("/exam-dates", requireAdmin, listAdminExamDates);
router.get("/registrations", requireAdmin, listAdminRegistrations);
router.post("/unsubmitted-registrations/close", requireAdmin, closeAdminUnsubmittedRegistration);
router.get("/school-students", requireAdmin, listAdminSchoolStudents);
router.post("/school-students/mark-success", requireAdmin, markAdminSchoolStudentSuccess);
router.get("/individual-registrations", requireAdmin, listAdminIndividualRegistrations);
router.post("/coordinators", requireAdmin, createAdminCoordinator);
router.post("/coordinators/password", requireAdmin, getAdminCoordinatorPassword);
router.post("/tests", requireAdmin, createAdminTest);
router.get(
  "/tables/qr-users",
  requireSuperAdmin,
  (req, _res, next) => {
    req.params.tableKey = "qr-users";
    next();
  },
  listAdminTableData,
);
router.get("/tables/:tableKey", requireAdmin, listAdminTableData);
router.patch("/tables/:tableKey/row", requireAdmin, updateAdminTableRow);
router.patch("/tests/status", requireAdmin, updateAdminTestStatus);
router.delete("/tables/:tableKey/row", requireAdmin, deleteAdminTableRow);
router.post("/exam-dates", requireAdmin, createExamDate);
router.patch("/exam-dates/:id/toggle-status", requireAdmin, toggleExamDateStatus);
router.put("/exam-dates/:id", requireAdmin, updateExamDate);
router.put("/exam-dates", requireAdmin, updateExamDates);
router.get("/exam-dates/active", requireAdmin, listExamDates);
router.get("/enquiries", requireAdmin, getEnquiries);
router.patch("/enquiries/:id/status", requireAdmin, changeEnquiryStatus);
router.delete("/enquiries/:id", requireAdmin, removeEnquiry);
module.exports = router;
