const {
  initializeTables,
  findExistingUserByMobile,
  saveRegistrationBatch,
} = require("../models/registrationModel");
const { ensureStudentRegistrationPricingColumns } = require("../models/school/studentRegistrationModal");
const { ensureSchoolDashboardTokenTable } = require("../utils/schoolToken");
const { buildCartInvoiceBreakdown, roundCurrency } = require("../constants/invoicePricing");

function mapExistingUser(existingUser) {
  if (!existingUser) {
    return null;
  }

  if (existingUser.source === "registration") {
    const registrations = existingUser.rows.map((row) => {
      const amountFields = [
        row.Examfee,
        row.CGST,
        row.SGST,
        row.IGST,
        row.BMALSOP,
        row.CGSTOP,
        row.SGSTOP,
        row.IGSTOP,
        row.ComboOfferDiscount,
      ];
      const hasExamAmountBreakdown = amountFields.some((value) => value !== null && value !== undefined);
      const examAmount = hasExamAmountBreakdown
        ? Math.round((
          Number(row.Examfee || 0) +
          Number(row.CGST || 0) +
          Number(row.SGST || 0) +
          Number(row.IGST || 0) +
          Number(row.BMALSOP || 0) +
          Number(row.CGSTOP || 0) +
          Number(row.SGSTOP || 0) +
          Number(row.IGSTOP || 0) -
          Number(row.ComboOfferDiscount || 0)
        ) * 100) / 100
        : row.Amount ?? null;

      return {
        registrationId: row.registrationId,
        studentName: row.STDNAME || "",
        parentName: row.FNAME || "",
        mobile: row.STDPH2 || "",
        email: row.EMAIL || "",
        className: row.CLASS || "",
        examName: row.examName || "",
        packagesBought: row.Packagesbought || "",
        status: row.Status || "",
        amount: examAmount,
        recordedAmount: row.Amount ?? null,
        fullAmount: row.FullAmount ?? null,
        examFee: row.Examfee ?? null,
        packageAmount: row.BMALSOP ?? null,
        cgst: row.CGST ?? null,
        sgst: row.SGST ?? null,
        igst: row.IGST ?? null,
        packageCgst: row.CGSTOP ?? null,
        packageSgst: row.SGSTOP ?? null,
        packageIgst: row.IGSTOP ?? null,
        onlinePackageMrp: row.OnlinePackageMRP ?? null,
        onlinePackageDiscount: row.OnlinePackageDiscount ?? null,
        comboOfferDiscount: row.ComboOfferDiscount ?? null,
        packageGst: row.PackageGST ?? null,
        paymentDate: row.paymentDate || null,
        registrationCode: row.registrationCode || "",
        referenceNumber: row.ReferenceNumber || "",
        transactionId: row.transid || "",
        invoiceNumber: row.InvoiceNo || "",
        message: row.Message || "",
        centerName: row.CENTERNAME || "",
        state: row.STDSTATE || "",
        city: row.STDADD3 || "",
        address1: row.STDADD1 || "",
        address2: row.STDADD2 || "",
        pincode: row.ZIP || "",
        schoolName: row.SCHOOLNAME || "",
        schoolPhone: row.SCPHONE || "",
        schoolAddress: row.SCADD1 || "",
        principalName: row.SCPrincipal || "",
        schoolCity: row.SCADD2 || "",
        schoolState: row.SCSTATE || "",
        schoolPincode: row.SCZIP || "",
        board: row.Board || "",
        coordinatorId: row.CoordinatorId || "",
        source: row.InfoSource
          ? row.InfoSource.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
      };
    });

    return {
      ...registrations[0],
      registrations,
    };
  }

  const row = existingUser.row;
  return {
    studentName: row.StudentName || "",
    parentName: row.ParentsName || "",
    mobile: row.MobileNo || "",
    email: row.EmailId || "",
    coordinatorId: "",
    source: [],
    registrations: [],
  };
}

async function initializeDatabase() {
  await initializeTables();
  await ensureStudentRegistrationPricingColumns();
  await ensureSchoolDashboardTokenTable();
}

