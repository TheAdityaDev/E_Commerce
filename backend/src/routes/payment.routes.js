const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const authMiddleware = require("../middleware/userAuth.middleware");
const paymentController= require("../controller/payment.controller");

// status by paymentLinkId (polled by frontend) - MUST come before /:paymentId
router.get(
  "/status",
  rateLimitRoute,
  abortSignal(5000),
  authMiddleware,
  paymentController.getPaymentStatus,
);

// Payment success handler - comes after /status so /status is not matched as :paymentId
router.get(
  "/:paymentId",
  rateLimitRoute,
  abortSignal(7000),
  authMiddleware,
  paymentController.paymentSuccessHandler
);

// Razorpay webhook (use raw body to verify signature)
router.post(
  "/webhook/razorpay",
  express.raw({ type: "application/json" }),
  // no rate limit/auth for webhook - Razorpay will call this
  paymentController.razorpayWebhookHandler,
);

module.exports = router