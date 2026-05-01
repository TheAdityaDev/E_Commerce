const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db/db.config");
const rateLimit = require("express-rate-limit");
const sellerRoutes = require("./routes/seller.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const sellerProductRoutes = require("./routes/sellerProduct.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const sellerOrderRoutes = require("./routes/sellerOrder.routes");
const postsRoutes = require("./routes/posts.routes");
const paymentRoutes = require("./routes/payment.routes");
const transactionRoutes = require("./routes/transaction.routes");
const sellerReportRoutes = require("./routes/sellerReport.routes");
const homeCategoryRoutes = require("./routes/homeCategory.routes");
const dealRoutes = require("./routes/deal.routes");
const couponRoutes = require("./routes/coupon.routes");
const aiRoutes = require("./routes/ai.routes");

require("dotenv").config();
const helmet = require("helmet");
const rateLimitConfig = require("./config/rateLimit.config");

app.use(helmet());
new http.Agent({ keepAlive: true, maxSockets: 10 });

const allowedOrigins = [
  "http://localhost:5173",
  "http://10.35.211.59:5173", // mobile IP frontend
  "https://bcw49lr2-5173.inc1.devtunnels.ms",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400,
  }),
);

// Test route
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend working!" });
});

const port = process.env.PORT || 3000;

const apiLimiter = rateLimit({
  windowMs: rateLimitConfig.global.windowMs, // 10 minute
  max: rateLimitConfig.global.max, // limit each IP
  message: rateLimitConfig.global.message,
  standardHeaders: true,
  legacyHeaders: false,
});


// Increase limits to handle base64 image payloads from the frontend
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "8mb" }));
app.use(bodyParser.json({ limit: "8mb" }));

app.use(apiLimiter);
/* Admin Route */
app.use("/api/admin", adminRoutes);
app.use("/api/admin/deals", dealRoutes);
/* Coupon Route */
app.use("/api/coupon", couponRoutes);

app.use("/api/posts", postsRoutes);

/* Seller Route */
app.use("/api/seller", sellerRoutes);
/* Auth Route  */
app.use("/api/auth", authRoutes);
/* User Route */
app.use("/api/user", userRoutes);
/* Seller Product Route */
app.use("/api/seller/products", sellerProductRoutes);
/* Product Route for users */
app.use("/api/products", productRoutes);
/* Cart route for user */
app.use("/api/cart", cartRoutes);
/* user order routes */
app.use("/api/order", orderRoutes);
/* seller order routes */
app.use("/api/seller/order", sellerOrderRoutes);
/* payment links orders */
app.use("/api/payment", paymentRoutes);
/* transaction routes */
app.use("/api/transactions", transactionRoutes);
/* seller reports */
app.use("/api/seller/report", sellerReportRoutes);

app.use("/api/home/category", homeCategoryRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json("Welcome To Ram bazaar.");
});

app.listen(port, "0.0.0.0", async () => {
  console.log(`Server is running on port ${port}`);
  await connectDB();
});