async function getExistingUserProfile(mobile) {
  const existingUser = await findExistingUserByMobile(mobile);
  return mapExistingUser(existingUser);
}

async function saveRegistration(payload) {
  const { selectedClass, cart, formData } = payload;
  const invoiceBreakdown = buildCartInvoiceBreakdown(cart, formData.state);
  const totalOriginalAmount = roundCurrency(invoiceBreakdown.summary.subTotal);
  const totalAmount = roundCurrency(invoiceBreakdown.summary.amountToPay);

  const rows = cart.map((item, index) => {
    const breakdownRow = invoiceBreakdown.rows[index];
    const hasOnlinePackage = Number(breakdownRow.onlinePackageAmount || 0) > 0;

    return {
      CoordinatorId: formData.coordinatorId || "",
      BMALSOP: hasOnlinePackage ? breakdownRow.onlinePackageAmount : 0,
      CGSTOP: hasOnlinePackage ? breakdownRow.packageTax.cgst : null,
      SGSTOP: hasOnlinePackage ? breakdownRow.packageTax.sgst : null,
      IGSTOP: hasOnlinePackage ? breakdownRow.packageTax.igst : null,
      Examfee: breakdownRow.isStandalonePricedPackage ? 0 : breakdownRow.examFee,
      SGST: breakdownRow.isStandalonePricedPackage ? 0 : breakdownRow.feeTax.sgst,
      CGST: breakdownRow.isStandalonePricedPackage ? 0 : breakdownRow.feeTax.cgst,
      IGST: breakdownRow.isStandalonePricedPackage ? 0 : breakdownRow.feeTax.igst,
      OnlinePackageMRP: hasOnlinePackage ? breakdownRow.onlinePackageMRP : null,
      OnlinePackageDiscount: hasOnlinePackage ? breakdownRow.specialDiscount : null,
      ComboOfferDiscount: breakdownRow.comboOffer,
      PackageGST: hasOnlinePackage ? breakdownRow.gstOnPackages : null,
      ZIP: formData.pincode || "",
      STDSTATE: formData.state || "",
      STDADD1: (formData.address1 || "").replace(/#/g, "").trim(),
      STDADD2: (formData.address2 || "").replace(/#/g, "").trim(),
      STDADD3: formData.city || "",
      STDNAME: (formData.studentName || "").toUpperCase(),
      FNAME: (formData.parentName || "").toUpperCase(),
      STDPH2: formData.mobile,
      CLASS: selectedClass,
      EMAIL: formData.email,
      SCHOOLNAME: (formData.schoolName || "").toUpperCase(),
      SCADD1: formData.schoolAddress || formData.schoolCity || formData.city || "",
      SCADD2: formData.schoolCity || "",
      SCSTATE: "",
      SCZIP: "",
      SCPHONE: formData.schoolPhone || "",
      Status: "Pending",
      Amount: totalAmount,
      FullAmount: totalOriginalAmount,
      Message: "Pending",
      Board: formData.board || "",
      InfoSource: Array.isArray(formData.source) ? formData.source.join(", ") : formData.source || "",
      CENTERNAME: "-",
      Separatepackages: breakdownRow.examLabel,
      SCPrincipal: formData.principalName || "",
    };
  });

  return saveRegistrationBatch({
    selectedClass,
    cart,
    formData,
    totalAmount,
    totalOriginalAmount,
    rows,
  }).then((result) => {
    const normalizedResult = result || {};
    const registrationCode =
      normalizedResult.registrationCode ||
      normalizedResult.referenceNumber ||
      normalizedResult.transactionId ||
      "";

    return {
      ...normalizedResult,
      registrationCode,
      referenceNumber: normalizedResult.referenceNumber || registrationCode,
      transactionId: normalizedResult.transactionId || registrationCode,
      amount: normalizedResult.amount ?? totalAmount,
      fullAmount: normalizedResult.fullAmount ?? totalOriginalAmount,
      invoiceBreakdown,
    };
  });
}

module.exports = {
  initializeDatabase,
  getExistingUserProfile,
  saveRegistration,
};
