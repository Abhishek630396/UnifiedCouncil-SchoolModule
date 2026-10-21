const { runSql, sqlNumber, sqlString } = require("../config/db");

const EXAM_OPTIONS = [
  ["NSTSE", 1], ["NSTSE", 2], ["NSTSE", 3],
  ["UIMO", 1], ["UIMO", 2], ["UIMO", 3],
  ["UIEO", 1], ["UIEO", 2], ["UIEO", 3],
  ["UIGKO", 1], ["UIGKO", 2],
  ["UCO", 1], ["UCO", 2], ["UCO", 3],
  ["UMO", 1], ["UMO", 2], ["UMO", 3],
];
const COMBO_EXAMS = ["NSTSE", "UIMO", "UIEO", "UCO"];
const COMBO_DISCOUNT_BY_OPTION = { 1: 0.07, 2: 0.1, 3: 0.15 };

function roundCurrency(value) {
  return Number(Number(value || 0).toFixed(2));
}

function parseJsonResult(output) {
  const normalized = String(output || "").replace(/^\uFEFF/, "").trim();
  const start = normalized.indexOf("[");
  const end = normalized.lastIndexOf("]");
  return start >= 0 && end >= start ? JSON.parse(normalized.slice(start, end + 1).replace(/[\r\n]+/g, "")) : [];
}

async function ensureExamPricesTable() {
  await runSql(`
    IF OBJECT_ID('dbo.Tbl_ExamOptionPrices', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Tbl_ExamOptionPrices (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ExamCode NVARCHAR(20) NOT NULL,
        OptionId INT NOT NULL,
        MRP DECIMAL(18,2) NOT NULL DEFAULT 0,
        MSP DECIMAL(18,2) NOT NULL DEFAULT 0,
        DiscountedPrice DECIMAL(18,2) NOT NULL DEFAULT 0,
        Updated_Date DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT UQ_ExamOptionPrices UNIQUE (ExamCode, OptionId)
      );
    END;
  `);
}

async function getExamOptionPrices() {
  await ensureExamPricesTable();
  const rows = parseJsonResult(await runSql(`
    SET NOCOUNT ON;
    SELECT ExamCode AS examCode, OptionId AS optionId, MRP AS mrp, MSP AS msp,
      DiscountedPrice AS discountedPrice, Updated_Date AS updatedDate
    FROM dbo.Tbl_ExamOptionPrices ORDER BY ExamCode, OptionId FOR JSON PATH;
  `));
  const saved = new Map(rows.map((row) => [`${String(row.examCode).toUpperCase()}-${row.optionId}`, row]));
  return EXAM_OPTIONS.map(([examCode, optionId]) => {
    const savedPrice = saved.get(`${examCode}-${optionId}`);
    return {
      examCode,
      optionId,
      mrp: Number(savedPrice?.mrp || 0),
      msp: Number(savedPrice?.msp || 0),
      discountedPrice: Number(savedPrice?.discountedPrice || 0),
      updatedDate: savedPrice?.updatedDate || null,
      isConfigured: Boolean(savedPrice),
    };
  });
}

