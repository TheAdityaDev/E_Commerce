const razorpay = require("../config/razorpayClient.config");
const orderStatus = require("../domain/orderStatus");
const paymentStatus = require("../domain/paymentStatus");
const orderStatusModel = require("../model/order.model");
const paymentOrderModel = require("../model/paymentOrder.model");

class paymentService {
  async paymentOrder(user, orders) {
    const amount = orders.reduce(
      (sum, order) => sum + order.totalSellingPrice,
      0
    );

    const paymentOrder = new paymentOrderModel.create({
      amount,
      user: user._id,
      orders: orders.map((order) => order._id),
    });

    return await paymentOrder.save();
  }

  async getPaymentOrderById(orderId) {
    const paymentOrder = await paymentOrderModel
      .findById(orderId)
      .populate("user orders");
    if (!paymentOrder) {
      throw new Error("Payment order not found");
    }
    return paymentOrder;
  }

  async getPaymentOrderByPaymentLinkId(paymentLinkId) {
    const paymentOrder = await paymentOrderModel.findOne({ paymentLinkId });
    if (!paymentOrder) {
      throw new Error("Payment order not found");
    }
    return paymentOrder;
  }

  async proceedPayment(paymentOrder, paymentId, paymentLinkId) {
    if (paymentOrder.status === paymentStatus.PENDING) {
      const payment = await razorpay.payments.fetch(paymentId);

      if (payment.status === "captured") {
        await Promise.all(
          (paymentOrder.orders || []).map(async (orderId) => {
            const order = await orderStatusModel.findById(orderId);

            (order.paymentStatus = paymentStatus.CONFIRMED),
              (order.orderStatus = orderStatus.PLACED),
              await order.save();
          })
        );
         paymentOrder.status = paymentStatus.PAID;


        return await paymentOrder.save();
      }else{
        paymentOrder.status = paymentStatus.FAILED;
         paymentOrder.save();
        }
    }
    return false
  }

  async createRazorpayPaymentLink(user, amount, orderId) {
    try {
      const paymentLinkRequest = {
        amount: amount * 100,
        currency: "INR",
        customer: {
          name: user.name,
          email: user.email,
        },
        notify: {
          email: true,
        },
        receipt: orderId,
        payment_capture: 1,
        callback_url: `http://localhost:5000/payment/success/${orderId}`,
        callback_method: "GET",
      };

      const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

      return paymentLink;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}



module.exports = new paymentService()