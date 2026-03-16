const dealModel = require("../model/deal.model");
const homeCategoryModel = require("../model/homeCategory.model");

class dealService {
  async getDeals() {
    return await dealModel.find().populate({ path: "category" });
  }

  async createDeal(deal) {
    try {
      const category = await homeCategoryModel.findById(deal.category._id);

      const newDeal = new dealModel({
        ...deal,
        category: category,
      });

      const saveDeal = await newDeal.save();

      return await dealModel
        .findById(saveDeal._id)
        .populate({ path: "category" });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateDeal(deal, id) {
    const existingDeal = await dealModel
      .findById(id)
      .populate({ path: "category" });

    if (existingDeal) {
      return await dealModel.findByIdAndUpdate(
        existingDeal._id,
        { discount: deal.discount },
        { new: true }
      );
    }
    throw new Error("Deal not found");
  }

  async deleteDeal(id) {
    const deal = await dealModel.findById(id);

    if (!deal) throw new Error("Deal not found");

    await dealModel.deleteDeal({ _id: id });
  }
}

module.exports =new dealService()