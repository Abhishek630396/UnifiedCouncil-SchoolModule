const fs = require("fs/promises");
const path = require("path");
const { jsPDF } = require("jspdf");

const { getRegistrationByCode, getRegistrationInvoiceData } = require("../models/registrationModel");
const { getGstPercent, roundCurrency } = require("../constants/invoicePricing");
const BACKEND_ROOT = path.resolve(__dirname, "..", "..");

const COMPANY_NAME = "Unified Council Educational Services Pvt. Ltd.";
const COMPANY_ADDRESS = [
  "#16-11-16-1/B",
  "Saleem Nagar, Malakpet",
  "Hyderabad, Telangana, INDIA",
  "500036",
];
const COMPANY_CONTACT = [
  "040-24545862",
  "exam@unifiedcouncil.com",
  "unifiedcouncil.com",
  "GST No. : 36AAACU4441J1ZB",
];
const REGULAR_FONT_NAME = "SegoeUI";
const BOLD_FONT_NAME = "SegoeUI-Bold";
const FALLBACK_REGULAR_FONT_NAME = "helvetica";
const FALLBACK_BOLD_FONT_NAME = "helvetica";

function formatMoney(amount) {
  return `Rs. ${roundCurrency(amount).toFixed(2)}`;
}

function formatDiscountMoney(amount) {
  return `-${formatMoney(amount)}`;
}

function formatMoneyOrDash(amount) {
  return Number(amount || 0) === 0 ? "-" : formatMoney(amount);
}

