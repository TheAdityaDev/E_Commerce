const transactionService = require("../service/transaction.service")

class TransactionController {
    async getTransactionBySeller(req, res) {
        
        try {
            const seller = req.seller

            const transactions = await transactionService.getTransactionBySellerId(seller._id)

            res.status(200).json(transactions)

        } catch (error) {
            throw new Error(error.message);
            
        }
    
    }
}

module.exports = new TransactionController()