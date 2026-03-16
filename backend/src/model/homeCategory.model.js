const mongoose = require('mongoose');
const homeCategorySection = require('../domain/homeCategorySection');

const homeCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    enum:Object.values(homeCategorySection),
    required: true,
  },
},{timestamps:true});


const homeCategoryModel = mongoose.model("HomeCategory",homeCategorySchema);

module.exports = homeCategoryModel;