const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const sellerMiddleware = require("../middleware/sellerAuth.middleware");
const productController = require("../controller/product.controller");


router.get(
  "/",
  sellerMiddleware,
  rateLimitRoute,
  abortSignal(3000),
  productController.getAllProducts
);

router.post('/',sellerMiddleware,rateLimitRoute,abortSignal(3000),productController.createProduct)


router.delete(
  "/:productId",
  sellerMiddleware,
  rateLimitRoute,
  abortSignal(3000),
  productController.deleteProduct
);

router.patch(
  "/productId",
  sellerMiddleware,
  rateLimitRoute,
  abortSignal(3000),
  productController.updateProduct
);

module.exports = router