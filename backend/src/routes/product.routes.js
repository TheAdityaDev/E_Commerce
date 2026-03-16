const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const productController = require("../controller/product.controller");
const userMiddleware = require("../middleware/userAuth.middleware");



/* router.post('/create',rateLimitRoute,abortSignal(3000),productController.createProduct)
router.get('/seller',rateLimitRoute,abortSignal(3000),productController.getProductBySeller)
router.delete('/:productId',rateLimitRoute,abortSignal(3000),productController.deleteProduct)
 */
/* search for product by query  */
router.get(
  "/search",
  userMiddleware,
  rateLimitRoute,
  abortSignal(3000),
  productController.searchProduct
);

/* Get all product with filters */
router.get(
  "/",
  userMiddleware,
  rateLimitRoute,
  abortSignal(3000),
  productController.getAllProducts
);

/* Get product with id */
router.get(
  "/:productId",
  userMiddleware,
  rateLimitRoute,
  abortSignal(3000),
  productController.getProductById
);


module.exports = router;