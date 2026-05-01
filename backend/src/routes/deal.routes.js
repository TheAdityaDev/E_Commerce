const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const dealController = require("../controller/deal.controller");
const userMiddleware = require("../middleware/userAuth.middleware");

router.get(
  "/",
  rateLimitRoute,
  userMiddleware,
  abortSignal(3000),
  dealController.getAllDeals,
);
router.post(
  "/",
  rateLimitRoute,
  userMiddleware,
  abortSignal(3000),
  dealController.createDeal,
);
router.patch(
  "/:id",
  rateLimitRoute,
  userMiddleware,
  abortSignal(3000),
  dealController.updateDeal,
);
router.delete(
  "/:id",
  rateLimitRoute,
  userMiddleware,
  abortSignal(3000),
  dealController.deleteDeal,
);

module.exports = router;
