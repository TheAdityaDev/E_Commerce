const categoryModel = require("../model/category.model");
const productModel = require("../model/product.model");
const calculateProductDiscountPercentage = require("./calculateProductDiscountPercentage.service");
const mongoose = require("mongoose");

class productService {
  async resolveCategoryFilter(categoryValue) {
    if (!categoryValue) return [];

    const normalized = String(categoryValue).trim();
    if (!normalized) return [];

    let categoryDoc = await categoryModel.findOne({
      slug: normalized.toLowerCase(),
    });

    if (!categoryDoc) {
      categoryDoc = await categoryModel.findOne({
        categoryId: { $regex: `^${normalized}$`, $options: "i" },
      });
    }

    if (!categoryDoc) {
      categoryDoc = await categoryModel.findOne({
        name: { $regex: `^${normalized}$`, $options: "i" },
      });
    }

    if (!categoryDoc && mongoose.Types.ObjectId.isValid(normalized)) {
      categoryDoc = await categoryModel.findById(normalized);
    }

    if (!categoryDoc) return [];

    // Include selected category and all descendants so parent-level filters work.
    const categoryIds = [categoryDoc._id];
    const queue = [categoryDoc._id];
    while (queue.length) {
      const currentId = queue.shift();
      const children = await categoryModel
        .find({ parentCategory: currentId })
        .select("_id");
      for (const child of children) {
        categoryIds.push(child._id);
        queue.push(child._id);
      }
    }

    return categoryIds;
  }

