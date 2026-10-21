const express = require("express");

const { sendRegistrationEmail } = require("../services/emailService");
const { sendUnifiedCouncilEbookEmail } = require("../services/ebookEmailService");

const router = express.Router();

function validateEmailRequest(body = {}) {
  const requiredFields = ["email", "student_name", "registration_code"];
  const missingFields = requiredFields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  return null;
}

router.post("/send-confirmation", async (req, res, next) => {
  console.log("[Email Route] Incoming send-confirmation request:", req.body);

  try {
    const validationError = validateEmailRequest(req.body);
    if (validationError) {
      console.warn("[Email Route] Validation failed:", validationError);
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const result = await sendRegistrationEmail(req.body);
    let ebookEmailResult = null;

    try {
      ebookEmailResult = await sendUnifiedCouncilEbookEmail({
        registrationCode: req.body.registration_code,
        email: req.body.email,
      });
    } catch (ebookError) {
      console.error(
        "[Email Route] Confirmation email sent, but ebook email failed:",
        ebookError.details || ebookError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Confirmation email sent successfully.",
      data: {
        confirmationEmail: result,
        ebookEmail: ebookEmailResult,
      },
    });
  } catch (error) {
    console.error("[Email Route] Failed to send confirmation email:", error.details || error.message);
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details || null,
      });
    }

    return next(error);
  }
});

module.exports = router;
