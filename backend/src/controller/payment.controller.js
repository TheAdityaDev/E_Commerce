const cartModel = require("../model/cart.model");
const orderService = require("../service/order.service");
const paymentService = require("../service/payment.service");
const sellerService = require("../service/seller.service");
const sellerReportService = require("../service/sellerReport.service");
const transactionService = require("../service/transaction.service");

const paymentSuccessHandler = async (req,res) => {
    const {paymentId} = req.params;
    const {paymentLinkId} = req.query


    try {
        const user = await req.user

        const paymentOrder = await paymentService.getPaymentOrderById(
            paymentLinkId
        )

        const paymentSuccess = await paymentService.proceedPayment(
            paymentOrder,
            paymentId,
            paymentLinkId
        )

        if(paymentSuccess){
            for(let orderId of paymentOrder.order){
                const order = orderService.findOrderById(orderId)

                // Create transaction fot the order
                await transactionService.createTransaction(order);

                // Get seller and update seller request 
                const seller = await sellerService.getSellerById(order.seller)

                const sellerReport = await sellerReportService.getSellerReport(seller)

                // update seller report
                sellerReport.totalOrders += 1,
                sellerReport.totalEarnings += order.totalSellingPrice
                sellerReport.totalEarnings += order.orderItems.length
               

                const updatedReport = await sellerReportService.updateSellerReport(sellerReport)

                console.log("SellerReport ==>",sellerReport);
            }
            
            await cartModel.findOneAndUpdate(
                {user:user._id},
                {cartItems:[]},
                {new:true}
            )

            return res.status(201).json({
                message:"Payment successful"
            })
        }else{
            return res.status(201).json({
              message: "Payment failed",
            });
        }
    } catch (error) {
        throw new Error(message.error);
        
    }
}

class paymentController{
    
}

module.exports ={
    paymentSuccessHandler
}