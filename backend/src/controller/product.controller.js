const productService = require("../service/product.service");
const Yup = require("yup");

class sellerProductController {
  async getProductBySeller(req, res) {
    try {
      const seller = req.seller;

      const products = await productService.getProductsBySellers(seller._id);
      return res.status(200).json(products);
    } catch (error) {
      return res
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
        return res.status(400).json({
          error: "Validate error",
          errors: error.message,
          count: error.errors.length,
        });
      }

      return res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.productId);
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      await productService.updateProduct(req.params.productId, req.body);
      return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.findProductById(
        req.params.productId,
      );

      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getProductOG(req, res) {
    try {
      const { productId } = req.params;

      const product = await productService.findProductById(productId);

      if (!product) {
        return res.status(404).send("Product not found");
      }

      const productImage = Array.isArray(product.images?.[0])
        ? product.images[0][0]
        : product.images?.[0] || "https://via.placeholder.com/300";

      const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />

        <!-- ✅ OG TAGS -->
        <meta property="og:title" content="${product.title}" />
        <meta property="og:description" content="${product.description}" />
        <meta property="og:image" content="${productImage}" />
        <meta property="og:url" content="http://localhost:5173/#/product/${productId}" />
        <meta property="og:type" content="product" />

        <!-- Twitter Cards -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${product.title}" />
        <meta name="twitter:description" content="${product.description}" />
        <meta name="twitter:image" content="${productImage}" />

        <title>${product.title}</title>
      </head>

       <!-- ✅ CSP Safe Redirect -->
    <meta http-equiv="refresh" content="0; url=http://localhost:5173/product/${productId}" />
      <body>
      </body>
    </html>
    `;

      res.send(html);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  async searchProduct(req, res) {
    try {
      // Accept multiple query parameter names: q, search, query, filter
      const filter = req.query.q || req.query.search || req.query.query || req.query.filter || "";

      if (!filter || filter.trim() === "") {
        return res.status(400).json({ 
          error: "Search query is required. Use ?q=<term> or ?search=<term>" 
        });
      }

      const products = await productService.searchProduct({ filter: filter.trim() });
      return res.status(200).json(products);
    } catch (error) {
      console.error("Search error:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async getAllProducts(req, res) {
    try {
      const query = req.query;

      const result = await productService.getAllProducts(query);

      return res.status(200).json(result);
    } catch (error) {
      console.error("ERROR:", error);
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new sellerProductController();
