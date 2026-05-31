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
        // Ensure cachedProducts is a string before parsing
        const parsedPosts = typeof cachedProducts === "string" 
          ? JSON.parse(cachedProducts) 
          : cachedProducts;
        return res.status(200).json({
          posts: parsedPosts,
        });
      }

      const post = await postsService.getPosts(productId);

      if (!post) {
        return res.json({ message: "No data from DB" });
      }

      // Ensure post is serializable
      const plainPost = JSON.parse(JSON.stringify(post));
      await redisClient.set(cacheKey, JSON.stringify(plainPost), { EX: 300 });

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
        // Ensure cachedPosts is a string before parsing
        const parsedPosts = typeof cachedPosts === "string" 
          ? JSON.parse(cachedPosts) 
          : cachedPosts;
        return res.status(200).json({
          success: true,
          posts: parsedPosts,
        });
      }

      const post = await postsService.getAllUserPosts(userId);

      // Ensure post is serializable
      const plainPost = JSON.parse(JSON.stringify(post));
      await redisClient.set("AllUsersPosts", JSON.stringify(plainPost), {
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

  // async getProductPosts(req, res) {
  //   try {
  //     const productId = req.params.productId || req.query.product;

  //     if (!productId) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Product ID required",
  //       });
  //     }

  //     const cacheKey = `posts_${productId}`;

  //     // ---------- CACHE GET ----------
  //     let cached = null;

  //     try {
  //       const raw = await redisClient.get(cacheKey);

  //       if (raw) {
  //         cached = JSON.parse(raw); // SAFE now after clearing old cache
  //       }
  //     } catch (e) {
  //       console.log("Cache read error:", e.message);
  //     }

  //     if (cached) {
  //       return res.json({
  //         success: true,
  //         source: "cache",
  //         posts: cached,
  //       });
  //     }

  //     // ---------- DB ----------
  //     const posts = await postsService.getProductPosts(productId);

  //     // ---------- CACHE SET ----------
  //     await redisClient.set(
  //       cacheKey,
  //       JSON.stringify(posts),
  //       { EX: 300 }
  //     );

  //     return res.json({
  //       success: true,
  //       source: "db",
  //       posts,
  //     });

  //   } catch (error) {
  //     return res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // }

  async getProductPosts(req, res) {
    try {
      const productId = req.params.productId;
   

      const post = await postsService.getProductPosts(productId);

      if (!post) {
        return res.json({ message: "No data from DB" });
      }

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
