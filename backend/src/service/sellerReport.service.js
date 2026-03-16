const sellerReportModel = require("../model/sellerReport.model");

class sellerReportService {
  async getSellerReport(seller) {
    let sellerReport = await sellerReportModel.findOne({ seller: seller._id });
    console.log("Seller Report ==>", sellerReport);

    if (!sellerReport) {
      sellerReport = await sellerReportModel.create({
        seller: seller._id,
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
        sellerReport._id,
        sellerReport,
        {
          new: true,
        }
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
}


module.exports = new sellerReportService();