function calculateSchoolRegistrationPricing(selections, prices) {
  if (!Array.isArray(selections) || !Array.isArray(prices) || !selections.length) {
    const error = new Error("At least one priced Olympiad selection is required.");
    error.statusCode = 400;
    throw error;
  }

  const selectionsByExam = new Map();
  const baseRows = selections.map((selection) => {
    const examCode = String(selection.examCode || "").trim().toUpperCase();
    const optionId = selection.optionId === null ? null : Number(selection.optionId);
    if (!examCode || selectionsByExam.has(examCode) ||
      (optionId !== null && !Number.isSafeInteger(optionId))) {
      const error = new Error("The selected Olympiad options are invalid.");
      error.statusCode = 400;
      throw error;
    }

    if (optionId === null) {
      const row = { examCode, optionId, price: 0 };
      selectionsByExam.set(examCode, row);
      return row;
    }

    const priceRow = prices.find(
      (candidate) => candidate.examCode === examCode && Number(candidate.optionId) === optionId
    );
    const price = Number(priceRow?.discountedPrice);
    if (!priceRow?.isConfigured || !Number.isFinite(price) || price < 0) {
      const error = new Error(`The current price for ${examCode} option ${optionId} is unavailable.`);
      error.statusCode = 409;
      throw error;
    }

    const row = { examCode, optionId, price: roundCurrency(price) };
    selectionsByExam.set(examCode, row);
    return row;
  });

  const comboOptionId = Number(selectionsByExam.get(COMBO_EXAMS[0])?.optionId);
  const comboDiscountRate = COMBO_DISCOUNT_BY_OPTION[comboOptionId] || 0;
  const qualifiesForCombo = Boolean(
    comboDiscountRate &&
    COMBO_EXAMS.every((examCode) => selectionsByExam.has(examCode) &&
      Number(selectionsByExam.get(examCode).optionId) === comboOptionId)
  );

  const rows = baseRows.map((row) => {
    const comboDiscount = qualifiesForCombo && COMBO_EXAMS.includes(row.examCode)
      ? roundCurrency(row.price * comboDiscountRate)
      : 0;
    const taxablePrice = roundCurrency(row.price - comboDiscount);
    const gst = roundCurrency(taxablePrice * 0.18);
    return {
      ...row,
      comboDiscount,
      taxablePrice,
      gst,
      amount: roundCurrency(taxablePrice + gst),
    };
  });

  return {
    rows,
    amount: roundCurrency(rows.reduce((total, row) => total + row.amount, 0)),
  };
}

function normalizePrices(prices) {
  if (!Array.isArray(prices) || prices.length === 0) {
    const error = new Error("At least one option price is required.");
    error.statusCode = 400;
    throw error;
  }

  const allowed = new Set(EXAM_OPTIONS.map(([code, id]) => `${code}-${id}`));
  return prices.map((row) => {
    const examCode = String(row.examCode || "").trim().toUpperCase();
    const optionId = Number(row.optionId);
    const mrp = Number(row.mrp);
    const msp = Number(row.msp);
    const discountedPrice = Number(row.discountedPrice);
    if (!allowed.has(`${examCode}-${optionId}`) || ![mrp, msp, discountedPrice].every(Number.isFinite)) {
      const error = new Error("Every option must have valid numeric prices.");
      error.statusCode = 400;
      throw error;
    }
    if ([mrp, msp, discountedPrice].some((price) => price < 0)) {
      const error = new Error("Prices cannot be negative.");
      error.statusCode = 400;
      throw error;
    }
    if (msp > mrp || discountedPrice > msp) {
      const error = new Error(`${examCode} Option ${optionId}: discounted price must be at most MSP, and MSP at most MRP.`);
      error.statusCode = 400;
      throw error;
    }
    return { examCode, optionId, mrp, msp, discountedPrice };
  });
}

async function saveExamOptionPrices(prices) {
  await ensureExamPricesTable();
  const normalized = normalizePrices(prices);
  const statements = normalized.map((row) => `
    MERGE dbo.Tbl_ExamOptionPrices AS target
    USING (SELECT ${sqlString(row.examCode)} AS ExamCode, ${row.optionId} AS OptionId) AS source
    ON target.ExamCode = source.ExamCode AND target.OptionId = source.OptionId
    WHEN MATCHED THEN UPDATE SET MRP=${sqlNumber(row.mrp)}, MSP=${sqlNumber(row.msp)}, DiscountedPrice=${sqlNumber(row.discountedPrice)}, Updated_Date=GETDATE()
    WHEN NOT MATCHED THEN INSERT (ExamCode, OptionId, MRP, MSP, DiscountedPrice, Updated_Date)
      VALUES (${sqlString(row.examCode)}, ${row.optionId}, ${sqlNumber(row.mrp)}, ${sqlNumber(row.msp)}, ${sqlNumber(row.discountedPrice)}, GETDATE());
  `);
  await runSql(`SET NOCOUNT ON; BEGIN TRANSACTION; ${statements.join("\n")} COMMIT TRANSACTION;`);
  return getExamOptionPrices();
}

module.exports = {
  EXAM_OPTIONS,
  calculateSchoolRegistrationPricing,
  getExamOptionPrices,
  saveExamOptionPrices,
};
