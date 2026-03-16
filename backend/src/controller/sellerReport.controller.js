const sellerReportService = require("../service/sellerReport.service");

class sellerReportController{
    async getSellerReport(req,res){
        try {
            const seller = req.seller

            const sellerReport = await sellerReportService.getSellerReport(seller._id)

            res.status(200).json(sellerReport)
        } catch (error) {
            throw new Error(error.message);
            
        }
    }
}


module.exports = new sellerReportController()