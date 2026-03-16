const express = require('express')
const router = express.Router()
const rateLimitRoute = require('../api/apilimit.api')
const abortSignal = require("../api/abort.api");
const userController = require('../controller/user.controller');
const userMiddleware = require('../middleware/userAuth.middleware');


router.get('/profile',rateLimitRoute,userMiddleware,abortSignal(3000),userController.getProfileByJwt)

module.exports = router