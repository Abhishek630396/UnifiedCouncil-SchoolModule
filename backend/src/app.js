const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const emailRoutes = require("./routes/emailRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const interaktWebhookRoutes = require("./routes/interaktWebhook");
const paymentRoutes = require("./routes/paymentRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const schoolRegistrationRoutes = require("./routes/school/schoolRegistrationRoutes");
const studentRegistrationRoutes = require("./routes/school/studentRegistrationRoutes");
const schoolAuthRoutes = require("./routes/schoolAuthRoutes");
const schoolDashboardRoutes = require("./routes/schoolDashboardRoutes");
const staticContentRoutes = require("./routes/staticContentRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

const configuredOrigins = String(process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const paymentGatewayOrigins = [
  "https://secure.ccavenue.com",
  "https://test.ccavenue.com",
];

const allowedOrigins = [
  ...new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://coor.unifiedcouncil.com",
    ...paymentGatewayOrigins,
    ...configuredOrigins,
  ]),
];

const allowedOriginPatterns = [
  /^https:\/\/([a-z0-9-]+\.)*unifiedcouncil\.com$/i,
  /^http:\/\/localhost(?::\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/i,
];

function isAllowedOrigin(origin) {
  return (
    allowedOrigins.includes(origin) ||
    allowedOriginPatterns.some((pattern) => pattern.test(origin))
  );
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Unified Council backend is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/interakt", interaktWebhookRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin/exam-prices", pricingRoutes);
app.use("/api/school-registration", schoolRegistrationRoutes);
app.use("/api/student-registration-through-school", studentRegistrationRoutes);
app.use("/api/school-auth", schoolAuthRoutes);
app.use("/api/school-dashboard", schoolDashboardRoutes);
app.use("/api", staticContentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
