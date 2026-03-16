const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cartItem",
        required: true,
      },
    ],
    totalSellingPrice: {
      type: Number,
      default: 0,
    },
    totalItem: {
      type: Number,
      default: 0,
    },
    totalMrpPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: Number,
      default: 0,
    },
    couponPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel;
