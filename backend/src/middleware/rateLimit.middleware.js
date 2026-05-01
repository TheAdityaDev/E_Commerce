const rateLimit = require("express-rate-limit");

// Global rate limiter - applies to all requests
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === "/health";
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again after 15 minutes",
  skip: (req) => req.method !== "POST", // Only limit POST requests
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again later.",
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

// Moderate limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: "Too many API requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "API rate limit exceeded. Please try again later.",
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

// Strict limiter for password reset
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many password reset attempts. Please try again after an hour.",
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

// Strict limiter for payment-related operations
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 payment requests per minute
  message: "Too many payment requests, please try again later",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Payment rate limit exceeded. Please try again later.",
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

// Lenient limiter for read operations (GET requests)
const readLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 GET requests per minute
  skip: (req) => req.method !== "GET",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Read rate limit exceeded. Please try again later.",
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
  apiLimiter,
  passwordResetLimiter,
  paymentLimiter,
  readLimiter,
};
