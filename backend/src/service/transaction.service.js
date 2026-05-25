const orderStatusModel = require("../model/order.model")
const SellerModel = require("../model/seller.model")
const transactionModel = require("../model/transaction.model")


class transactionService {
  normalizeTransactionStatus(status) {
    const value = String(status || "").toLowerCase();
    if (value === "failed" || value === "fail") return "FAILED";
    if (value === "pending" || value === "processing") return "PENDING";
    if (value === "confirmed" || value === "paid" || value === "success") return "SUCCESS";
    return "SUCCESS";
  }

  // ✅ Create transaction with payment details
  async createTransaction(orderId, paymentData = {}) {
    // find order by id
    const order = await orderStatusModel.findById(orderId).populate("seller");

    if (!order) {
      throw new Error("Order not found");
    }

    const seller = await SellerModel.findById(order.seller._id);

    if (!seller) {
      throw new Error("Seller not found");
    }

    const paymentId = paymentData.paymentId || null;
    const paymentLinkId = paymentData.paymentLinkId || null;

    // Idempotency: do not create duplicate transaction for same order + payment
    const existingTransaction = await transactionModel.findOne({
      order: order._id,
      ...(paymentId ? { paymentId } : {}),
    });
    if (existingTransaction) {
      return existingTransaction;
    }

    // 💳 Enhanced transaction with normalized payment details
    const transaction = new transactionModel({
      seller: seller._id,
      customer: order.user,
      order: order._id,
      paymentId,
      paymentLinkId,
      paymentMethod: paymentData.paymentMethod || "razorpay",
      amount: paymentData.amount || order.totalSellingPrice || 0,
      paymentStatus: this.normalizeTransactionStatus(paymentData.paymentStatus),
      date: new Date(),
    });
    
    const savedTransaction = await transaction.save();
    return savedTransaction;
  }
  // Get transaction by seller id

  async getTransactionBySellerId(sellerId) {
    return await transactionModel
      .find({ seller: sellerId })
      .populate("order")
      .populate({ path: "customer", select: "name email mobile" })
      .sort({ createdAt: -1 });
  }

  async getAllTransactions(){
    return await transactionModel.find().populate("seller order customer");
  }

async getTransactionByUserId(userId, fromDate, toDate) {
  const filter = { customer: userId };

  if (fromDate && toDate) {
    filter.createdAt = {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    };
  }

  return await transactionModel
    .find(filter)
    .populate([
      {
        path: "seller",
        select: "email sellerName mobile businessDetails",
      },
      {
        path: "order",
        select:
          "orderItems totalSellingPrice totalMrpPrice paymentStatus orderStatus discount",
        populate: {
          path: "orderItems",
          populate: {
            path: "product",
            select: "title images sellingPrice mrpPrice",
          },
        },
      },
      {
        path: "customer",
        select: "name email mobile address",
        populate: {
          path: "address",
          select: "locality city state pincode",
        },
      },
    ])
    .sort({ createdAt: -1 })
    .lean();
}
}

module.exports = new transactionService();