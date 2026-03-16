const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const authMiddleware = require("../middleware/userAuth.middleware");
const orderController = require("../controller/order.controller");

// Create a new order - should be POST so that req.body (shippingAddress, etc.) is available
router.post(
  "/",
  rateLimitRoute,
  abortSignal(3000),
  authMiddleware,
  orderController.createOrder
);

router.get(
  "/user",
  rateLimitRoute,
  abortSignal(3000),
  authMiddleware,
  orderController.getUserOrderHistory
);

router.put(
  "/:orderId/cancel",
  rateLimitRoute,
  abortSignal(3000),
  authMiddleware,
  orderController.cancelOrder
);

router.get(
  "/:orderId",
  rateLimitRoute,
  abortSignal(3000),
  authMiddleware,
  orderController.getOrdersById
);


router.get(
  "/item/:orderId",
  rateLimitRoute,
  abortSignal(3000),
  authMiddleware,
  orderController.getOrderItemById
);




module.exports = router;
