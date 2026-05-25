const paymentStatus = require("../domain/paymentStatus");
const cartService = require("../service/cart.service");
const orderService = require("../service/order.service");
const paymentService = require("../service/payment.service");

class orderController {
  async createOrder(req, res) {
    try {
      const {
        shippingAddress,
        couponDiscount = 0,
        couponCode = null,
      } = req.body;
      const user = req.user;

      if (!user) throw new Error("User not found");

      // Fetch cart and DO NOT clear it inside orderService.createOrder
      const cart = await cartService.findUserCart(user); 

      if (!cart?.cartItems?.length) {
        throw new Error("Cart is empty or already processed");
      }

      if (!shippingAddress) {
        throw new Error("Shipping address is required");
      }

      // ✅ Create orders
      const orders = await orderService.createOrder(
        user,
        shippingAddress,
        cart,
      );

      if (!orders?.length) {
        throw new Error("Orders not created");
      }


      // ✅ Create payment order (fixed logic)
      const paymentOrder = await paymentService.paymentOrder(
        user,
        orders,
        couponDiscount,
        couponCode,
      );

      if (!paymentOrder) {
        throw new Error("Payment order creation failed");
      }

      return res.status(201).json({
        message: "Order created successfully",
        paymentOrderId: paymentOrder._id,
        orderIds: orders.map((o) => o._id),
        amount: paymentOrder.amount,
        status: paymentStatus.PENDING,
      });
    } catch (error) {
      console.error("❌ ORDER ERROR:", error.message);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create order",
      });
    }

    orderService.clearUserCart(user._id)
  }

  async getOrdersById(req, res) {
    try {
      const orderId = req.params.orderId;

      if (!orderId) throw new Error("Order not found");

      const order = await orderService.getOrdersById(orderId);
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  async getUserOrderHistory(req, res) {
    try {
      const userId = req.user._id.toString();
      const order = await orderService.userOrderHistory(userId);

      return res.status(200).json({ orders: order });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get unpaid orders (payment PENDING) - for retry payment
  async getPendingPaymentOrders(req, res) {
    try {
      const userId = req.user._id.toString();
      const orders = await orderService.getPendingPaymentOrders(userId);

      return res.status(200).json({
        message: "Pending payment orders",
        orders: orders,
        count: orders.length,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getSellersOrder(req, res) {
    try {
      const sellerId = req.seller._id;

      const order = await orderService.getSellersOrder(sellerId);
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { orderId, orderStatus } = req.params;

      const order = await orderService.updateOrderStatus(orderId, orderStatus);
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async cancelOrder(req, res) {
    try {
      const orderId = req.params.orderId;
      const user = req.user;

      const cancelOrder = await orderService.cancelOrder(orderId, user);

      return res.status(200).json(cancelOrder);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getOrderItemById(req, res) {
    try {
      const { orderId } = req.params;
      const order = await orderService.findOrderById(orderId);
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new orderController();
