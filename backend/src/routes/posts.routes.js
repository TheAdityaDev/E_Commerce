const express = require("express");
const router = express.Router();
const rateLimitRoute = require("../api/apilimit.api");
const abortSignal = require("../api/abort.api");
const postsController = require("../controller/posts.controller");
const userMiddleware = require("../middleware/userAuth.middleware");

router.get(
  "/",
  rateLimitRoute,
  abortSignal(3000),
  postsController.getPosts,
);

router.get(
  "/:productId",
  rateLimitRoute,
  abortSignal(3000),
  postsController.getProductPosts,
);


router.get(
  "/all",
  rateLimitRoute,
  abortSignal(3000),
  userMiddleware,
  postsController.getAllPosts,
);


router.post(
  "/new",
  rateLimitRoute,
  abortSignal(3000),
  userMiddleware,
  postsController.createPost,
);


router.patch(
  "/update/:postId",
  rateLimitRoute,
  abortSignal(3000),
  userMiddleware,
  postsController.updatePosts,
)

router.delete(
  "/delete/:postId",
  rateLimitRoute,
  abortSignal(3000),
  userMiddleware,
  postsController.deletePost,
)
module.exports = router;
