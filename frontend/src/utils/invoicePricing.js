const DEFAULT_GST_PERCENT = 18;
const DEFAULT_EXAM_FEE = 350;
const COMBO_EXAM_IDS = ["nstse", "uimo", "uieo", "uico"];
// Only these four Olympiads participate in the combo discount.
// UMO can be added separately, but it is not part of the discounted bundle.
const COMBO_DISCOUNT_BY_OPTION = {
  1: 0.07,
  2: 0.1,
  3: 0.15,
};

const PRICING_CATALOG = {
  nstse: {
    1: { onlinePackageMRP: 0, onlinePackageAmount: 0, comboOffer: 0, examFee: 350 },
    2: { onlinePackageMRP: 2297, onlinePackageAmount: 450, comboOffer: 0, examFee: 350, packageGstApplicable: true },
    3: { onlinePackageMRP: 5598, onlinePackageAmount: 850, comboOffer: 0, examFee: 350, packageGstApplicable: true },
  },
  uimo: {
    1: { onlinePackageMRP: 0, onlinePackageAmount: 0, comboOffer: 0, examFee: 350 },
    2: { onlinePackageMRP: 1298, onlinePackageAmount: 450, comboOffer: 0, examFee: 350, packageGstApplicable: true },
    3: { onlinePackageMRP: 2199, onlinePackageAmount: 850, comboOffer: 0, examFee: 350, packageGstApplicable: true },
  },
  uieo: {
    1: { onlinePackageMRP: 0, onlinePackageAmount: 0, comboOffer: 0, examFee: 350 },
    2: { onlinePackageMRP: 299, onlinePackageAmount: 150, comboOffer: 0, examFee: 350, packageGstApplicable: true },
    3: { onlinePackageMRP: 2798, onlinePackageAmount: 450, comboOffer: 0, examFee: 350, packageGstApplicable: true },
  },
  uico: {
    1: { onlinePackageMRP: 0, onlinePackageAmount: 0, comboOffer: 0, examFee: 350 },
    2: { onlinePackageMRP: 299, onlinePackageAmount: 150, comboOffer: 0, examFee: 350, packageGstApplicable: true },
    3: { onlinePackageMRP: 2197, onlinePackageAmount: 450, comboOffer: 0, examFee: 350, packageGstApplicable: true },
  },
  umo: {
    1: { onlinePackageMRP: 0, onlinePackageAmount: 0, comboOffer: 0, examFee: 650 },
    2: { onlinePackageMRP: 0, onlinePackageAmount: 0, comboOffer: 0, examFee: 651 },
    3: { onlinePackageMRP: 0, onlinePackageAmount: 0, comboOffer: 0, examFee: 850 },
  },
};

export function roundCurrency(amount) {
  return Number(Number(amount || 0).toFixed(2));
}

function getGstPercent() {
  const configured = Number(process.env.REACT_APP_GST_PERCENT || DEFAULT_GST_PERCENT);
  return Number.isFinite(configured) && configured >= 0 ? configured : DEFAULT_GST_PERCENT;
}

function getExamPricing(examId, optionId) {
  const examKey = String(examId || "").trim().toLowerCase();
  const optionKey = Number(optionId || 0);
  return PRICING_CATALOG[examKey]?.[optionKey] || null;
}

function getCartComboConfiguration(cart = []) {
  const comboItems = COMBO_EXAM_IDS.map((examId) =>
    Array.isArray(cart) ? cart.find((item) => String(item.examId || "").trim().toLowerCase() === examId) : null
  );

  if (comboItems.some((item) => !item)) {
    return null;
  }

  const optionId = Number(comboItems[0]?.optionId || 0);
  const discountRate = COMBO_DISCOUNT_BY_OPTION[optionId] || 0;

  if (!discountRate || comboItems.some((item) => Number(item.optionId || 0) !== optionId)) {
    return null;
  }

  return {
    optionId,
    discountRate,
    qualifyingExamIds: new Set(COMBO_EXAM_IDS),
  };
}

function allocateRoundedDiscount(totalDiscount, weights = []) {
  const roundedTotalDiscount = roundCurrency(totalDiscount);
  const totalWeight = roundCurrency(weights.reduce((sum, weight) => sum + Number(weight || 0), 0));

  if (!roundedTotalDiscount || !totalWeight) {
    return weights.map(() => 0);
  }

  const allocations = weights.map((weight, index) => {
    if (index === weights.length - 1) {
      return 0;
    }

    return roundCurrency((roundedTotalDiscount * Number(weight || 0)) / totalWeight);
  });

  const allocatedSoFar = roundCurrency(allocations.reduce((sum, value) => sum + value, 0));
  allocations[weights.length - 1] = roundCurrency(roundedTotalDiscount - allocatedSoFar);
  return allocations;
}

function recomputeRowTotals(row) {
  row.gstOnFee = row.isStandalonePricedPackage ? 0 : roundCurrency((row.examFee * row.gstPercent) / 100);
  row.gstOnPackages = row.packageGstApplicable ? roundCurrency((row.onlinePackageAmount * row.gstPercent) / 100) : 0;
  row.amountToPay = roundCurrency(row.examFee + row.gstOnFee + row.onlinePackageAmount + row.gstOnPackages);
}

