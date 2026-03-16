const mongoose = require("mongoose");
const orderStatus = require("../domain/orderStatus");
const paymentStatus = require("../domain/paymentStatus");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderItem",
      required: true,
    },
  ],
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  totalMrpPrice: {
    type: Number,
    required: true,
  },
  totalSellingPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    enum: Object.values(orderStatus),
    default: orderStatus.PENDING,
  },
  totalItem: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: Object.values(paymentStatus),
    default: paymentStatus.PENDING,
  },
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  deliveryDate: {
    type: Date,
    default: function () {
        return Date.now() + 7 * 24 * 60 * 60 * 1000;
    },
  },
});



const orderStatusModel =mongoose.model("orderStatus",orderSchema);


module.exports = orderStatusModel;