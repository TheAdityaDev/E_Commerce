const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const cartController = require("../controller/cart.controller");
const authMiddleware = require("../middleware/userAuth.middleware");



router.get(
  "/",
  rateLimitRoute,
  abortSignal(3000),
  authMiddleware,
  cartController.findUserCartHandler
);

router.put(
  "/add",
  rateLimitRoute,
  abortSignal(3000),
  authMiddleware,
  cartController.addCartItemToCart
);


router.delete(
  "/item/:cartItemId",
  rateLimitRoute,
  abortSignal(3000),
  authMiddleware,
  cartController.deleteCartItem
);


router.put(
  "/item/:cartItemId",
  rateLimitRoute,
  abortSignal(3000),
  authMiddleware,
  cartController.updateCartItem
);

module.exports = router