function applyComboDiscountToRows(rows = []) {
  const comboConfig = getCartComboConfiguration(rows);
  if (!comboConfig) {
    return;
  }

  const qualifyingRows = rows.filter((row) => comboConfig.qualifyingExamIds.has(row.examId));
  const qualifyingWeights = qualifyingRows.map((row) => row.examFee + row.onlinePackageAmount);
  const qualifyingSubtotal = roundCurrency(qualifyingWeights.reduce((sum, value) => sum + value, 0));
  const extraComboDiscount = roundCurrency(qualifyingSubtotal * comboConfig.discountRate);
  const allocations = allocateRoundedDiscount(extraComboDiscount, qualifyingWeights);

  qualifyingRows.forEach((row, index) => {
    const allocatedDiscount = roundCurrency(allocations[index] || 0);
    const componentAllocations = allocateRoundedDiscount(allocatedDiscount, [row.examFee, row.onlinePackageAmount]);
    const examDiscount = roundCurrency(componentAllocations[0] || 0);
    const packageDiscount = roundCurrency(componentAllocations[1] || 0);

    row.comboOffer = roundCurrency(row.comboOffer + allocatedDiscount);
    row.examFee = roundCurrency(row.examFee - examDiscount);
    row.onlinePackageAmount = roundCurrency(row.onlinePackageAmount - packageDiscount);
    recomputeRowTotals(row);
  });
}

function computeInvoiceBreakupItem(item = {}) {
  const pricing = getExamPricing(item.examId, item.optionId);

  if (!pricing) {
    throw new Error(`Pricing not configured for ${item.examId || "unknown"} option ${item.optionId || "unknown"}.`);
  }

  const gstPercent = getGstPercent();
  const isStandalonePricedPackage = pricing.packageAsStandalone === true;
  const packageGstApplicable = pricing.packageGstApplicable === true;
  const standalonePackageAmount = roundCurrency(pricing.examFee ?? DEFAULT_EXAM_FEE);
  const examFee = isStandalonePricedPackage ? 0 : standalonePackageAmount;
  const gstOnFee = isStandalonePricedPackage ? 0 : roundCurrency((examFee * gstPercent) / 100);
  const onlinePackageMRP = roundCurrency(pricing.onlinePackageMRP || 0);
  const onlinePackageAmount = isStandalonePricedPackage
    ? standalonePackageAmount
    : roundCurrency(pricing.onlinePackageAmount || 0);
  const specialDiscount = roundCurrency(Math.max(onlinePackageMRP - onlinePackageAmount, 0));
  const gstOnPackages = packageGstApplicable ? roundCurrency((onlinePackageAmount * gstPercent) / 100) : 0;
  const comboOffer = roundCurrency(pricing.comboOffer || 0);
  const amountToPay = roundCurrency(examFee + gstOnFee + onlinePackageAmount + gstOnPackages - comboOffer);
  const selectedPriceLabel = String(item.price ?? "").trim();

  return {
    examId: String(item.examId || "").trim().toLowerCase(),
    optionId: Number(item.optionId || 0),
    examLabel: [String(item.examName || "").trim(), selectedPriceLabel || roundCurrency(amountToPay).toFixed(2)]
      .filter(Boolean)
      .join("-"),
    gstPercent,
    packageGstApplicable,
    examFee,
    gstOnFee,
    onlinePackageMRP,
    specialDiscount,
    onlinePackageAmount,
    gstOnPackages,
    comboOffer,
    amountToPay,
    isStandalonePricedPackage,
  };
}

export function getOptionPricingSummary(examId, optionId) {
  const breakdown = computeInvoiceBreakupItem({ examId, optionId });

  return {
    gstPercent: breakdown.gstPercent,
    gst: roundCurrency(breakdown.gstOnFee + breakdown.gstOnPackages),
    total: roundCurrency(breakdown.amountToPay),
  };
}

export function buildCartInvoiceBreakdown(cart = []) {
  const rows = cart.map((item) => ({
    ...computeInvoiceBreakupItem(item),
  }));

  applyComboDiscountToRows(rows);

  const summary = {
    gstPercent: getGstPercent(),
    specialDiscountTotal: roundCurrency(rows.reduce((sum, row) => sum + row.specialDiscount, 0)),
    comboOfferTotal: roundCurrency(rows.reduce((sum, row) => sum + row.comboOffer, 0)),
    taxableAmount: roundCurrency(rows.reduce((sum, row) => sum + row.examFee + row.onlinePackageAmount, 0)),
    totalExamFee: roundCurrency(rows.reduce((sum, row) => sum + row.examFee, 0)),
    totalGstOnFee: roundCurrency(rows.reduce((sum, row) => sum + row.gstOnFee, 0)),
    totalOnlinePackageMRP: roundCurrency(rows.reduce((sum, row) => sum + row.onlinePackageMRP, 0)),
    totalOnlinePackageAmount: roundCurrency(rows.reduce((sum, row) => sum + row.onlinePackageAmount, 0)),
    totalGstOnPackages: roundCurrency(rows.reduce((sum, row) => sum + row.gstOnPackages, 0)),
    exemptedAmount: 0,
    amountToPay: roundCurrency(rows.reduce((sum, row) => sum + row.amountToPay, 0)),
  };

  summary.subTotal = roundCurrency(summary.taxableAmount + summary.specialDiscountTotal + summary.comboOfferTotal);
  return {
    rows,
    summary,
  };
}
