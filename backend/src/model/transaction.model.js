const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  // 💳 Payment details
  paymentId: {
    type: String,
    required: false,
  },
  paymentLinkId: {
    type: String,
    required: false,
  },
  paymentMethod: {
    type: String,
    default: "razorpay",
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });


const transactionModel = mongoose.model("Transaction", transactionSchema);

module.exports = transactionModel;