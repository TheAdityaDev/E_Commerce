const homeCategorySection = require("../domain/homeCategorySection");
const dealService = require("./deal.service");

class homeService {

    /* filter all home section categories */
  async createHomePageData(allCategories) {
    const gridCategories = await allCategories.filter(
      (category) => category.section === homeCategorySection.GRID
    );

    const shopByCategory = await allCategories.filter(
      (category) => category.section === homeCategorySection.SHOP_BY_CATEGORY
    );

    const electricCategories = await allCategories.filter(
      (category) => category.section === homeCategorySection.ELECTRIC_CATEGORIES
    );

    const dealCategories = await allCategories.filter(
      (category) => category.section === homeCategorySection.DEALS
    );

    const deals = await dealService.getDeals()
    const home = {
      grid: gridCategories,
      shopByCategory: shopByCategory,
      electricCategories: electricCategories,
      deals: deals,
      dealCategories: dealCategories,
    };

    return home;
  }
}


module.exports = new homeService()