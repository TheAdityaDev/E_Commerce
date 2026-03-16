const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const dealController = require("../controller/deal.controller");


router.get('/',rateLimitRoute,abortSignal(3000),dealController.getAllDeals)
router.post('/',rateLimitRoute,abortSignal(3000),dealController.createDeal)
router.patch('/:id',rateLimitRoute,abortSignal(3000),dealController.updateDeal)
router.delete('/:id',rateLimitRoute,abortSignal(3000),dealController.deleteDeal)


module.exports = router