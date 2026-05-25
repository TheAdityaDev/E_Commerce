const cartModel = require("../model/cart.model");
const paymentOrderModel = require("../model/paymentOrder.model");
const orderStatusModel = require("../model/order.model");
const orderService = require("../service/order.service");
const paymentService = require("../service/payment.service");
const sellerService = require("../service/seller.service");
const sellerReportService = require("../service/sellerReport.service");
const couponService = require("../service/coupon.service");
const productModel = require("../model/product.model");
const paymentStatus = require("../domain/paymentStatus");
const orderStatus = require("../domain/orderStatus");

const paymentSuccessHandler = async (req, res) => {
  const { paymentId } = req.params;
  const { paymentLinkId, paymentOrderId } = req.query;

  try {
    const user = req.user;
    if (!user)
      return res.status(400).json({ message: "User not authenticated" });

    if (!paymentId)
      return res.status(400).json({ message: "Payment ID required" });

    // Fetch payment order by paymentOrderId (preferred for inline checkout)
    // or by Razorpay paymentLinkId (hosted payment link flow)
    let paymentOrder;
    try {
      if (paymentOrderId) {
        paymentOrder = await paymentService.getPaymentOrderById(paymentOrderId);
      } else if (paymentLinkId) {
        paymentOrder =
          await paymentService.getPaymentOrderByPaymentLinkId(paymentLinkId);
      } else {
        return res
          .status(400)
          .json({ message: "paymentOrderId or paymentLinkId is required" });
      }
    } catch (err) {
      if (/not found/i.test(err?.message || "")) {
        return res.status(404).json({ message: "Payment order not found" });
      }
      throw err;
    }

    if (!paymentOrder) {
      return res.status(404).json({ message: "Payment order not found" });
    }

    // Process the payment and update order statuses
    const paymentSuccess = await paymentService.proceedPayment(
      paymentOrder,
      paymentId,
      paymentLinkId,
    );

    if (paymentSuccess) {
      // Create transactions and update seller reports for each order
      // ℹ️ NOTE: proceedPayment() already updated order statuses to CONFIRM + CONFIRMED payment status
      const promises = (paymentOrder.order || []).map(async (orderId) => {
        try {
          const order = await orderService.findOrderById(orderId);
          if (!order) return;

          // Reduce product quantity
          for (const item of order.orderItems) {
            if (item.product?._id) {
              await productModel.findByIdAndUpdate(item.product._id, {
                $inc: { quantity: -item.quantity },
              });
            }
          }

          // Seller report
          const seller = await sellerService.getSellerById(order.seller);
          const sellerReport =
            await sellerReportService.getSellerReport(seller);

          if (sellerReport) {
            sellerReport.totalOrders += 1;
            sellerReport.totalEarnings += order.totalSellingPrice || 0;
            sellerReport.totalItems += order.orderItems?.length || 0;
            await sellerReportService.updateSellerReport(sellerReport);
          }
        } catch (err) {
          console.error(`Error for order ${orderId}:`, err);
        }
      });

      // Wait for all updates to complete
      await Promise.all(promises);

      // Clear user's cart
      await cartModel.findOneAndUpdate(
        { user: user._id },
        { cartItems: [] },
        { returnDocument: "after" },
      );
      await paymentOrderModel.findByIdAndUpdate(paymentOrder._id, {
        status: paymentStatus.PAID,
      });

      // If coupon was used for this payment, mark it used and delete it.
      if (paymentOrder?.couponCode) {
        await couponService.consumeCouponAfterPayment({
          code: paymentOrder.couponCode,
          userId: user?._id || paymentOrder?.user,
          paymentOrderId: paymentOrder._id,
          deleteAfterUse: true,
        });
      }

      const totalSellingPrice = (paymentOrder.order || []).reduce(
        (sum, o) => sum + (o.totalSellingPrice || 0),
        0,
      );
      const tax =
        paymentOrder.amount -
        79 +
        (paymentOrder.couponDiscount || 0) -
        totalSellingPrice;

      cartModel.findOneAndDelete({ user: user._id }).catch((err) => {
        console.error("Error clearing cart after payment:", err);
      });

      return res.status(200).json({
        message: "Payment successful! Order confirmed.",
        status: "Paid",
        paymentOrderId: paymentOrder._id,
        orderIds: paymentOrder.order,
      });
    } else {
      return res.status(200).json({
        message: "❌ Payment failed or not captured. Order cancelled.",
        status: "Failed",
        paymentOrderId: paymentOrder._id,
        orderIds: paymentOrder.order,
      });
    }
  } catch (error) {
    console.error("❌ PAYMENT HANDLER CRITICAL ERROR:", error);
    return res.status(500).json({
      message: "Error processing payment",
      error: error.message,
    });
  }
};

// Get payment order status by Razorpay payment link id
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentLinkId } = req.query;
    if (!paymentLinkId)
      return res.status(400).json({ message: "paymentLinkId required" });

    const paymentOrder =
      await paymentService.getPaymentOrderByPaymentLinkId(paymentLinkId);
    return res.status(200).json({
      status: paymentOrder.status,
      paymentOrderId: paymentOrder._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to fetch payment status" });
  }
};

// Razorpay webhook handler
const razorpayWebhookHandler = async (req, res) => {
  const crypto = require("crypto");
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!signature || !secret) {
      console.warn("Webhook signature or secret missing");
      return res.status(400).send("invalid signature");
    }

    const digest = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (signature !== digest) {
      console.warn("Invalid webhook signature");
      return res.status(400).send("invalid signature");
    }

    const payload = JSON.parse(req.body.toString());
    const event = payload.event;

    const paymentLinkId =
      payload.payload?.payment_link?.entity?.id ||
      payload.payload?.payment?.entity?.payment_link_id;
    const paymentId = payload.payload?.payment?.entity?.id;

    if (!paymentLinkId) {
      console.warn("Webhook received without paymentLinkId", event);
      return res.status(200).send("no payment link id");
    }

    try {
      const paymentOrder =
        await paymentService.getPaymentOrderByPaymentLinkId(paymentLinkId);
      if (!paymentOrder) return res.status(404).send("payment order not found");

      await paymentService.proceedPayment(
        paymentOrder,
        paymentId,
        paymentLinkId,
      );

      return res.status(200).send("ok");
    } catch (err) {
      console.error("Webhook processing error", err);
      return res.status(500).send("server error");
    }
  } catch (err) {
    console.error("Webhook handler error", err);
    return res.status(500).send("server error");
  }
};

module.exports = {
  paymentSuccessHandler,
  getPaymentStatus,
  razorpayWebhookHandler,
};
