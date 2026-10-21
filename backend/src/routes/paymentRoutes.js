const express = require("express");
const {
  createCcaVenueInitiation,
  createSchoolCcaVenueInitiation,
  getSchoolCcaVenueStatus,
  handleSchoolCcaVenueResponse,
  handleCcaVenueResponse,
  downloadInvoice,
} = require("../controllers/paymentController");

const router = express.Router();

// Razorpay disabled. Keep only CCAvenue payment flow active.
// router.post("/razorpay/order", createOrder);
router.post("/ccavenue/initiate", createCcaVenueInitiation);
router.post("/ccavenue/response", handleCcaVenueResponse);
router.post("/ccavenue/school/initiate", createSchoolCcaVenueInitiation);
router.post("/ccavenue/school/response", handleSchoolCcaVenueResponse);
router.get("/ccavenue/school/status/:registrationCode", getSchoolCcaVenueStatus);
// router.post("/razorpay/verify", verifyPayment);
// router.post("/razorpay/failure", markPaymentFailed);
router.get("/invoices/:registrationCode/download", downloadInvoice);

module.exports = router;
