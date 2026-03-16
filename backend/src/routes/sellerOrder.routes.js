const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const sellerMiddleware = require("../middleware/sellerAuth.middleware");
const orderController = require("../controller/order.controller");


router.get(
  "/",
  rateLimitRoute,
  sellerMiddleware,
  abortSignal(3000), // ✅ now this is a function
  orderController.getSellersOrder
);

router.patch(
  "/:orderId/products/:orderStatus",
  rateLimitRoute,
  sellerMiddleware,
  abortSignal(3000), // ✅ now this is a function
  orderController.updateOrderStatus
);



module.exports = router