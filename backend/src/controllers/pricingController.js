const { getExamOptionPrices, saveExamOptionPrices } = require("../models/pricingModal");

async function listExamPrices(_req, res, next) {
  try {
    return res.json({ success: true, data: await getExamOptionPrices() });
  } catch (error) { return next(error); }
}

async function updateExamPrices(req, res, next) {
  try {
    const data = await saveExamOptionPrices(req.body?.prices);
    return res.json({ success: true, message: "Exam prices updated successfully.", data });
  } catch (error) { return next(error); }
}

module.exports = { listExamPrices, updateExamPrices };