function formatTaxCellOrDash(row, type) {
  if (type === "fee" && row.isStandalonePackage) {
    return "-";
  }

  return formatTaxCell(row, type);
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function buildInvoiceFilename(identifier) {
  const safeCode = String(identifier || "invoice").replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${safeCode}.pdf`;
}

function getInvoiceDirectory() {
  return path.join(BACKEND_ROOT, "uploads", "invoices_26-27");
}

function getInvoicePath(identifier) {
  return path.join(getInvoiceDirectory(), buildInvoiceFilename(identifier));
}

async function ensureInvoiceDirectory() {
  await fs.mkdir(getInvoiceDirectory(), { recursive: true });
}

function getPublicBaseUrl() {
  const explicitUrl =
    process.env.BACKEND_PUBLIC_URL ||
    process.env.API_PUBLIC_URL ||
    process.env.API_BASE_URL ||
    "";

  if (explicitUrl) {
    return String(explicitUrl).replace(/\/+$/, "");
  }

  if (String(process.env.NODE_ENV || "").trim().toLowerCase() === "production") {
    return "https://api.unifiedcouncil.com";
  }

  const port = String(process.env.PORT || 5000).trim();
  return `http://localhost:${port}`;
}

function getInvoiceDownloadUrl(registrationCode) {
  return `${getPublicBaseUrl()}/api/payments/invoices/${encodeURIComponent(registrationCode)}/download`;
}

function isTelanganaState(value) {
  return String(value || "").trim().toLowerCase() === "telangana";
}

function buildInvoiceData(registrationRows) {
  const firstRow = registrationRows[0] || {};
  const gstPercent = getGstPercent();

  const rows = registrationRows.map((row) => {
    const examFee = roundCurrency(row.Examfee || 0);
    const examSgst = roundCurrency(row.SGST || 0);
    const examCgst = roundCurrency(row.CGST || 0);
    const examIgst = roundCurrency(row.IGST || 0);
    const packageAmount = roundCurrency(row.BMALSOP || 0);
    const packageSgst = roundCurrency(row.SGSTOP || 0);
    const packageCgst = roundCurrency(row.CGSTOP || 0);
    const packageIgst = roundCurrency(row.IGSTOP || 0);
    const comboOffer = roundCurrency(row.ComboOfferDiscount || 0);
    const onlinePackageMRP = roundCurrency(row.OnlinePackageMRP || 0);
    const specialDiscount = roundCurrency(row.OnlinePackageDiscount || 0);
    const isStandalonePackage = examFee === 0 && onlinePackageMRP > 0 && packageAmount > 0;

    return {
      examLabel: String(row.Separatepackages || "").trim() || String(row.registrationCode || "").trim(),
      isStandalonePackage,
      examFee,
      examSgst,
      examCgst,
      examIgst,
      examGst: roundCurrency(examSgst + examCgst + examIgst),
      onlinePackageMRP,
      specialDiscount,
      onlinePackageAmount: packageAmount,
      packageSgst,
      packageCgst,
      packageIgst,
      packageGst: roundCurrency(packageSgst + packageCgst + packageIgst),
      comboOffer,
      amountToPay: roundCurrency(examFee + roundCurrency(examSgst + examCgst + examIgst) + packageAmount + roundCurrency(packageSgst + packageCgst + packageIgst)),
    };
  });

  const summary = {
    gstPercent,
    specialDiscountTotal: roundCurrency(rows.reduce((sum, row) => sum + row.specialDiscount, 0)),
    comboOfferTotal: roundCurrency(rows.reduce((sum, row) => sum + row.comboOffer, 0)),
    taxableAmount: roundCurrency(rows.reduce((sum, row) => sum + row.examFee + row.onlinePackageAmount, 0)),
    exemptedAmount: 0,
    amountToPay: roundCurrency(rows.reduce((sum, row) => sum + row.amountToPay, 0)),
    cgstAmount: roundCurrency(rows.reduce((sum, row) => sum + row.examCgst + row.packageCgst, 0)),
    sgstAmount: roundCurrency(rows.reduce((sum, row) => sum + row.examSgst + row.packageSgst, 0)),
    igstAmount: roundCurrency(rows.reduce((sum, row) => sum + row.examIgst + row.packageIgst, 0)),
  };

  summary.subTotal = roundCurrency(summary.taxableAmount + summary.specialDiscountTotal + summary.comboOfferTotal);
  summary.totalTax = roundCurrency(summary.cgstAmount + summary.sgstAmount + summary.igstAmount);

  return {
    registrationCode: firstRow.registrationCode || "",
    invoiceNumber: firstRow.InvoiceNo || "",
    referenceNumber: firstRow.transid || firstRow.registrationCode || "",
    transactionId: firstRow.transactionId || firstRow.ReferenceNumber || "",
    invoiceDate: formatDate(firstRow.transdate),
    paymentDueDate: formatDate(firstRow.transdate),
    studentName: firstRow.studentName || firstRow.parentName || "Student",
    mobile: firstRow.mobile || "",
    email: firstRow.email || "",
    paymentMode: "Online Payment",
    isTelangana: isTelanganaState(firstRow.STDSTATE),
    stateName: firstRow.STDSTATE || "",
    rows,
    summary,
  };
}

async function registerUnicodeFonts(pdf) {
  try {
    const regularFont = await fs.readFile("C:\\Windows\\Fonts\\segoeui.ttf");
    const boldFont = await fs.readFile("C:\\Windows\\Fonts\\segoeuib.ttf");
    pdf.addFileToVFS("segoeui.ttf", regularFont.toString("base64"));
    pdf.addFont("segoeui.ttf", REGULAR_FONT_NAME, "normal");
    pdf.addFileToVFS("segoeuib.ttf", boldFont.toString("base64"));
    pdf.addFont("segoeuib.ttf", BOLD_FONT_NAME, "normal");
    return {
      regularFontName: REGULAR_FONT_NAME,
      boldFontName: BOLD_FONT_NAME,
    };
  } catch (error) {
    console.error("[Invoice] Unicode font load failed. Falling back to built-in font.", error.message);
    return {
      regularFontName: FALLBACK_REGULAR_FONT_NAME,
      boldFontName: FALLBACK_BOLD_FONT_NAME,
    };
  }
}

function setRegularFont(pdf, fontConfig, size, color = [85, 85, 85]) {
  pdf.setFont(fontConfig.regularFontName, "normal");
  pdf.setFontSize(size);
  pdf.setTextColor(...color);
}

function setBoldFont(pdf, fontConfig, size, color = [17, 24, 39]) {
  const fontStyle = fontConfig.boldFontName === FALLBACK_BOLD_FONT_NAME ? "bold" : "normal";
  pdf.setFont(fontConfig.boldFontName, fontStyle);
  pdf.setFontSize(size);
  pdf.setTextColor(...color);
}

function drawText(pdf, fontConfig, text, x, y, options = {}) {
  if (options.bold) {
    setBoldFont(pdf, fontConfig, options.fontSize || 10, options.color);
  } else {
    setRegularFont(pdf, fontConfig, options.fontSize || 10, options.color);
  }
  pdf.text(String(text), x, y, options.align ? { align: options.align } : undefined);
}

function drawWrappedCenteredText(pdf, fontConfig, text, centerX, topY, maxWidth, options = {}) {
  const fontSize = options.fontSize || 8;
  if (options.bold) {
    setBoldFont(pdf, fontConfig, fontSize, options.color);
  } else {
    setRegularFont(pdf, fontConfig, fontSize, options.color);
  }

  const lines = pdf.splitTextToSize(String(text), maxWidth);
  lines.forEach((line, index) => {
    pdf.text(String(line), centerX, topY + index * (options.lineHeight || 9), { align: "center" });
  });
}

function drawWrappedCellText(pdf, fontConfig, text, cellX, cellY, cellWidth, cellHeight, options = {}) {
  const fontSize = options.fontSize || 8;
  const lineHeight = options.lineHeight || 9;
  if (options.bold) {
    setBoldFont(pdf, fontConfig, fontSize, options.color);
  } else {
    setRegularFont(pdf, fontConfig, fontSize, options.color);
  }

  const lines = pdf.splitTextToSize(String(text), Math.max(cellWidth - 6, 1));
  const safeLines = Array.isArray(lines) ? lines : [String(text)];
  const totalHeight = Math.max(safeLines.length - 1, 0) * lineHeight;
  const startY = options.valign === "top"
    ? cellY + (options.paddingTop || 8)
    : cellY + (cellHeight / 2) - (totalHeight / 2);

  safeLines.forEach((line, index) => {
    pdf.text(String(line), cellX + cellWidth / 2, startY + index * lineHeight, { align: "center" });
  });
}

function formatTaxCell(row, type) {
  const sgstValue = type === "fee" ? row.examSgst : row.packageSgst;
  const cgstValue = type === "fee" ? row.examCgst : row.packageCgst;
  const igstValue = type === "fee" ? row.examIgst : row.packageIgst;

  if (sgstValue || cgstValue) {
    return `SGST ${formatMoney(sgstValue)}\nCGST ${formatMoney(cgstValue)}`;
  }

  return `IGST ${formatMoney(igstValue)}`;
}

async function renderInvoicePdf(invoiceData, filePath) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const fontConfig = await registerUnicodeFonts(pdf);

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(1);
  pdf.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 8, 8);

  const innerLeft = margin + 8;
  const innerRight = pageWidth - margin - 8;
  const topY = margin + 26;

  drawText(pdf, fontConfig, COMPANY_NAME, innerLeft, topY, { bold: true, fontSize: 17, color: [15, 76, 129] });
  drawText(pdf, fontConfig, COMPANY_ADDRESS[0], innerLeft, topY + 18, { fontSize: 8, color: [85, 85, 85] });
  drawText(pdf, fontConfig, COMPANY_ADDRESS[1], innerLeft, topY + 31, { fontSize: 8, color: [85, 85, 85] });
  drawText(pdf, fontConfig, COMPANY_ADDRESS[2], innerLeft, topY + 44, { fontSize: 8, color: [85, 85, 85] });
  drawText(pdf, fontConfig, COMPANY_ADDRESS[3], innerLeft, topY + 57, { fontSize: 8, color: [85, 85, 85] });

  const contactX = innerLeft + 150;
  drawText(pdf, fontConfig, COMPANY_CONTACT[0], contactX, topY + 18, { fontSize: 8, color: [85, 85, 85] });
  drawText(pdf, fontConfig, COMPANY_CONTACT[1], contactX, topY + 31, { fontSize: 8, color: [85, 85, 85] });
  drawText(pdf, fontConfig, COMPANY_CONTACT[2], contactX, topY + 44, { fontSize: 8, color: [85, 85, 85] });
  drawText(pdf, fontConfig, COMPANY_CONTACT[3], innerLeft, topY + 74, { bold: true, fontSize: 8.5, color: [17, 24, 39] });

  const metaX = innerRight - 170;
  drawText(pdf, fontConfig, "Tax Invoice", metaX, topY, { bold: true, fontSize: 17, color: [17, 24, 39] });
  drawText(pdf, fontConfig, "Date", metaX, topY + 22, { bold: true, fontSize: 8.5, color: [51, 65, 85] });
  drawText(pdf, fontConfig, invoiceData.invoiceDate, metaX + 92, topY + 22, { fontSize: 8.5, color: [100, 116, 139] });
  drawText(pdf, fontConfig, "Invoice #", metaX, topY + 37, { bold: true, fontSize: 8.5, color: [51, 65, 85] });
  drawText(pdf, fontConfig, invoiceData.invoiceNumber || "-", metaX + 92, topY + 37, { fontSize: 8.5, color: [100, 116, 139] });
  drawText(pdf, fontConfig, "Reference No.", metaX, topY + 52, { bold: true, fontSize: 8.5, color: [51, 65, 85] });
  drawText(pdf, fontConfig, invoiceData.referenceNumber, metaX + 92, topY + 52, { fontSize: 8.5, color: [100, 116, 139] });
  const dividerY = topY + 92;
  pdf.setDrawColor(229, 231, 235);
  pdf.line(innerLeft, dividerY, innerRight, dividerY);

  const billedCardX = innerLeft;
  const billedCardY = dividerY + 18;
  const billedCardWidth = 255;
  const billedCardHeight = 133;
  pdf.setDrawColor(209, 219, 229);
  pdf.roundedRect(billedCardX, billedCardY, billedCardWidth, billedCardHeight, 6, 6);
  pdf.setFillColor(237, 242, 247);
  pdf.rect(billedCardX, billedCardY, billedCardWidth, 22, "F");
  drawText(pdf, fontConfig, "Billed To", billedCardX + 10, billedCardY + 14, { bold: true, fontSize: 9, color: [15, 76, 129] });

  drawText(pdf, fontConfig, "Student Information", billedCardX + 14, billedCardY + 40, {
    bold: true,
    fontSize: 9,
    color: [17, 24, 39],
  });
  drawText(pdf, fontConfig, `Student Name: ${invoiceData.studentName}`, billedCardX + 14, billedCardY + 57, {
    bold: true,
    fontSize: 8.5,
    color: [17, 24, 39],
  });
  drawText(pdf, fontConfig, `Email: ${invoiceData.email || "-"}`, billedCardX + 14, billedCardY + 72, {
    fontSize: 8.5,
    color: [17, 24, 39],
  });
  drawText(pdf, fontConfig, `Phone: ${invoiceData.mobile || "-"}`, billedCardX + 14, billedCardY + 87, {
    fontSize: 8.5,
    color: [17, 24, 39],
  });
  drawText(pdf, fontConfig, `State: ${invoiceData.stateName || "-"}`, billedCardX + 14, billedCardY + 102, {
    fontSize: 8.5,
    color: [17, 24, 39],
  });
  drawText(pdf, fontConfig, `Transaction ID: ${invoiceData.transactionId || "-"}`, billedCardX + 14, billedCardY + 117, {
    fontSize: 8.5,
    color: [17, 24, 39],
  });
  drawText(pdf, fontConfig, `Payment Mode: ${invoiceData.paymentMode}`, billedCardX + 14, billedCardY + 132, {
    fontSize: 8.5,
    color: [17, 24, 39],
  });

  const tableX = innerLeft;
  const tableY = billedCardY + billedCardHeight + 28;
  const tableHeaders = [
    "Exam(s)",
    "Exam Fee",
    "GST on Fee",
    "Online Packages\n(MRP)",
    "Special Discount\non Online\nPackages",
    "Online\nPackages",
    "GST on\nPackages",
    "Combo\nOffer",
    "Amount to\nPay",
  ];
  const tableWidths = [50, 40, 49, 54, 82, 50, 50, 44, 57];
  const tableWidth = tableWidths.reduce((sum, width) => sum + width, 0);
  const tableHeaderHeight = 48;
  const rowHeight = 38;

  pdf.setFillColor(15, 76, 129);
  pdf.rect(tableX, tableY, tableWidth, tableHeaderHeight, "F");

  let headerX = tableX;
  tableHeaders.forEach((header, index) => {
    drawWrappedCellText(
      pdf,
      fontConfig,
      header,
      headerX,
      tableY,
      tableWidths[index],
      tableHeaderHeight,
      { bold: true, fontSize: 6.4, color: [255, 255, 255], lineHeight: 7.2 }
    );
    headerX += tableWidths[index];
  });

  let currentY = tableY + tableHeaderHeight;
  invoiceData.rows.forEach((row) => {
    pdf.setDrawColor(229, 231, 235);
    pdf.line(tableX, currentY + rowHeight, tableX + tableWidth, currentY + rowHeight);

    const examGstValue = formatTaxCellOrDash(row, "fee");
    const packageGstValue = formatTaxCell(row, "package");

    const values = [
      row.examLabel,
      row.isStandalonePackage ? "-" : formatMoney(row.examFee),
      examGstValue,
      formatMoneyOrDash(row.onlinePackageMRP),
      formatDiscountMoney(row.specialDiscount),
      formatMoney(row.onlinePackageAmount),
      packageGstValue,
      formatDiscountMoney(row.comboOffer),
      formatMoney(row.amountToPay),
    ];

    let cellX = tableX;
    values.forEach((value, index) => {
      drawWrappedCellText(
        pdf,
        fontConfig,
        value,
        cellX,
        currentY,
        tableWidths[index],
        rowHeight,
        {
          bold: index === 0 || index === 2,
          fontSize: index === 0 ? 6.6 : index === 2 || index === 6 ? 5.2 : 6.2,
          color: index === 4 || index === 7 ? [220, 38, 38] : [85, 85, 85],
          lineHeight: index === 2 || index === 6 ? 6.3 : 7,
        }
      );
      cellX += tableWidths[index];
    });

    currentY += rowHeight;
  });

  const summaryX = innerRight - 170;
  const summaryY = currentY + 28;
  const summaryWidth = 160;
  const summaryRows = [
    ["Sub-Total", formatMoney(invoiceData.summary.subTotal), false],
    ["Instant Discount", formatDiscountMoney(invoiceData.summary.specialDiscountTotal), true],
    ["Combo Offer", formatDiscountMoney(invoiceData.summary.comboOfferTotal), true],
    ["Taxable", formatMoney(invoiceData.summary.taxableAmount), false],
    ["Exempted", formatMoney(invoiceData.summary.exemptedAmount), false],
    ["Tax Rate", `${invoiceData.summary.gstPercent}%`, false],
    ["IGST - 18%", formatMoney(invoiceData.summary.igstAmount), false],
    ["CGST - 9%", formatMoney(invoiceData.summary.cgstAmount), false],
    ["SGST - 9%", formatMoney(invoiceData.summary.sgstAmount), false],
  ];
  const summaryRowHeight = 18;
  const summaryBodyStartY = summaryY + 47;
  const summaryBodyHeight = summaryRows.length * summaryRowHeight;
  const summaryDividerY = summaryBodyStartY + summaryBodyHeight + 2;
  const summaryTotalY = summaryDividerY + 25;
  const summaryHeight = summaryTotalY - summaryY + 16;

  pdf.setDrawColor(209, 219, 229);
  pdf.roundedRect(summaryX, summaryY, summaryWidth, summaryHeight, 6, 6);
  pdf.setFillColor(247, 249, 251);
  pdf.rect(summaryX, summaryY, summaryWidth, 26, "F");
  drawText(pdf, fontConfig, "Payment Summary", summaryX + 12, summaryY + 17, {
    bold: true,
    fontSize: 10.5,
    color: [15, 76, 129],
  });

  let summaryRowY = summaryBodyStartY;
  summaryRows.forEach(([label, value, isDiscount]) => {
    drawText(pdf, fontConfig, label, summaryX + 12, summaryRowY, {
      fontSize: 8.5,
      color: isDiscount ? [220, 38, 38] : [85, 85, 85],
    });
    drawText(pdf, fontConfig, value, summaryX + summaryWidth - 12, summaryRowY, {
      bold: true,
      fontSize: 8.5,
      color: isDiscount ? [220, 38, 38] : [17, 24, 39],
      align: "right",
    });
    summaryRowY += summaryRowHeight;
  });

  pdf.setDrawColor(209, 213, 219);
  pdf.setLineDashPattern([3, 3], 0);
  pdf.line(summaryX + 12, summaryDividerY, summaryX + summaryWidth - 12, summaryDividerY);
  pdf.setLineDashPattern([], 0);
  drawText(pdf, fontConfig, "TOTAL", summaryX + 12, summaryTotalY, {
    bold: true,
    fontSize: 13,
    color: [15, 76, 129],
  });
  drawText(pdf, fontConfig, formatMoney(invoiceData.summary.amountToPay), summaryX + summaryWidth - 12, summaryTotalY, {
    bold: true,
    fontSize: 13,
    color: [15, 76, 129],
    align: "right",
  });

  const footerY = pageHeight - 62;
  pdf.setDrawColor(229, 231, 235);
  pdf.line(innerLeft, footerY, innerRight, footerY);
  drawText(pdf, fontConfig, "Thank you for registering for the Unified Council Olympiads.", pageWidth / 2, footerY + 18, {
    fontSize: 7.5,
    color: [119, 119, 119],
    align: "center",
  });
  drawText(pdf, fontConfig, "For any invoice related queries contact: exam@unifiedcouncil.com", pageWidth / 2, footerY + 31, {
    fontSize: 7.5,
    color: [119, 119, 119],
    align: "center",
  });

  await fs.writeFile(filePath, Buffer.from(pdf.output("arraybuffer")));
  console.log("[Invoice] Saved PDF:", filePath);
}

