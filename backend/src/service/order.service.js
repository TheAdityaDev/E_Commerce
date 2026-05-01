const { default: mongoose } = require("mongoose");
const addressModel = require("../model/Address.model");
const orderItemModel = require("../model/orderItem.model");
const userModel = require("../model/User.model");
const orderStatusModel = require("../model/order.model");
const cartModel = require("../model/cart.model");
const orderStatus = require("../domain/orderStatus");
const calculateProductDiscountPercentage = require("./calculateProductDiscountPercentage.service");
const productModel = require("../model/product.model");
const paymentStatus = require("../domain/paymentStatus");
const sellerReportService = require("./sellerReport.service");
const transactionModel = require("../model/transaction.model");
const cartItemModel = require("../model/cartItem.model");

class orderService {
  async createOrder(user, shippingAddress, cart) {
    // -----------------------------
    // 1️⃣ Validations
    // -----------------------------
    if (!user?._id) throw new Error("User is required");
    if (!shippingAddress) throw new Error("Shipping address required");
    if (!cart?.cartItems?.length) throw new Error("Cart is empty");

    console.log("🔍 DEBUG: Cart Items Count =", cart.cartItems.length);
    console.log(
      "🔍 DEBUG: Cart Items =",
      JSON.stringify(
        cart.cartItems.map((item) => ({
          productId: item.product?._id,
          quantity: item.quantity,
          mrpPrice: item.mrpPrice,
          sellingPrice: item.sellingPrice,
          seller: item.product?.seller?._id || item.product?.seller,
        })),
        null,
        2,
      ),
    );

    // -----------------------------
    // 2️⃣ Ensure address exists
    // -----------------------------
    if (!shippingAddress._id) {
      shippingAddress = await addressModel.create(shippingAddress);
    }

    // -----------------------------
    // 3️⃣ Attach address to user
    // -----------------------------
    const addressExists = user.address?.some(
      (id) => id.toString() === shippingAddress._id.toString(),
    );

    if (!addressExists) {
      await userModel.findByIdAndUpdate(user._id, {
        $addToSet: { addresses: shippingAddress._id },
      });
    }

    // -----------------------------
    // 4️⃣ Group items by seller
    // -----------------------------
    const itemsBySeller = cart.cartItems.reduce((acc, item) => {
      if (!item.product?._id) throw new Error("Invalid product");

      const sellerId =
        typeof item.product.seller === "object"
          ? item.product.seller._id.toString()
          : item.product.seller.toString();

      if (!acc[sellerId]) acc[sellerId] = [];
      acc[sellerId].push(item);

      return acc;
    }, {});

    console.log("🔍 DEBUG: Sellers =", Object.keys(itemsBySeller));
    for (const [sellerId, items] of Object.entries(itemsBySeller)) {
      console.log(`  Seller ${sellerId}: ${items.length} items`);
    }

    const orders = [];

    // -----------------------------
    // 5️⃣ Create order per seller
    // -----------------------------
    for (const [sellerId, cartItems] of Object.entries(itemsBySeller)) {
      const totalMrpPrice = cartItems.reduce(
        (sum, item) => sum + item.mrpPrice * item.quantity,
        0,
      );

      const totalSellingPrice = cartItems.reduce(
        (sum, item) => sum + item.sellingPrice * item.quantity,
        0,
      );

      const totalItem = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      const discount = calculateProductDiscountPercentage(
        totalMrpPrice,
        totalSellingPrice,
      );

      console.log(`💳 ORDER FOR SELLER ${sellerId}:`);
      console.log(`   Items: ${cartItems.length}, Quantities: ${totalItem}`);
      console.log(
        `   MRP Total: ₹${totalMrpPrice}, Selling Total: ₹${totalSellingPrice}`,
      );
      console.log(`   Discount: ${discount}%`);

      // -----------------------------
      // 6️⃣ Create order items
      // -----------------------------
      const orderItems = await Promise.all(
        cartItems.map((item) => {
          const productId =
            typeof item.product === "object" ? item.product._id : item.product;

          return orderItemModel.create({
            product: productId,
            size: item.size,
            userId: user._id,
            quantity: item.quantity,
            mrpPrice: item.mrpPrice,
            sellingPrice: item.sellingPrice,
          });
        }),
      );

      // -----------------------------
      // 8️⃣ Create order (PENDING PAYMENT)
      // -----------------------------
      const order = await orderStatusModel.create({
        user: user._id,
        seller: sellerId,
        orderItems: orderItems.map((i) => i._id),
        totalMrpPrice,
        totalSellingPrice,
        totalItem,
        discount,
        shippingAddress: shippingAddress._id,
        orderStatus: orderStatus.PENDING,
        paymentStatus: paymentStatus.PENDING, // ✅ ADD THIS
      });
      orders.push(order);
    }

    return orders;
  }

