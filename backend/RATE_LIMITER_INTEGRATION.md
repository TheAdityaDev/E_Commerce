/**
 * INTEGRATION GUIDE: Production-Level Rate Limiting
 * 
 * Follow these steps to implement the new rate limiters in your routes
 */

// ============================================
// 1. UPDATE index.js - Add global limiter
// ============================================

const { globalLimiter } = require('./middleware/rateLimit.middleware');

// Add this after cors configuration
app.use(globalLimiter);


// ============================================
// 2. UPDATE auth.routes.js
// ============================================

const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimit.middleware');

// Apply to login
router.post('/login', authLimiter, authController.login);

// Apply to registration
router.post('/register', authLimiter, authController.register);

// Apply to password reset
router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword);


// ============================================
// 3. UPDATE payment.routes.js
// ============================================

const { paymentLimiter } = require('../middleware/rateLimit.middleware');

// Apply to payment operations
router.post('/create-order', paymentLimiter, paymentController.createPaymentOrder);
router.post('/verify-payment', paymentLimiter, paymentController.verifyPayment);


// ============================================
// 4. UPDATE product.routes.js
// ============================================

const { apiLimiter, readLimiter } = require('../middleware/rateLimit.middleware');

// Read operations (GET) - lenient limits
router.get('/', readLimiter, productController.getAllProducts);
router.get('/:id', readLimiter, productController.getProductById);

// Write operations (POST, PUT, DELETE) - stricter limits
router.post('/', apiLimiter, productController.createProduct);
router.put('/:id', apiLimiter, productController.updateProduct);
router.delete('/:id', apiLimiter, productController.deleteProduct);


// ============================================
// 5. UPDATE cart.routes.js
// ============================================

const { apiLimiter, readLimiter } = require('../middleware/rateLimit.middleware');

router.get('/', readLimiter, cartController.getCart);
router.post('/add', apiLimiter, cartController.addToCart);
router.put('/update/:id', apiLimiter, cartController.updateCart);
router.delete('/remove/:id', apiLimiter, cartController.removeFromCart);


// ============================================
// 6. UPDATE order.routes.js
// ============================================

const { apiLimiter, readLimiter } = require('../middleware/rateLimit.middleware');

router.get('/', readLimiter, orderController.getOrders);
router.get('/:id', readLimiter, orderController.getOrderById);
router.post('/', apiLimiter, orderController.createOrder);
router.put('/:id', apiLimiter, orderController.updateOrder);


// ============================================
// EXPECTED BEHAVIOR AFTER IMPLEMENTATION
// ============================================

/*
1. Login attempts limited to 5 per 15 minutes
   - Failed login won't count multiple times
   - Successful login resets the counter

2. Payment operations limited to 10 per minute
   - Prevents payment fraud and duplicate charges
   - Returns 429 with retry information

3. Read operations (GET) are lenient (100/min)
   - Users can browse products freely
   - No experience degradation

4. Write operations (POST, PUT, DELETE) are moderate (30/min)
   - Prevents spam and abuse
   - Reasonable for normal usage

5. Global limit of 100 requests per 15 minutes
   - Acts as ultimate safeguard
   - Covers any uncovered paths
*/


// ============================================
// MONITORING & DEBUGGING
// ============================================

// Add this logging middleware to track rate limit hits
const logRateLimitHits = (req, res, next) => {
  const original_json = res.json;

  res.json = function(data) {
    if (res.statusCode === 429) {
      console.error('[RATE LIMIT] Hit on:', {
        ip: req.ip,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
      });
    }
    return original_json.call(this, data);
  };

  next();
};

// Apply logging middleware
app.use(logRateLimitHits);


// ============================================
// FUTURE ENHANCEMENTS
// ============================================

/*
1. Redis Integration (for multi-server setups):
   - Install: npm install redis rate-limit-redis
   - Allows shared rate limit state across servers

2. Dynamic Rate Limiting:
   - Different limits for authenticated users
   - Premium users get higher limits
   - Admin users bypass limits

3. IP Whitelisting:
   - Whitelist internal services
   - Whitelist trusted partners

4. Analytics Dashboard:
   - Track rate limit violations
   - Identify abuse patterns
   - Generate reports

5. Gradual Backoff:
   - Increase wait time with repeated violations
   - Temporary IP blocking
*/
