const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");

router.post('/send/login-signup-otp',rateLimitRoute,abortSignal(3000),authController.sendLoginOtp)
router.post('/signup',rateLimitRoute,abortSignal(3000),authController.CreateUser)
router.post('/signin',rateLimitRoute,abortSignal(3000),authController.signInUser)
router.post('/forget-password',rateLimitRoute,abortSignal(3000),authController.forgetPassword)
router.post('/reset-password',rateLimitRoute,abortSignal(3000),authController.resetPassword)
router.post('/verify-otp',rateLimitRoute,abortSignal(3000),authController.verificationOTP)
module.exports = router