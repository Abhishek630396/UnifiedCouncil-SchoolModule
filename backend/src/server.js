const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
  override: true,
});
const getDatabaseConnection = require("./config/databaseConnection");

const port = Number(process.env.PORT || 8000);

async function startServer() {
  getDatabaseConnection();

  const app = require("./app");
  const { initializeDatabase } = require("./services/registrationService");
  const { ensureInvoiceDirectory } = require("./services/invoiceService");

  await initializeDatabase();
  await ensureInvoiceDirectory();
  app.listen(port, () => {
    const configuredMode = String(process.env.RAZORPAY_MODE || "").trim().toLowerCase();
    const effectiveMode = configuredMode || "test";
    const razorpayKeyId = String(
      effectiveMode === "live"
        ? process.env.RAZORPAY_LIVE_KEY_ID || process.env.RAZORPAY_KEY_ID || ""
        : process.env.RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_KEY_ID || ""
    );
    const razorpayMode = razorpayKeyId
      ? effectiveMode
      : "missing";

    console.log(`[Startup] Razorpay mode: ${razorpayMode}`);
    console.log(
      `[Startup] Razorpay key prefix: ${razorpayKeyId ? razorpayKeyId.slice(0, 12) : "not-configured"}`
    );
    console.log(`Backend listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
