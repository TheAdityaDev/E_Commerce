const mongoose = require('mongoose');
const paymentStatus = require('../domain/paymentStatus');

const paymentOrderSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(paymentStatus),
    default: paymentStatus.PENDING,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: "RAZORPAY",
  },
  paymentLinkId: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },
  order:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  }],
});


const paymentOrderModel = mongoose.model("paymentOrder",paymentOrderSchema);

module.exports = paymentOrderModel;