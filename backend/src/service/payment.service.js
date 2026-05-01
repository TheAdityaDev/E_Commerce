const razorpay = require("../config/razorpayClient.config");
require("dotenv").config();
const orderStatus = require("../domain/orderStatus");
const paymentStatus = require("../domain/paymentStatus");
const orderStatusModel = require("../model/order.model");
const paymentOrderModel = require("../model/paymentOrder.model");
const transactionService = require("./transaction.service");

class paymentService {
async paymentOrder(user, ordersInput, couponDiscount = 0, couponCode = null) {
  const SHIPPING_CHARGE = 79;

  // Normalize orders array
  const orders = Array.isArray(ordersInput) ? ordersInput : [ordersInput];

  if (!orders.length) {
    throw new Error("Order amount missing");
  }

  // ✅ Remove duplicate orders (important fix)
  const uniqueOrders = Array.from(
    new Map(orders.map(o => [String(o._id), o])).values()
  );

  // ✅ Safe total calculation (no double counting)
  const totalAmount = uniqueOrders.reduce((sum, order) => {
    const orderTotal = Number(order.totalSellingPrice || order.totalMrpPrice || 0);
    return sum + orderTotal;
  }, 0);

  if (!totalAmount) {
    throw new Error("Order amount missing");
  }

  // ✅ Final amount calculation
  const finalAmount = Math.max(
    0,
    totalAmount + SHIPPING_CHARGE - Number(couponDiscount || 0)
  );

  // ✅ Debug logs (clean)
  console.log("\n💰 PAYMENT ORDER SUMMARY:");
  console.log(`Orders: ${uniqueOrders.length}`);
  console.log(`Total: ₹${totalAmount}`);
  console.log(`Shipping: ₹${SHIPPING_CHARGE}`);
  console.log(`Discount: ₹${couponDiscount || 0}`);
  console.log(`Final: ₹${finalAmount}`);
  console.log(`Paise: ${finalAmount * 100}\n`);

  // ✅ Create payment order
  const paymentOrder = await paymentOrderModel.create({
    amount: finalAmount,
    user: user._id,
    order: uniqueOrders.map(o => o._id),
    couponCode: couponCode ? String(couponCode).toUpperCase() : null,
  });

  return paymentOrder;
}

  /**
   * Create Razorpay Payment Link
   * Convert ₹ → paise ONLY here
   */
  // (moved/normalized implementation kept below; removed duplicate)

