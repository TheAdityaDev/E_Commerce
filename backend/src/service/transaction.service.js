const orderStatusModel = require("../model/order.model")
const SellerModel = require("../model/seller.model")
const transactionModel = require("../model/transaction.model")


class transactionService {
  async createTransaction(orderId) {
    // find order by id
    const order = await orderStatusModel.findById(orderId).populate("seller");

    if (!order) {
      throw new Error("Order not found");
    }

    const seller = await SellerModel.findById(order.seller._id);

    if (!seller) {
      throw new Error("Seller not found");
    }

    const transaction = new transactionModel({
      seller: seller._id,
      customer: order.user,
      order: order._id,
    });
    return await transaction.save();
  }
  // Get transaction by seller id

  async getTransactionBySellerId(sellerId) {
    return await transactionModel
      .find({ seller: sellerId })
      .populate(" order");
  }

  async getAllTransactions(){
    return await transactionModel.find().populate("seller order customer");
  }
}

module.exports = new transactionService();