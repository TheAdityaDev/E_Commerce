const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const sellerMiddleware = require("../middleware/sellerAuth.middleware");
const sellerReportController = require("../controller/sellerReport.controller");


router.get(
  "/",
  rateLimitRoute,
  abortSignal(3000),
  sellerMiddleware,
  sellerReportController.getSellerReport
);

module.exports = router