const postModule = require("../model/posts.model");
const postsService = require("../service/posts.service");

class Posts {
  async getPosts(req, res) {
    const post = await postsService.getPosts();

    return res.status(200).json({
      success: true,
      post,
    });
  }

  async getAllPosts(req, res) {
    const userId = req.user._id;
    const post = await postsService.getAllUserPosts(userId);

    return res.status(200).json({
      success: true,
      post,
    });
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

  async deletePost(req, res){
    try {
      const userId = req.user._id;
      const postId = req.params.postId;

      await postsService.deletePost(userId, postId);
      return res.status(200).json({
        success:true,
        message:"Post deleted successfully..."
      })
    } catch (error) {
      
    }
  }
}

const postsController = new Posts();
module.exports = postsController;
