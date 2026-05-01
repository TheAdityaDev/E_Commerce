const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    media: [
      {
        type: String,
      },
    ],

    rating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);


postSchema.index({product: 1 , user: 1} , {unique: true})

const postsModule = mongoose.model("Post", postSchema);

module.exports = postsModule