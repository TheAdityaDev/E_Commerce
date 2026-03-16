const paymentOrderModel = require("../model/paymentOrder.model");
const cartService = require("../service/cart.service");
const orderService = require("../service/order.service");
const paymentService = require("../service/payment.service");

class orderController {
  async createOrder(req, res) {
    const { shippingAddress } = req.body;
    const { paymentMethod } = req.query;
    try {
      const user = req.user;

      if (!user) throw new Error("User not found");

      const cart = await cartService.findUserCart(user);

      const order = await orderService.createOrder(user, shippingAddress, cart);

      const paymentOrder  = await paymentService.paymentOrder(user, order);

      const response = {}

      if(paymentMethod === "RAZORPAY"){
        const payment = paymentService.createRazorpayPaymentLink(
          user,
          paymentOrder.amount,
          paymentOrder._id
        )
        response.payment_link_url = payment.short_url
        paymentOrder.paymentLinkId = payment.id
      
        await paymentOrderModel.findByIdAndUpdate(paymentOrder._id, paymentOrder)

        // await paymentOrder.save()
      res.status(200).json(response)
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrdersById(req, res) {
    try {
      const { orderItem } = req.params.orderId;

      if (!orderItem) throw new Error("Order not found");

      const order = await orderService.getOrdersById(orderItem);
      return res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserOrderHistory(req, res) {
    try {
      const userId = await req.user._id.toString();
      const order = await orderService.userOrderHistory(userId);

      return res.status(200).json({ orders: order });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSellersOrder(req, res) {
    try {
      const sellerId = await req.seller._id;
      const order = await orderService.getSellersOrder(sellerId);
      return res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { orderStatus } = req.body;
      const order = await orderService.updateOrderStatus(orderId, orderStatus);
      return res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const user = await req.user;
      const cancelOrder = await orderService.cancelOrder(orderId, user);
      return res.status(200).json(cancelOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrderItemById(req, res) {
    try {
      const { orderId } = req.params;
      const order = await orderService.getOrdersById(orderId);
      return res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new orderController();
