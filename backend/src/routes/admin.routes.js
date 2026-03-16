const express = require("express");
const rateLimitRoute = require("../api/apilimit.api");
const router = express.Router();
const abortSignal = require("../api/abort.api");
const sellerController = require("../controller/seller.controller");


/**
 * @description update seller status
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Object} status -The response url
 * @param {Function} next - The next function
 * @returns {Promise<void>}
 * **/ 
router.patch(
  "/seller/:id/status/:status",
  rateLimitRoute,
  abortSignal(3000),
  sellerController.updateSellerAccountStatus
);

module.exports = router;
