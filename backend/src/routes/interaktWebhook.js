const express = require("express");

const router = express.Router();

function getWebhookSecret(req) {
  return (
    req.headers["x-interakt-secret"] ||
    req.headers["x-webhook-secret"] ||
    req.headers["interakt-secret"] ||
    req.body?.secret ||
    ""
  );
}

function logWebhookEvent(payload) {
  const eventName =
    payload?.event ||
    payload?.type ||
    payload?.eventName ||
    payload?.message_type ||
    "unknown";

  const logData = {
    event: eventName,
    phoneNumber: payload?.phoneNumber || payload?.data?.phoneNumber || null,
    messageId: payload?.id || payload?.messageId || payload?.data?.id || null,
    status: payload?.status || payload?.data?.status || null,
    payload,
  };

  switch (eventName) {
    case "message_api_sent":
      console.log("[Interakt Webhook] Message sent", logData);
      break;
    case "message_api_delivered":
      console.log("[Interakt Webhook] Message delivered", logData);
      break;
    case "message_api_read":
      console.log("[Interakt Webhook] Message read", logData);
      break;
    case "message_api_failed":
      console.error("[Interakt Webhook] Message failed", logData);
      break;
    case "message_received":
      console.log("[Interakt Webhook] Incoming customer message", logData);
      break;
    default:
      console.log("[Interakt Webhook] Unhandled event", logData);
      break;
  }
}

router.post("/webhook", (req, res) => {
  const configuredSecret = process.env.INTERAKT_WEBHOOK_SECRET || "";
  const receivedSecret = getWebhookSecret(req);

  if (configuredSecret && receivedSecret !== configuredSecret) {
    console.error("[Interakt Webhook] Secret verification failed", {
      hasReceivedSecret: Boolean(receivedSecret),
    });
    return res.status(401).json({
      success: false,
      message: "Invalid webhook secret.",
    });
  }

  console.log("[Interakt Webhook] Payload received", req.body);
  logWebhookEvent(req.body || {});

  return res.status(200).json({
    success: true,
    message: "Webhook received.",
  });
});

module.exports = router;
