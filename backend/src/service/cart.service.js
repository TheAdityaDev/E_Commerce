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
      totalMrpPrice += cartItem.mrpPrice;
      totalSellingPrice += cartItem.sellingPrice;
    });

    cart.totalMrpPrice = totalMrpPrice;
    cart.totalSellingPrice = totalSellingPrice;
    cart.totalItem = totalItem;
    cart.discount = calculateProductDiscountPercentage(
      totalMrpPrice,
      totalSellingPrice
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

    let isPresent = await cartItemModel
      .findOne({
        cart: cart._id,
        product: product._id,
        size: size,
      })
      .populate("product");

    if (!isPresent) {
      const cartItem = new cartItemModel({
        product,
        cart: cart._id,
        quantity,
        size,
        sellingPrice: quantity * product.sellingPrice,
        mrpPrice: quantity * product.mrpPrice,
        userId: user._id,
      });

      cart.cartItems.push(cartItem);
      await cartItem.save();

      return cartItem;
    } else {
      return isPresent; // Return the existing cart item if found
    }
  }
}

module.exports = new cartService();
