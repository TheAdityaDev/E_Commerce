const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    categoryId: {
      type: String,
      unique: true,
      required: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      required: true,
    },
    slug: {
    type: String,
    unique: true,
  },
  },
  { timestamps: true }
);


const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel