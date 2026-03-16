const productService = require("../service/product.service");
const Yup = require("yup");

class sellerProductController {
  async getProductBySeller(req, res) {
    try {
      const seller = req.seller;

      const products = await productService.getProductsBySellers(seller._id);
      res.status(200).json(products);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: "Internal server error" });
    }
  }

  async createProduct(req, res) {
    try {
      //   await createProductSchema.validate(req.body, { abortEarly: false });

      const seller = req.seller;

      const product = await productService.createProduct(req.body, seller);

      return res.status(201).json(product);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({
          error: "Validate error",
          errors: error.message,
          count: error.errors.length,
        });
      }

      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.productId);
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      await productService.updateProduct(req.params.productId, req.body);
      return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.findProductById(
        req.params.productId
      );
      console.log("productId", req.params.productId);

      return res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async searchProduct(req, res) {
    try {
      const query = req.query.q;
      console.log("query ==>", query);

      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const products = await productService.searchProduct(query);
      return res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

 async  getAllProducts(req, res) {
  try {
    const result = await productService.getAllProducts(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

}

module.exports = new sellerProductController();
