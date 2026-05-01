const transactionService = require("../service/transaction.service");

class TransactionController {
  async getTransactionBySeller(req, res) {
    try {
      const seller = req.seller;

      const transactions = await transactionService.getTransactionBySellerId(
        seller._id,
      );

      return res.status(200).json(transactions);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getTransactionByUser(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const transactions = await transactionService.getTransactionByUserId(
        user._id,
      );

      return res.status(200).json(transactions);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new TransactionController();
