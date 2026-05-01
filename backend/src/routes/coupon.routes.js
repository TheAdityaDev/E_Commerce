const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const couponController = require("../controller/coupon.controller");
const userMiddleware = require("../middleware/userAuth.middleware");

// Public routes
router.get(
  "/code/:code",
  userMiddleware,
  rateLimitRoute,
  abortSignal(3000),
  couponController.getCouponByCode,
);
router.post(
  "/apply",
  userMiddleware,
  rateLimitRoute,
  abortSignal(3000),
  couponController.validateCoupon,
);

// Admin routes
router.get(
  "/",
  rateLimitRoute,
  userMiddleware,
  abortSignal(3000),
  couponController.getAllCoupons,
);
router.get(
  "/:id",
  rateLimitRoute,
  userMiddleware,
  abortSignal(3000),
  couponController.getCouponById,
);
router.post(
  "/create",
  rateLimitRoute,
  userMiddleware,
  abortSignal(3000),
  couponController.createCoupon,
);
router.put(
  "/:id",
  rateLimitRoute,
  userMiddleware,
  abortSignal(3000),
  couponController.updateCoupon,
);
router.patch(
  "/:id/status",
  userMiddleware,
  rateLimitRoute,
  abortSignal(3000),
  couponController.toggleCouponStatus,
);
router.delete(
  "/:id",
  rateLimitRoute,
  userMiddleware,
  abortSignal(3000),
  couponController.deleteCoupon,
);

module.exports = router;
