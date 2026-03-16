const categoryModel = require("../model/category.model");
const productModel = require("../model/product.model");
const calculateProductDiscountPercentage = require("./calculateProductDiscountPercentage.service");


class productService {
  async createProduct(req, seller) {
    try {
      // Calculate discount
      const discountPercent = calculateProductDiscountPercentage(
        req.mrpPrice,
        req.sellingPrice
      );

      // Log request categories for debugging

      // Ensure categories exist
      const category1 = await this.createOrGetCategory(req.category, 1);
      const category2 = await this.createOrGetCategory(
        req.category2,
        2,
        category1._id
      );
      const category3 = await this.createOrGetCategory(
        req.category3,
        3,
        category2._id
      );

      // Get seller ID (handle both object and ID string)
      const sellerId = seller && seller._id ? seller._id : seller;

      // Create product
      const product = new productModel({
        title: req.title,
        description: req.description,
        mrpPrice: req.mrpPrice,
        sellingPrice: req.sellingPrice,
        discountPercentage: discountPercent,
        size: req.size,
        quantity: req.quantity,
        color: req.color.toLowerCase(),
        images: req.images,
        seller: sellerId,
        category: category3._id, // use array to store hierarchy
      });

      // Save product
      return await product.save();
    } catch (error) {
      console.error("Error in createProduct:", error.message);
      throw new Error(error.message);
    }
  }

  async createOrGetCategory(categoryId, level, parentId = null) {
    let category = await categoryModel.findOne({ categoryId });

    if (!category) {
      category = new categoryModel({
        categoryId,
        level,
        parentCategory: parentId,
      });
    }
    await category.save();
    return category;
  }

  async deleteProduct(productId) {
    try {
      const product = await productModel.findByIdAndDelete(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(productId, updatedProductData) {
    try {
      const product = await productModel.findByIdAndUpdate(
        productId,
        updatedProductData,
        {
          new: true,
        }
      );
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findProductById(productId) {
    try {
      const product = await productModel.findById(productId);
      
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllProducts() {
    try {
      const products = await productModel
        .find()
        .skip(page * limit)
        .limit(20);

      if (!products) {
        throw new Error("No products found");
      }
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async searchProduct(filters) {
    try {
      const query = {};

      if (filters.color) {
        query.color = new RegExp(filters.color, "i");
      }

      if (filters.title) {
        query.title = new RegExp(filters.title, "i");
      }
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductsBySellers(sellerId) {
    return await productModel.find({ seller: sellerId });
  }

  async  getAllProducts(query) {
  const {
    category,
    color,
    size,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    pageNumber = 1,
  } = query;

  const limit = 10;
  const filterQuery = {};

  // CATEGORY
  if (category) {
    const categoryDoc = await categoryModel.findOne({
      categoryId: category,
    });

    if (!categoryDoc) {
      return {
        content: [],
        totalPages: 0,
        totalElement: 0,
      };
    }

    filterQuery.category = categoryDoc._id;
  }

  // COLOR
  if (color) {
    filterQuery.color = color;
  }

  // SIZE
  if (size) {
    filterQuery.size = size;
  }

  // PRICE RANGE
  if (minPrice || maxPrice) {
    filterQuery.mrpPrice = {};
    if (minPrice) filterQuery.mrpPrice.$gte = Number(minPrice);
    if (maxPrice) filterQuery.mrpPrice.$lte = Number(maxPrice);
  }

  // DISCOUNT
  if (minDiscount) {
    filterQuery.discountPercentage = {
      $gte: Number(minDiscount),
    };
  }

  // SORTING
  let sortQuery = {};
  if (sort === "price_low") {
    sortQuery.sellingPrice = 1;
  } else if (sort === "price_high") {
    sortQuery.sellingPrice = -1;
  }

  // PAGINATION
  const skip = (Number(pageNumber) - 1) * limit;

  const products = await productModel
    .find(filterQuery)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit);

  const totalElement = await productModel.countDocuments(filterQuery);
  const totalPages = Math.ceil(totalElement / limit);

  return {
    content: products,
    totalPages,
    totalElement,
  };
}
}

module.exports = new productService();
