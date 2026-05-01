const homeCategoryModel = require("../model/homeCategory.model");

class HomeCategoryService {
  async getAllHomeCategory() {
    try {
      return await homeCategoryModel.find().select("-__v -createdAt -updatedAt");
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
    try {
      // Ensure req is an array
      const categoriesToInsert = Array.isArray(req) ? req : [req];

      // Delete existing categories and insert new ones
      await homeCategoryModel.deleteMany({});
      const insertedCategories = await homeCategoryModel.insertMany(categoriesToInsert);
      
      return insertedCategories;
    } catch (error) {
      throw new Error(error.message);
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
  async updateHomeCategory(req, id) {
    try {

        const existingCategory = await homeCategoryModel.findById(id);

        if (!existingCategory) {
          throw new Error("Category not found");
        }

      return await homeCategoryModel.findByIdAndUpdate(existingCategory._id, req, {
        returnDocument : "after",
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}


module.exports = new HomeCategoryService()