async function generateInvoicePdf(registrationCode) {
  if (!registrationCode) {
    const error = new Error("registrationCode is required to generate invoice.");
    error.statusCode = 400;
    throw error;
  }

  const requestedCode = String(registrationCode).trim();
  let registrationRows = await getRegistrationInvoiceData(requestedCode);

  if (!registrationRows) {
    const resolvedRegistration = await getRegistrationByCode(requestedCode);
    const fallbackIdentifiers = [
      resolvedRegistration?.registrationCode,
      resolvedRegistration?.transactionId,
      resolvedRegistration?.InvoiceNo,
      requestedCode,
    ]
      .map((value) => String(value || "").trim())
      .filter(Boolean);

    for (const candidate of [...new Set(fallbackIdentifiers)]) {
      registrationRows = await getRegistrationInvoiceData(candidate);
      if (registrationRows) {
        break;
      }
    }
  }

  if (!registrationRows) {
    const error = new Error("Registration not found for invoice generation.");
    error.statusCode = 404;
    throw error;
  }

  const invoiceData = buildInvoiceData(registrationRows);
  const fileIdentifier = String(
    invoiceData.invoiceNumber ||
      invoiceData.referenceNumber ||
      invoiceData.registrationCode ||
      invoiceData.transactionId ||
      registrationCode ||
      "invoice"
  ).trim();
  const invoicePath = getInvoicePath(fileIdentifier);
  await ensureInvoiceDirectory();
  await renderInvoicePdf(invoiceData, invoicePath);

  return {
    invoicePath,
    invoiceFilename: buildInvoiceFilename(fileIdentifier),
    invoiceUrl: getInvoiceDownloadUrl(invoiceData.registrationCode || requestedCode),
    invoiceData,
  };
}

async function ensureInvoicePdf(registrationCode) {
  return generateInvoicePdf(registrationCode);
}

module.exports = {
  buildInvoiceData,
  ensureInvoiceDirectory,
  ensureInvoicePdf,
  generateInvoicePdf,
  getInvoiceDownloadUrl,
  getInvoicePath,
};
