const cartService = require("../service/cart.service");
const cartItemService = require("../service/cartItem.service");
const productService = require("../service/product.service");

class cartController {
  async findUserCartHandler(req, res) {
    try {
      const user = await req.user;

      if (!user) throw new Error("User not found");
      
      const cart = await cartService.findUserCart(user);

      return res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addCartItemToCart(req, res) {
    try {
      const user = await req.user;
      const product = await productService.findProductById(
        req.body.productId
      );
      
      const cartItem = await cartService.addCartItem(
        user,
        product,
        req.body.size,
        req.body.quantity
      );

      

      return res.status(200).json(cartItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCartItem(req, res) {
    try {
      const user = req.user;
      await cartItemService.removeCartItem(user._id, req.params.cartItemId);

      res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCartItem(req, res) {
    try {
      const cartItemId = req.params.cartItemId;
      const { quantity } = req.body;
      const user = await req.user;

      let updatedCartItem;
      if (quantity > 0) {
        updatedCartItem = await cartService.updateCartItem(
          user._id,
          cartItemId,
          { quantity }
        );
      }

      res.status(200).json(updatedCartItem)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }
}


module.exports = new cartController()