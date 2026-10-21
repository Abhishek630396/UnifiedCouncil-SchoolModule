const { saveRegistration } = require("../services/registrationService");
const {
  getRegistrationByCode,
  markRegistrationRowSuccess,
  updateRegistrationPaymentStatus,
} = require("../models/registrationModel");
const {
  getSchoolEnrollmentByCode,
  markSchoolEnrollmentSuccess,
} = require("../models/school/studentRegistrationModal");

function validateRegistrationPayload(body) {
  const { selectedClass, cart, formData } = body;

  if (!selectedClass) {
    return "Class is required.";
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return "At least one exam selection is required.";
  }

  if (!formData?.studentName || !formData?.parentName || !formData?.mobile) {
    return "Student, parent, and mobile details are required.";
  }

  if (!formData?.email || !formData?.state || !formData?.city) {
    return "Email, state, and city are required.";
  }

  return null;
}

async function createRegistration(req, res, next) {
  try {
    const validationError = validateRegistrationPayload(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const result = await saveRegistration(req.body);
    return res.status(201).json({
      success: true,
      message: "Registration saved successfully.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function markRegistrationSuccess(req, res, next) {
  const registrationId = req.body?.registrationId === undefined ? null : Number(req.body.registrationId);
  const registrationCode = String(req.body?.registrationCode || "").trim();

  if (
    !registrationCode
    || registrationCode.length > 100
    || (registrationId !== null && (!Number.isSafeInteger(registrationId) || registrationId <= 0))
  ) {
    return res.status(400).json({
      success: false,
      message: "A valid registrationCode is required to mark a registration successful.",
    });
  }

  try {
    if (registrationId !== null) {
      const registration = await markRegistrationRowSuccess({ registrationId, registrationCode });
      if (!registration) {
        return res.status(409).json({
          success: false,
          message: "This exam row was not updated. Refresh the pending records and try again.",
        });
      }

      return res.json({
        success: true,
        message: "This exam registration was marked successful.",
        data: registration,
      });
    }

    const schoolEnrollment = await getSchoolEnrollmentByCode(registrationCode);
    if (schoolEnrollment) {
      if (schoolEnrollment.status.toLowerCase() !== "pending") {
        return res.status(409).json({
          success: false,
          message: "This school registration is no longer pending.",
        });
      }
      const updated = await markSchoolEnrollmentSuccess(registrationCode);
      if (!updated) {
        return res.status(409).json({
          success: false,
          message: "This school registration was not updated. Refresh the pending records and try again.",
        });
      }
    } else {
      const registration = await getRegistrationByCode(registrationCode);
      if (!registration) {
        return res.status(404).json({
          success: false,
          message: "No registration was found for this registration code.",
        });
      }
      if (String(registration.Status || "").toLowerCase() !== "pending") {
        return res.status(409).json({
          success: false,
          message: "This registration is no longer pending.",
        });
      }

      await updateRegistrationPaymentStatus({
        registrationCode,
        status: "Success",
        message: "Successful",
        userStatus: 2,
      });
    }

    return res.json({
      success: true,
      message: "This registration was marked successful.",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createRegistration,
  markRegistrationSuccess,
};