  async findOrderById(orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order ID.");
    }
    const order = await orderStatusModel
      .findById(orderId)
      .populate([
        { path: "seller" },
        { path: "orderItems", populate: { path: "product" } },
        { path: "shippingAddress" },
      ]);
    if (!order) {
      throw new Error("Order not found with ID: " + orderId);
    }
    return order;
  }

  async getOrdersById(orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order.");
    }

    const order = await orderStatusModel
      .findById(orderId)
      .populate([
        { path: "seller", select: "sellerName" },
        { path: "user", select: "name email mobile" },
        { path: "orderItems", populate: { path: "product" } },
        { path: "shippingAddress" },
      ]);

    if (!order) {
      throw new Error("Invalid order.");
    }
    return order;
  }

  async userOrderHistory(userId) {
    return await orderStatusModel.find({ user: userId }).populate([
      {
        path: "seller",
        select: "name email shopName phone", // ❌ bank details हट गए
      },
      {
        path: "orderItems",
        populate: {
          path: "product",
          select: "title price images",
        },
      },
      {
        path: "shippingAddress",
        select: "address city state pincode",
      },
    ]);
  }

  // Get orders with PENDING payment status (for retry payment)
  async getPendingPaymentOrders(userId) {
    const paymentStatus = require("../domain/paymentStatus");

    return await orderStatusModel
      .find({
        user: userId,
        paymentStatus: paymentStatus.PENDING,
      })
      .populate([
        {
          path: "seller",
          select: "name email shopName phone",
        },
        {
          path: "orderItems",
          populate: {
            path: "product",
            select: "title price images",
          },
        },
        {
          path: "shippingAddress",
          select: "address city state pincode",
        },
      ])
      .sort({ orderDate: -1 });
  }

  async getSellersOrder(sellerId) {
    console.log("sellerId in service:", sellerId);

    return await orderStatusModel
      .find({ seller: sellerId })
      .sort({ orderDate: -1 })
      .populate([
        { path: "seller" },
        { path: "orderItems", populate: { path: "product" } },
        { path: "shippingAddress" },
      ]);
  }

  async updateOrderStatus(orderId, orderStatus) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order.");
    }

    const order = await this.findOrderById(orderId);

    order.orderStatus = orderStatus;

    if (!order) {
      throw new Error("Order not found");
    }
    return await orderStatusModel
      .findByIdAndUpdate(orderId, order, {
        returnDocument: "after",
      })
      .populate([
        { path: "seller" },
        { path: "orderItems", populate: { path: "product" } },
        { path: "shippingAddress" },
      ]);
  }

  async cancelOrder(orderId, user) {
    const order = await this.findOrderById(orderId);

    if (order.user.toString() !== user._id.toString()) {
      throw new Error("Unauthorized Access");
    }

    if (order.orderStatus === orderStatus.CANCELLED) {
      throw new Error("Order is already cancelled");
    }

    order.orderStatus = orderStatus.CANCELLED;

    // Update Seller Report if the order was already paid/confirmed
    if (
      order.paymentStatus === paymentStatus.CONFIRMED ||
      order.paymentStatus === paymentStatus.PAID
    ) {
      try {
        const sellerReport = await sellerReportService.getSellerReport(
          order.seller,
        );
        if (sellerReport) {
          sellerReport.canceledOrder += 1;
          sellerReport.totalEarnings -= order.totalSellingPrice || 0;
          sellerReport.totalOrders = Math.max(0, sellerReport.totalOrders - 1); // Ensure totalOrders doesn't go negative
          sellerReport.totalRefunds += order.totalSellingPrice || 0;
          sellerReport.totalTransactions = Math.max(
            0,
            sellerReport.totalTransactions - 1,
          ); // Ensure totalTransactions doesn't go negative
          await sellerReportService.updateSellerReport(sellerReport);
        }

        await transactionModel.findOneAndUpdate(
          { order: order._id },
          { paymentStatus: "REFUNDED" },
          { returnDocument: "after" },
        );

        cartItemModel.findOneAndDelete(
          { user: user._id },
          { order: order._id },
          { returnDocument: "after" },
        );
      } catch (reportError) {
        console.error(
          "Failed to update seller report on cancellation:",
          reportError,
        );
      }
    }

    return await orderStatusModel
      .findByIdAndUpdate(orderId, order, {
        returnDocument: "after",
      })
      .populate([{ path: "orderItems", populate: { path: "product" } }]);
  }

  async clearUserCart(userId) {
    await cartModel.findOneAndUpdate(
      { user: userId },
      { cartItems: [] },
      { returnDocument: "after" },
    );
  }
}

module.exports = new orderService();
