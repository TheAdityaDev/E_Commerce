const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const productController = require("../controller/product.controller");
const userMiddleware = require("../middleware/userAuth.middleware");


/* search for product by query  */
router.get(
  "/search",
  rateLimitRoute,
  abortSignal(3000),
  productController.searchProduct
);

/* Get all product with filters */
router.get(
  "/",
  rateLimitRoute,
  abortSignal(3000),
  productController.getAllProducts
);

/* Get product with id */
router.get(
  "/:productId",
  rateLimitRoute,
  abortSignal(3000),
  productController.getProductById
);

/* Get product OG tags for sharing */
router.get(
  "/:productId/og",
  rateLimitRoute,
  abortSignal(3000),
  productController.getProductOG
);



module.exports = router;