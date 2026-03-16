const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  mrpPrice:{
    type:Number,
    required:true
  },
  sellingPrice:{
    type:Number,
    required:true
  }
},{timestamps:true});

const orderItemModel = mongoose.model("orderItem", orderItemSchema);

module.exports = orderItemModel;
