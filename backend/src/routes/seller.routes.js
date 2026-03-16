const express = require("express");
const router = express.Router();
const sellerController = require("../controller/seller.controller");
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const sellerMiddleware = require("../middleware/sellerAuth.middleware");

/**
 * @description Get seller profile
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 * @returns {Promise<void>}
 */
router.get(
  "/profile",
  rateLimitRoute,
  sellerMiddleware,
  abortSignal(3000), // ✅ now this is a function
  sellerController.getSellerProfile
);

router.post(
  "/",
  rateLimitRoute,
  abortSignal(3000),
  sellerController.createSeller
);

router.get(
  "/",
  rateLimitRoute,
  abortSignal(3000),
  sellerController.getAllSellers
);

router.patch(
  "/",
  rateLimitRoute,
  sellerMiddleware,
  abortSignal(3000),
  sellerController.updateSeller
);

router.post(
  "/verify/login-otp",
  rateLimitRoute,
  abortSignal(3000),
  sellerController.verifyLoginOtp
);

module.exports = router;
