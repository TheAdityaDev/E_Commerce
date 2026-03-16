const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const homeCategoryController = require("../controller/homeCategory.controller");


router.post('/categories',rateLimitRoute,abortSignal(3000),homeCategoryController.createHomeCategories);
router.get('/home-category',rateLimitRoute,abortSignal(3000),homeCategoryController.getAllHomeCategory);
router.patch('/home-category/:id',rateLimitRoute,abortSignal(3000),homeCategoryController.updateHomeCategory);


module.exports = router