  async createProduct(req, seller) {
    try {
      // Calculate discount
      const discountPercent = calculateProductDiscountPercentage(
        req.mrpPrice,
        req.sellingPrice,
      );

      // Log request categories for debugging

      // Ensure categories exist
      const category1 = await this.createOrGetCategory(req.category, 1);
      const category2 = await this.createOrGetCategory(
        req.category2,
        2,
        category1._id,
      );
      const category3 = await this.createOrGetCategory(
        req.category3,
        3,
        category2._id,
      );

      // Get seller ID (handle both object and ID string)
      const sellerId = seller && seller._id ? seller._id : seller;

      const description = req.description;

      if (!description) {
        throw new Error("Description is required");
      }

      if (description.length > 200) {
        throw new Error("Max 200 characters allowed");
      }
      // Create product
      const product = new productModel({
        title: req.title,
        description: description,
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
      throw new Error(error.message);
    }
  }

  async createOrGetCategory(categoryId, level, parentId = null) {
    const raw = String(categoryId || "").trim();
    if (!raw) throw new Error("categoryId is required");

    // tolerate case differences for older data
    let category = await categoryModel.findOne({
      categoryId: { $regex: `^${raw}$`, $options: "i" },
    });

    if (!category) {
      category = new categoryModel({
        name: raw,
        categoryId: raw,
        level,
        parentCategory: parentId,
        slug: raw.toLowerCase(),
      });
    }

    // backfill missing slug/name on existing categories
    let changed = false;
    if (!category.name) {
      category.name = raw;
      changed = true;
    }
    if (!category.slug) {
      category.slug = raw.toLowerCase();
      changed = true;
    }

    if (changed) {
      await category.save();
      return category;
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
          returnDocument: "after",
        },
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

  levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

async searchProduct({ filter }) {
  try {
    if (!filter || typeof filter !== "string" || !filter.trim()) {
      return [];
    }

    // 🔹 1. Normalize + tokenize
    const stopWords = ["for", "and", "the", "with", "a", "an", "in", "at", "to", "is"];
    let tokens = filter
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(w => w && !stopWords.includes(w));

    // 🔹 2. Synonyms
    const synonyms = {
      tshirt: "t-shirt",
      tee: "t-shirt",
      denim: "jeans",
      trouser: "trousers",
      pant: "pants",
    };
    tokens = tokens.map(t => synonyms[t] || t);

    if (!tokens.length) return [];

    // 🔹 3. Fetch filters (⚠️ ideally cache this)
    const [colorsRaw, categoriesRaw] = await Promise.all([
      productModel.distinct("color"),
      categoryModel.find().select("name slug categoryId").lean(),
    ]);

    const colors = colorsRaw.map(c => c?.toLowerCase()).filter(Boolean);

    const categories = [
      ...categoriesRaw.map(c => c.name?.toLowerCase()),
      ...categoriesRaw.map(c => c.slug?.toLowerCase()),
      ...categoriesRaw.map(c => c.categoryId?.toLowerCase()),
    ].filter(Boolean);

    // 🔹 4. Extract filters
    const colorFilters = [];
    const categoryFilters = [];
    const searchTokens = [];

    for (const token of tokens) {
      if (colors.includes(token)) {
        colorFilters.push(token);
      } else if (categories.includes(token)) {
        const ids = await this.resolveCategoryFilter(token);
        categoryFilters.push(...ids);
      } else {
        searchTokens.push(token);
      }
    }

    // 🔹 5. Build query (STRICT MATCH)
    const conditions = [];

    if (colorFilters.length) {
      conditions.push({
        color: { $in: colorFilters.map(c => new RegExp(`^${c}$`, "i")) },
      });
    }

    if (categoryFilters.length) {
      conditions.push({
        category: { $in: categoryFilters },
      });
    }

    if (searchTokens.length) {
      conditions.push({
        $and: searchTokens.map(token => ({
          $or: [
            { title: { $regex: token, $options: "i" } },
            { description: { $regex: token, $options: "i" } },
          ],
        })),
      });
    }

    if (!conditions.length) return [];

    const mongoQuery =
      conditions.length === 1 ? conditions[0] : { $and: conditions };

    // 🔹 6. Execute (LIMIT small for performance)
    const products = await productModel
      .find(mongoQuery)
      .limit(30)
      .select(
        "title description images category price color mrpPrice sellingPrice discountPercentage"
      )
      .lean();

    return products.slice(0, 10);

  } catch (err) {
    throw new Error("Search failed: " + err.message);
  }
}

  async getProductsBySellers(sellerId) {
    return await productModel.find({ seller: sellerId });
  }

  async getAllProducts(query) {
    const {
      category,
      color,
      size,
      minPrice,
      maxPrice,
      minDiscount,
      sort,
      pageNumber = 1,
      search,
    } = query;

    const limit = 10;
    const page = Math.max(1, Number(pageNumber) || 1);
    const skip = (page - 1) * limit;

    const filterQuery = {};
    let categoryName = "";

    // ✅ CATEGORY FILTER
    if (category) {
      const categoryIds = await this.resolveCategoryFilter(category);
      if (categoryIds.length) {
        const matchedCategory = await categoryModel.findById(categoryIds[0]);
        categoryName = matchedCategory?.name || category;
        filterQuery.category = { $in: categoryIds };
      } else {
        // Graceful fallback: if category slug/id doesn't exist in DB yet,
        // treat it as a keyword so route `/products/<slug>` still works.
        categoryName = category;
        const slug = String(category).trim().toLowerCase();
        const fallbackTermsBySlug = {
          smartphones: ["smartphone", "phone", "mobile", "iphone", "android"],
          laptop: ["laptop", "notebook", "macbook"],
          laptops: ["laptop", "notebook", "macbook"],
          smartwatches: ["smartwatch", "watch", "fitness band"],
          televisions: ["tv", "television"],
          cameras: ["camera", "dslr", "mirrorless"],
          headphones: ["headphone", "earphone", "earbuds"],
        };

        const terms = fallbackTermsBySlug[slug] || [slug];
        const term = terms
          .map((t) => String(t).trim())
          .filter(Boolean)
          .join("|");
        filterQuery.$or = [
          { title: { $regex: term, $options: "i" } },
          { description: { $regex: term, $options: "i" } },
        ];
      }
    }

    // ✅ OTHER FILTERS
    if (color) {
      filterQuery.color = { $in: color.split(",") };
    }

    if (size) {
      filterQuery.size = { $in: size.split(",") };
    }

    if (minPrice || maxPrice) {
      filterQuery.mrpPrice = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      };
    }

    if (minDiscount) {
      filterQuery.discountPercentage = { $gte: Number(minDiscount) };
    }

    if (search) {
      filterQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortQuery = { createdAt: -1 };
    if (sort === "price_low") sortQuery = { sellingPrice: 1 };
    if (sort === "price_high") sortQuery = { sellingPrice: -1 };

    // ✅ FETCH DATA
    const products = await productModel
      .find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const totalElement = await productModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalElement / limit);

    // 🔴 NEW: HANDLE EMPTY PRODUCTS
    if (products.length === 0) {
      return {
        success: false,
        message: `${categoryName || category} is not available`,
        content: [],
        totalPages: 0,
        totalElement: 0,
      };
    }

    // ✅ SUCCESS RESPONSE
    return {
      success: true,
      message: "Products fetched successfully",
      content: products,
      totalPages,
      totalElement,
    };
  }
}

module.exports = new productService();
