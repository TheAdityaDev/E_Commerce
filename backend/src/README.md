# Rate Limiting Documentation

## Overview
This backend implements a comprehensive rate limiting system to protect against abuse, DDoS attacks, and ensure fair resource usage.

## Configuration Files

### 1. `middleware/rateLimit.middleware.js`
Contains all rate limiter instances with predefined strategies:
- **globalLimiter**: Applied to all requests (100 req/15min)
- **authLimiter**: For login endpoints (5 attempts/15min)
- **apiLimiter**: For general API endpoints (30 req/min)
- **passwordResetLimiter**: For password reset (3 attempts/1hr)
- **paymentLimiter**: For payment operations (10 req/min)
- **readLimiter**: For GET requests (100 req/min)

### 2. `config/rateLimit.config.js`
Centralized configuration file with:
- Customizable limits for different endpoints
- Whitelist for bypass routes
- Error messages

## Implementation in Routes

### Authentication Routes
```javascript
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimit.middleware');

// Login endpoint
router.post('/login', authLimiter, authController.login);

// Password reset
router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword);
```

### Payment Routes
```javascript
const { paymentLimiter } = require('../middleware/rateLimit.middleware');

// Payment creation
router.post('/create', paymentLimiter, paymentController.createPayment);
router.post('/verify', paymentLimiter, paymentController.verifyPayment);
```

### Product Routes
```javascript
const { apiLimiter, readLimiter } = require('../middleware/rateLimit.middleware');

// Get products (lenient)
router.get('/', readLimiter, productController.getAllProducts);

// Create product (moderate)
router.post('/', apiLimiter, productController.createProduct);
```

## Limits by Category

| Endpoint Type | Limit | Window |
|---|---|---|
| Login | 5 attempts | 15 minutes |
| Password Reset | 3 attempts | 1 hour |
| Payment | 10 requests | 1 minute |
| API (POST/PUT/DELETE) | 30 requests | 1 minute |
| API (GET) | 100 requests | 1 minute |
| Global | 100 requests | 15 minutes |

## Response Format

When rate limit is exceeded, the API returns:
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": 1234567890
}
```

## Production Recommendations

1. **Redis Integration**: For distributed systems, integrate with Redis:
   ```javascript
   const RedisStore = require("rate-limit-redis");
   const redis = require("redis");
   const client = redis.createClient();

   const limiter = rateLimit({
     store: new RedisStore({
       client: client,
       prefix: "rl:",
     }),
     // ... rest of config
   });
   ```

2. **Monitoring**: Add logging for rate limit violations:
   ```javascript
   limiter.skip = (req) => {
     console.log(`Rate limit check: ${req.ip} - ${req.path}`);
   };
   ```

3. **Environment-based Configuration**:
   ```javascript
   const limits = process.env.NODE_ENV === 'production' 
     ? { max: 5, windowMs: 15 * 60 * 1000 }
     : { max: 100, windowMs: 60 * 1000 };
   ```

## Testing

Test rate limits using curl:
```bash
# Test login endpoint
for i in {1..6}; do curl -X POST http://localhost:5000/auth/login; done

# Check response headers for rate limit info
curl -i http://localhost:5000/api/products
```

## Next Steps

- [ ] Integrate Redis for distributed rate limiting
- [ ] Add logging/monitoring
- [ ] Create admin dashboard for rate limit analytics
- [ ] Implement dynamic rate limiting based on user tier
- [ ] Add IP whitelist management
