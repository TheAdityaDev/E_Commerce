const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const cors = require('cors');
const connectDB = require("./db/db.config");
const rateLimit = require("express-rate-limit");
const sellerRoutes = require("./routes/seller.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require('./routes/user.routes')
const sellerProductRoutes = require("./routes/sellerProduct.routes")
const productRoutes = require('./routes/product.routes')
const cartRoutes = require('./routes/cart.routes')
const orderRoutes = require('./routes/order.routes')
const sellerOrderRoutes = require('./routes/sellerOrder.routes')
const paymentRoutes = require('./routes/payment.routes')
const transactionRoutes = require('./routes/transaction.routes')
const sellerReportRoutes = require('./routes/sellerReport.routes')
const homeCategoryRoutes = require('./routes/homeCategory.routes')
const dealRoutes = require('./routes/deal.routes')

require("dotenv").config();
const helmet = require("helmet");
app.use(helmet());
 
const allowedOrigins = ["http://localhost:5173", "http://10.139.13.185:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


new http.Agent({ keepAlive: true , maxSockets:10});

const port = process.env.PORT || 3000;

const apiLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 second
  max: 3, // limit each IP
  message: {
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// // Example: Node.js middleware
// app.use((req, res, next) => {
//   console.log('DB call request:', req.path, req.method, req.ip, req.headers['user-agent']);
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(apiLimiter);
/* Admin Route */
app.use("/admin", adminRoutes);
app.use("/admin/deals", dealRoutes);

/* Seller Route */
app.use("/api/seller", sellerRoutes);
/* Auth Route  */
app.use("/api/auth", authRoutes);
/* User Route */
app.use('/api/user',userRoutes)
/* Seller Product Route */
app.use('/api/seller/products',sellerProductRoutes)
/* Product Route for users */
app.use('/api/products',productRoutes)
/* Cart route for user */
app.use('/api/cart',cartRoutes)
/* user order routes */
app.use('/api/order',orderRoutes)
/* seller order routes */
app.use('/api/seller/order',sellerOrderRoutes)
/* payment links orders */
app.use('/api/payment',paymentRoutes)
/* transaction routes */
app.use('/api/transactions',transactionRoutes)
/* seller reports */
app.use('/api/seller/report',sellerReportRoutes)

app.use('/api/home/category',homeCategoryRoutes)

app.get('/',(req,res)=>{
  res.json("Welcome To Ram bazaar.")
})

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectDB();
});
