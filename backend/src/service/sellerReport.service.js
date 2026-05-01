const sellerReportModel = require("../model/sellerReport.model");

class sellerReportService {
  async getSellerReport(seller) {
    const sellerId = seller?._id || seller;
    if (!sellerId) {
      throw new Error("Seller id is required to get seller report");
    }

    let sellerReport = await sellerReportModel.findOne({ seller: sellerId });

    if (!sellerReport) {
      sellerReport = await sellerReportModel.create({
        seller: sellerId,
        totalEarnings: 0,
        totalSales: 0,
        totalRefunds: 0,
        netEarnings: 0,
        totalOrders: 0,
        canceledOrder: 0,
        totalTransactions: 0,
      });
      sellerReport = await sellerReport.save();
    }
    return sellerReport;
  }

  async updateSellerReport(sellerReport) {
    try {
      return await sellerReportModel.findOneAndUpdate(
        { _id: sellerReport._id },
        sellerReport,
        {
          returnDocument: "after",
        }
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
}


module.exports = new sellerReportService();