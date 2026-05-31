const postModule = require("../model/posts.model");
const productModel = require("../model/product.model");

class Posts {
  async getPosts(productId) {
    // ✅ Filter by productId if provided
    const query = productId ? { product: productId } : {};
    
    const posts = await postModule
      .find(query)
      .populate([
        { path: "user", select: "name" },
        { path: "product", select: "title" },
      ])
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return posts;
  }

  async getProductPosts(productId) {
    if (!productId) {
      throw new Error("Product ID is required");
    }
    const posts = await postModule
      .find({ product: productId })
      .populate([ 
        { path: "user", select: "name" },
      ]).sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return posts;
  };

  async getAllUserPosts(userId) {
    const posts = await postModule
      .find({ user: userId })
      .populate([
        { path: "user", select: "name" },
        { path: "product", select: "title" },
      ])
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return posts;
  }

  async createPost(userId, productId, title, content, media, rating) {
    try {
      if (!title || !content) {
        throw new Error("Missing required fields: title and content");
      }

      // Verify product exists
      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      const newPost = await postModule.create({
        user: userId,
        product: productId,
        title,
        content,
        media: media || [],
        rating: Math.max(1, rating || 1),
      });

      return newPost;
    } catch (err) {
      throw err;
    }
  }
  async updatePosts(userId, postId, productId, title, content, rating) {
    try {
      // If productId is not passed in body/params, try to find it from the existing post
      let finalProductId = productId;
      if (!finalProductId) {
        const existingPost = await postModule.findById(postId);
        if (!existingPost) throw new Error("Post not found");
        finalProductId = existingPost.product;
      }

      const product = await productModel.findById(finalProductId);
      if (!product) {
        throw new Error("Product not found");
      }

      const updatedPost = await postModule.findOneAndUpdate(
        { _id: postId, user: userId },
        { $set: { title, content, rating } },
        { returnDocument: "after" },
      );

      return updatedPost;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deletePost(userId, postId) {
    try {
      return await postModule.findOneAndDelete({
        _id: postId,
        user: userId,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const postsService = new Posts();

module.exports = postsService;
