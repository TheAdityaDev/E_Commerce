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
        mrpPrice: cartItemData.quantity * cartItem.product.mrpPrice,
        sellingPrice: cartItemData.quantity * cartItem.product.sellingPrice,
        size: cartItemData.size,
      };

      await cartItemModel
        .findByIdAndUpdate(cartItemId, updates, {
          new: true,
        })
        .populate("product");
    } else {
      throw new Error("Unauthorized Access");
    }
    await cartItemModel.findByIdAndDelete(cartItemId);
    return "Card delete successfully";
  }

  async findCartById(cartId) {
    const cart = cartModel.findById(cartId).populate("product");

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart;
  }

  async removeCartItem(userId, cartItemId) {
    console.log("userId ===>", userId);

    const cartItem = await cartItemModel.findById(cartItemId);

    const logs = {
      userId,
      cartItemId,
      cart,
    };

    console.table(logs);

    if (!cartItem) {
      throw new Error("Cart not found");
    }

    if (
      cartItem.userId.toString() !== userId.toString() &&
      cartItemId.toString()
    ) {
      throw new Error("Unauthorized Access");
    }

    console.log(
      cartItem.userId.toString() !== userId.toString() && cartItemId.toString()
    );

    await cartItem.deleteOne({ _id: cartItem._id });

    await cartItemModel.findByIdAndDelete(cartItemId);
    return "Item delete successfully";
  }
}

module.exports = new cartItemService();
