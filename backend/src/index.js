const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./db/db.config");
const rateLimitConfig = require("./config/rateLimit.config");

// Routes
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

app.use(helmet());

// DB CONNECTION (IMPORTANT FIX)
connectDB();

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://10.35.211.59:5173",
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
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "8mb" }));

// Rate limiter
const apiLimiter = rateLimit({
  windowMs: rateLimitConfig.global.windowMs,
  max: rateLimitConfig.global.max,
  message: rateLimitConfig.global.message,
});

app.use(apiLimiter);

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/deals", dealRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/posts", postsRoutes);

app.use("/api/seller", sellerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use("/api/seller/products", sellerProductRoutes);
app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/seller/order", sellerOrderRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/seller/report", sellerReportRoutes);

app.use("/api/home/category", homeCategoryRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend working!" });
});

// Root
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome To Ram bazaar." });
});

// IMPORTANT: EXPORT APP FOR VERCEL
module.exports = app;