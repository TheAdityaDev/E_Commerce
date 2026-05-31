const redisClient = require("../config/redis.config");
const postModule = require("../model/posts.model");
const postsService = require("../service/posts.service");

class Posts {
  async getPosts(req, res) {
    try {
      const productId = req.query.product; 
      const cacheKey = productId ? `posts_${productId}` : "posts";
      const cachedProducts = await redisClient.get(cacheKey);

      if (cachedProducts) {
        return res.status(200).json({
          posts: JSON.parse(cachedProducts),
        });
      }

      const post = await postsService.getPosts(productId);

      if (!post) {
        return res.json({ message: "No data from DB" });
      }

      await redisClient.set(cacheKey, JSON.stringify(post), { EX: 300 });

      // ✅ FIXED: Return the posts data
      return res.status(200).json({
        posts: post,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllPosts(req, res) {
    try {
      const userId = req.user._id;
      const cachedPosts = await redisClient.get("AllUsersPosts");

      if (cachedPosts) {
        return res.status(200).json({
          success: true,
          posts: JSON.parse(cachedPosts),
        });
      }

      const post = await postsService.getAllUserPosts(userId);

      await redisClient.set("AllUsersPosts", JSON.stringify(post), {
        EX: 300,
      });

      return res.status(200).json({
        success: true,
        posts: post,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createPost(req, res) {
    try {
      const userId = req.user._id;
      const productId = req.body.product || req.params.productId;

      const { title, content, rating, media } = req.body;

      const result = await postsService.createPost(
        userId,
        productId,
        title,
        content,
        media, // already URLs
        rating,
      );

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async getProductPosts(req, res) {
  try {
    const productId = req.params.productId || req.query.product;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    let cachedProducts = null;

    if (redisClient.isOpen) {
      cachedProducts = await redisClient.get(`posts_${productId}`);
    }

    if (cachedProducts) {
      return res.status(200).json({
        posts: JSON.stringify(cachedProducts),
      });
    }

    const posts = await postsService.getProductPosts(productId);

    if (!posts.length) {
      return res.status(200).json({ message: "No data from DB" });
    }

    if (redisClient.isOpen) {
      await redisClient.set(`posts_${productId}`, JSON.stringify(posts), {
        EX: 300,
      });
    }

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

  async updatePosts(req, res) {
    try {
      const userId = req.user._id;
      const postId = req.params.postId;
      const productId = req.body.product || req.params.productId;

      const { title, content, rating } = req.body;

      const post = await postsService.updatePosts(
        userId,
        postId,
        productId,
        title,
        content,
        rating,
      );

      return res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deletePost(req, res) {
    try {
      const userId = req.user._id;
      const postId = req.params.postId;

      await postsService.deletePost(userId, postId);
      return res.status(200).json({
        success: true,
        message: "Post deleted successfully...",
      });
    } catch (error) {}
  }
}

const postsController = new Posts();
module.exports = postsController;
