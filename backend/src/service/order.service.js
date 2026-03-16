const { default: mongoose } = require("mongoose");
const addressModel = require("../model/Address.model");
const orderItemModel = require("../model/orderItem.model");
const userModel = require("../model/User.model");
const orderStatusModel = require("../model/order.model");
const cartModel = require("../model/cart.model");
const orderStatus = require("../domain/orderStatus");
const calculateProductDiscountPercentage = require("./calculateProductDiscountPercentage.service");

class orderService {
  async createOrder(user, shippingAddress, cart) {
    // -----------------------------
    // 1️⃣ Basic validations
    // -----------------------------
    if (!user?._id) {
      throw new Error("User is required to create an order");
    }

    if (!shippingAddress) {
      throw new Error("Shipping address is required");
    }

    if (!cart?.cartItems?.length) {
      throw new Error("Cart is empty");
    }

    // -----------------------------
    // 2️⃣ Ensure shipping address exists in DB
    // -----------------------------
    if (!shippingAddress._id) {
      shippingAddress = await addressModel.create(shippingAddress);
    }

    // -----------------------------
    // 3️⃣ Attach address to user if not already present
    // -----------------------------
    const addressExists = user.addresses?.some(
      (id) => id.toString() === shippingAddress._id.toString()
    );

    if (!addressExists) {
      await userModel.findByIdAndUpdate(user._id, {
        $addToSet: { addresses: shippingAddress._id },
      });
    }

    // -----------------------------
    // 4️⃣ Group cart items by seller
    // -----------------------------
    const itemsBySeller = cart.cartItems.reduce((acc, item) => {
      if (!item.product?.seller) {
        throw new Error("Product seller not found");
      }

      const sellerId =
        typeof item.product.seller === "object"
          ? item.product.seller._id.toString()
          : item.product.seller.toString();

      if (!acc[sellerId]) acc[sellerId] = [];
      acc[sellerId].push(item);

      return acc;
    }, {});

    const orders = [];

    // -----------------------------
    // 5️⃣ Create order per seller
    // -----------------------------
    for (const [sellerId, cartItems] of Object.entries(itemsBySeller)) {
      const totalMrpPrice = cartItems.reduce(
        (sum, item) => sum + item.mrpPrice,
        0
      );

      const totalSellingPrice = cartItems.reduce(
        (sum, item) => sum + item.sellingPrice,
        0
      );

      const totalItem = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      const discount = calculateProductDiscountPercentage(
        totalMrpPrice,
        totalSellingPrice
      );

      // -----------------------------
      // ❌ Check duplicate order (same user, same product)
      // -----------------------------
      for (const item of cartItems) {
        const existingOrder = await orderStatusModel
          .findOne({
            user: user._id,
            seller: sellerId,
            orderStatus: orderStatus.PENDING,
          })
          .populate("orderItems");

        if (existingOrder) {
          const productExists = existingOrder.orderItems.some(
            (orderItem) =>
              orderItem.product.toString() === item.product._id.toString()
          );

          if (productExists) {
            throw new Error("Product already exists in pending order");
          }
        }
      }

      // -----------------------------
      // 6️⃣ Create order items (parallel)
      // -----------------------------

      const orderItems = await Promise.all(
        cartItems.map((item) =>
          orderItemModel.create({
            product: item.product._id,
            size: item.size,
            userId: user._id,
            quantity: item.quantity,
            mrpPrice: item.mrpPrice,
            sellingPrice: item.sellingPrice,
          })
        )
      );

      // -----------------------------
      // 7️⃣ Create order
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
      });

      orders.push(order);
    }

    // -----------------------------
    // 8️⃣ Optional: clear cart
    // -----------------------------
    await cartModel.findByIdAndUpdate(cart._id, {
      $set: { cartItems: [] },
    });

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

    const order = await orderItemModel.findById(orderId).populate("product");
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

  async getSellersOrder(sellerId) {
    return await orderItemModel
      .find({ seller: sellerId })
      .sort({ createdAt: -1 })
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

    order.status = status;

    if (!order) {
      throw new Error("Order not found");
    }
    return await orderItemModel.findByIdAndUpdate(orderId, order, {
      new: true,
    });
  }

  async cancelOrder(orderId, user) {
    const order = await this.findOrderById(orderId);

    if (order.user.toString() !== user._id.toString()) {
      throw new Error("Unauthorized Access");
    }

    order.status = orderStatus.CANCELLED;

    if (!order) {
      throw new Error("Order not found");
    }
    return await orderItemModel.findByIdAndUpdate(orderId, order, {
      new: true,
    });
  }
}

module.exports = new orderService();
