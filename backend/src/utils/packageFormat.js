function formatExamPrice(item = {}) {
  const examName = String(item.examName || "").trim();
  const price = String(item.price ?? "").trim();

  return [examName, price].filter(Boolean).join("-");
}

function normalizeStoredPackageLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  const parts = raw
    .split("-")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]}-${parts[parts.length - 1]}`;
}

function normalizeStoredPackageList(value) {
  const labels = String(value || "")
    .split(",")
    .map((item) => normalizeStoredPackageLabel(item))
    .filter(Boolean);

  return [...new Set(labels)].join(", ");
}

module.exports = {
  formatExamPrice,
  normalizeStoredPackageLabel,
  normalizeStoredPackageList,
};
