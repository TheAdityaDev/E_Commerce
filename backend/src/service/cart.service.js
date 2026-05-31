const cartModel = require("../model/cart.model");
const cartItemModel = require("../model/cartItem.model");
const calculateProductDiscountPercentage = require("./calculateProductDiscountPercentage.service");

class cartService {
  async findUserCart(user) {
    let cart = await cartModel.findOne({ user: user._id }).populate({
      path: "cartItems",
      populate: {
        path: "product",
        populate: {
          path: "seller",
        },
      },
    });

    if (!cart) {
      cart = await cartModel.create({ user: user._id });
    }

    if (!cart) {
      throw new Error("Cart not found");
    }

    let totalMrpPrice = 0;
    let totalSellingPrice = 0;
    let totalItem = cart.cartItems.length;

    cart.cartItems.forEach((cartItem) => {
      totalMrpPrice += cartItem.mrpPrice * cartItem.quantity;
      totalSellingPrice += cartItem.sellingPrice * cartItem.quantity;
    });

    cart.totalMrpPrice = totalMrpPrice;
    cart.totalSellingPrice = totalSellingPrice;
    cart.totalItem = totalItem;
    cart.discount = calculateProductDiscountPercentage(
      totalMrpPrice,
      totalSellingPrice,
    );

    let cartItems = await cartItemModel.find({ cart: cart._id }).populate({
      path: "product",
      populate: {
        path: "seller",

        select: "email sellerName businessDetails GSTIN mobile", // ❌ bank details हट गए
      },
    });

    cart.cartItems = cartItems;

    await cart.save();
    return cart;
  }

  async addCartItem(user, product, size, quantity) {
    let cart = await this.findUserCart(user);
    if (!cart) {
      throw new Error("Cart not found");
    }

    // ✅ Atomic operation using findOneAndUpdate with upsert to prevent race condition
    let cartItem = await cartItemModel
      .findOneAndUpdate(
        {
          cart: cart._id,
          product: product._id,
          size: size,
        },
        {
          $inc: { quantity: quantity },
          $set: {
            sellingPrice: product.sellingPrice,
            mrpPrice: product.mrpPrice,
          },
          $setOnInsert: {
            userId: user._id,
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        },
      )
      .populate("product");

    // Add to cart.cartItems if it's a new item
    if (!cart.cartItems.includes(cartItem._id)) {
      cart.cartItems.push(cartItem._id);
      await cart.save();
    }

    return cartItem;
  }

  async updateCartItem(userId, cartItemId, cartItemData) {
    const cartItem = await cartItemModel
      .findById(cartItemId)
      .populate("product");

    // ✅ FIRST check
    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    // ✅ SECOND check
    if (!cartItem.product) {
      throw new Error("Product not found");
    }

    const updates = {
      quantity: cartItemData.quantity,
      mrpPrice: cartItem.product.mrpPrice,
      sellingPrice: cartItem.product.sellingPrice,
      // size: cartItemData.size, //optional
    };

    // ✅ correct update
    await cartItemModel.updateOne({ _id: cartItemId }, { $set: updates });

    return { ...cartItem.toObject(), ...updates };
  }
}

module.exports = new cartService();
