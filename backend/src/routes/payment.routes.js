const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const authMiddleware = require("../middleware/userAuth.middleware");
const paymentController= require("../controller/payment.controller");

router.get(
  "/:paymentId",
  rateLimitRoute,
  abortSignal(7000),
  authMiddleware,
  paymentController.paymentSuccessHandler
);

module.exports = router