  /**
   * Verify payment (optional - for webhook or callback)
   */
  verifyPaymentSignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }) {
    const crypto = require("crypto");

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === razorpay_signature;
  }

  async getPaymentOrderById(orderId) {
    const paymentOrder = await paymentOrderModel
      .findById(orderId)
      .populate("user order");
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
    const tabs = {paymentOrder, paymentId, paymentLinkId}
    console.table(tabs)
    if (!paymentOrder) {
      throw new Error("Payment order not found");
    }

    // paymentOrder model uses `status` (not `paymentStatus`)
    if (paymentOrder.status !== paymentStatus.PENDING) {
      console.warn(
        `Payment order ${paymentOrder._id} already processed with status: ${paymentOrder.status}`,
      );
      return true; // Already processed
    }

    try {
      const payment = await razorpay.payments.fetch(paymentId);
      console.log(
        `Razorpay payment status: ${payment.status} for payment ${paymentId}`,
      );

      if (payment.status === "captured") {
        console.log(
          `✅ Payment ${paymentId} CAPTURED - updating orders to CONFIRM status`,
        );

        // Payment successful - update all orders to CONFIRM with CONFIRMED payment
        await Promise.all(
          (paymentOrder.order || []).map(async (orderId) => {
            const order = await orderStatusModel.findById(orderId);
            if (order) {
              order.paymentStatus = paymentStatus.CONFIRMED;
              order.orderStatus = orderStatus.CONFIRM;
              await order.save();
              console.log(
                `✅ Order ${orderId} updated: orderStatus=CONFIRM (from PENDING), paymentStatus=CONFIRMED`,
              );
            }
          }),
        );

        // ✅ Create transaction for EACH order (not just first one)
        await Promise.all(
          (paymentOrder.order || []).map(async (orderId) => {
            await transactionService.createTransaction(orderId, {
              paymentId,
              paymentLinkId,
              amount: paymentOrder.amount,
              paymentStatus: paymentStatus.CONFIRMED,
            });
          }),
        );

        paymentOrder.status = paymentStatus.PAID;
        await paymentOrder.save();
        console.log(`✅ Payment order ${paymentOrder._id} marked as PAID`);
        return true;
      } else if (payment.status === "authorized") {
        // Some Razorpay test/live configurations return "authorized" first.
        // Attempt server-side capture before marking payment as failed.
        console.log(
          `⏳ Payment ${paymentId} is AUTHORIZED - attempting capture...`,
        );
        try {
          const capturedPayment = await razorpay.payments.capture(
            paymentId,
            payment.amount,
            payment.currency || "INR",
          );

          if (capturedPayment?.status !== "captured") {
            console.warn(
              `❌ Capture attempt did not complete. Status: ${capturedPayment?.status}`,
            );
            throw new Error("Payment capture not completed");
          }

          await Promise.all(
            (paymentOrder.order || []).map(async (orderId) => {
              const order = await orderStatusModel.findById(orderId);
              if (order) {
                order.paymentStatus = paymentStatus.CONFIRMED;
                order.orderStatus = orderStatus.CONFIRM;
                await order.save();
                console.log(
                  `✅ Order ${orderId} updated after capture: orderStatus=CONFIRM, paymentStatus=CONFIRMED`,
                );
              }
            }),
          );

          await Promise.all(
            (paymentOrder.order || []).map(async (orderId) => {
              await transactionService.createTransaction(orderId, {
                paymentId,
                paymentLinkId,
                amount: paymentOrder.amount,
                paymentStatus: paymentStatus.CONFIRMED,
              });
            }),
          );

          paymentOrder.status = paymentStatus.PAID;
          await paymentOrder.save();
          console.log(
            `✅ Payment ${paymentId} captured server-side, payment order marked as PAID`,
          );
          return true;
        } catch (captureError) {
          console.error(
            `❌ Failed to capture authorized payment ${paymentId}:`,
            captureError,
          );
          throw captureError;
        }
      } else {
        // Payment not captured - update orders to CANCELLED
        console.warn(
          `❌ Payment ${paymentId} NOT captured. Status: ${payment.status}`,
        );

        await Promise.all(
          (paymentOrder.order || []).map(async (orderId) => {
            const order = await orderStatusModel.findById(orderId);
            if (order) {
              order.paymentStatus = paymentStatus.FAILED;
              order.orderStatus = orderStatus.CANCELLED;
              await order.save();
              console.log(
                `❌ Order ${orderId} CANCELLED: paymentStatus=FAILED, orderStatus=CANCELLED`,
              );
            }
          }),
        );

        paymentOrder.status = paymentStatus.FAILED;
        await paymentOrder.save();
        return false;
      }
    } catch (err) {
      console.error(`❌ Error processing payment ${paymentId}:`, err);

      // On error, mark orders as CANCELLED
      await Promise.all(
        (paymentOrder.order || []).map(async (orderId) => {
          const order = await orderStatusModel.findById(orderId);
          if (order) {
            order.paymentStatus = paymentStatus.FAILED;
            order.orderStatus = orderStatus.CANCELLED;
            await order.save();
          }
        }),
      );

      paymentOrder.status = paymentStatus.FAILED;
      await paymentOrder.save();
      throw err;
    }
  }

async createRazorpayPaymentLink(user, amount, orderId) {
  try {
    // ✅ Validate user
    if (!user?.name || !user?.email || !user?.mobile) {
      throw new Error("User data missing");
    }

    // ✅ Validate amount
    if (!amount || isNaN(amount)) {
      throw new Error("Invalid amount");
    }

    // ✅ Explicit extra charges (if any)
    const extraCharges = 79; // shipping / platform fee
    const finalAmount = Number(amount) + extraCharges;

    // ✅ Convert ₹ → paise
    const amountInPaise = Math.round(finalAmount * 100);

    // ✅ Format mobile (E.164 for India)
    const formattedContact = `+91${String(user.mobile)
      .replace(/\D/g, "")
      .slice(-10)}`;

    // ✅ Base URL
    const baseUrl =
      process.env.FRONTEND_URL ||
      process.env.BASE_URL ||
      "http://localhost:5173";

    const paymentLinkRequest = {
      amount: amountInPaise,
      currency: "INR",

      reference_id: `order_${orderId}`,
      description: `Payment for Order #${orderId}`,

      customer: {
        name: user.name,
        email: user.email,
        contact: formattedContact,
      },

      notify: {
        email: true,
        sms: true,
      },

      callback_url: `${baseUrl}/payment/success/${orderId}`,
      callback_method: "get",

      // ⏳ Optional expiry (e.g., 30 minutes)
      expire_by: Math.floor(Date.now() / 1000) + 30 * 60,
    };

    console.log("Razorpay Request:", paymentLinkRequest);

    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

    return paymentLink;

  } catch (error) {
    console.error(
      "RAZORPAY ERROR:",
      error?.response?.data || error?.message || error
    );
    throw new Error("Failed to create payment link");
  }
}
}

module.exports = new paymentService();
