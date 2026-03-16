const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const sellerMiddleware = require("../middleware/sellerAuth.middleware");
const transactionController = require("../controller/transaction.controller");

router.get(
  "/seller",
  rateLimitRoute,
  abortSignal(5000),
  sellerMiddleware,
  transactionController.getTransactionBySeller
);

module.exports = router;
