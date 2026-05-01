/**
 * Rate Limiting Configuration
 * Centralized configuration for all rate limiting strategies
 */

const rateLimitConfig = {
  // Global settings
  global: {
    enabled: true,
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
    message: "Too many requests from this IP",
  },

  // Authentication (login, signup, etc.)
  auth: {
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts
      skipSuccessfulRequests: true,
    },
    signup: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 signup attempts
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 password reset attempts
    },
    emailVerification: {
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 5, // 5 verification attempts
    },
  },

  // API operations
  api: {
    general: {
      windowMs: 60 * 1000, // 1 minute
      max: 30, // requests per minute
    },
    search: {
      windowMs: 60 * 1000, // 1 minute
      max: 50, // more permissive for search
    },
    upload: {
      windowMs: 60 * 1000, // 1 minute
      max: 10, // fewer upload requests
    },
  },

  // Payment operations (strict)
  payment: {
    checkout: {
      windowMs: 60 * 1000, // 1 minute
      max: 5, // 5 checkout attempts per minute
    },
    verify: {
      windowMs: 60 * 1000, // 1 minute
      max: 10, // 10 verification attempts
    },
  },

  // Read operations (lenient)
  read: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // high limit for reads
  },

  // Whitelist - routes that bypass rate limiting
  whitelist: ["/health", "/", "/api/health"],

  // Error responses
  errorMessages: {
    tooManyRequests: "Too many requests. Please try again later.",
    retryAfter: "Please try again after {minutes} minutes",
  },
};

module.exports = rateLimitConfig;
