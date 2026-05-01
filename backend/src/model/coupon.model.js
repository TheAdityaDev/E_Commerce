const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  validityStartDate: {
    type: Date,
    required: true,
  },
  validityExpireDate: {
    type: Date,
    required: true,
  },
  minimumOrderValue: {
    type: Number,
    required: true,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usageLimit: {
    type: Number,
    default: 1,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  usedAt: {
    type: Date,
    default: null,
  },
  usedInPaymentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "paymentOrder",
    default: null,
  },
  description: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

couponSchema.index({ validityExpireDate: 1 }, { expireAfterSeconds: 0 });

const couponModel = mongoose.model("Coupon", couponSchema);

module.exports = couponModel;
