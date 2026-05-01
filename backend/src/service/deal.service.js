const { default: mongoose } = require("mongoose");
const dealModel = require("../model/deal.model");
const homeCategoryModel = require("../model/homeCategory.model");

class dealService {
  async getDeals() {
    const deals = await dealModel.find().populate({ path: "category" });
    
    // Transform response to expose category fields at root level
    return deals.map(deal => ({
      id: deal._id,
      discount: deal.discount,
      is_discount: Number(deal.discount),
      name: deal.category?.name,
      image: deal.category?.image,
      categoryId: deal.category?.categoryId,
      category: deal.category,
    }));
  }

  async createDeal(deal) {
    if (!deal?.categoryId) {
      throw new Error("categoryId is required");
    }

    let category;

    // Check if categoryId is ObjectId or categoryId string
    if (mongoose.Types.ObjectId.isValid(deal.categoryId)) {
      category = await homeCategoryModel.findById(deal.categoryId);
    } else {
      // Search by categoryId field (string)
      category = await homeCategoryModel.findOne({
        categoryId: deal.categoryId,
      });
    }

    if (!category) {
      throw new Error("Category not found");
    }

    // Create deal
    const newDeal = await dealModel.create({
      discount: deal.discount,
      category: category._id,
    });

    // Populate before returning
    await newDeal.populate("category");

    return newDeal;
  }

  async updateDeal(deal, id) {
    const existingDeal = await dealModel
      .findById(id)
      .populate({ path: "category" });

    if (existingDeal) {
      const updatedDeal = await dealModel.findByIdAndUpdate(
        existingDeal._id,
        { discount: deal.discount },
        { returnDocument: "after" },
      ).populate({ path: "category" });
      
      // Transform response
      return {
        id: updatedDeal._id,
        discount: updatedDeal.discount,
        is_discount: String(updatedDeal.discount),
        name: updatedDeal.category?.name,
        image: updatedDeal.category?.image,
        categoryId: updatedDeal.category?.categoryId,
        category: updatedDeal.category,
      };
    }
    throw new Error("Deal not found");
  }

async deleteDeal(id) {
  const deal = await dealModel.findById(id);

  if (!deal) throw new Error("Deal not found");

  await dealModel.deleteOne({ _id: id });

  return { message: "Deal deleted successfully" };
}
}

module.exports = new dealService();
