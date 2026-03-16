const homeCategoryModel = require("../model/homeCategory.model");

class HomeCategoryService {
  async getAllHomeCategory() {
    try {
      return await homeCategoryModel.find();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /* req = homeCategory */
  async createHomeCategory(req) {
    try {
      return await homeCategoryModel.create(req);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createCategories(req) {
    const existingCategories = await homeCategoryModel.find();

    if (existingCategories.length === 0) {
      return await homeCategoryModel.insertMany(req);
    }
  }

//   async deleteHomeCategory(id) {
//     try {
//       return await homeCategoryModel.findByIdAndDelete(id);
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }


  /* req= category */
  async updateHomeCategory(id, req) {
    try {

        const existingCategory = await homeCategoryModel.findById(id);

        if (!existingCategory) {
          throw new Error("Category not found");
        }

      return await homeCategoryModel.findByIdAndUpdate(existingCategory._id, {
        new: true,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}


module.exports = new HomeCategoryService()