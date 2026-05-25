const cartModel = require("../model/cart.model");
const cartItemModel = require("../model/cartItem.model");

class cartItemService {
  async updateCartItem(userId, cartItemId, cartItemData) {
    const cartItem = await cartItemModel
      .findById(cartItemId)
      .populate("product");

    if (cartItem.userId.toString() === userId.toString()) {
      const updates = {
        quantity: cartItemData.quantity,
        mrpPrice: cartItem.product.mrpPrice,
        sellingPrice: cartItem.product.sellingPrice,
        size: cartItemData.size,
      };

      await cartItemModel
        .findByIdAndUpdate(cartItemId, updates, {
          returnDocument : "after",
        })
        .populate("product");
    } else {
      throw new Error("Unauthorized Access");
    }
    return "Cart item updated successfully";
  }

  async findCartById(cartId) {
    const cart = cartModel.findById(cartId).populate("product");

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart;
  }

  async removeCartItem(userId, cartItemId) {
    const cartItem = await cartItemModel.findById(cartItemId);

    if (!cartItem) {
      throw new Error("Cart not found");
    }

    if (
      cartItem.userId.toString() !== userId.toString() &&
      cartItemId.toString()
    ) {
      throw new Error("Unauthorized Access");
    }

    await cartItem.deleteOne({ _id: cartItem._id });

    await cartItemModel.findByIdAndDelete(cartItemId);
    return "Item delete successfully";
  }
}

module.exports = new cartItemService();
