const homeCategoryService = require("../service/homeCategory.service");
const homeService = require("../service/home.service");



class HomeCategoryController {
  async createHomeCategories(req, res) {
    try {
      const homeCategory = req.body;
      const categories = await homeCategoryService.createCategories(
        homeCategory
      );
      const home = await homeService.createHomePageData(categories);
      return res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllHomeCategory(req, res) {
    try {
      const homeCategory = await homeCategoryService.getAllHomeCategory();
      return res.status(200).json(homeCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateHomeCategory(req, res) {
    try {
      const id = req.params.id;
      const homeCategory = req.body;
      const updatedHomeCategory = await homeCategoryService.updateHomeCategory(
        homeCategory,
        id
      );

      res.status(200).json(updatedHomeCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new HomeCategoryController();
