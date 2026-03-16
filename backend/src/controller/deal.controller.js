const dealService = require("../service/deal.service");

class dealController {
  async getAllDeals(req, res) {
    try {
      const deal = req.body;
      const deals = await dealService.getDeals(deal);
      res.status(200).json(deals);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createDeal(req, res) {
    try {
      const deal = req.body;
      const createDeal = await dealService.createDeal(deal);
      res.status(202).json(createDeal);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateDeal(req, res) {
    try {
      const { id } = req.params;
      const deal = req.body;
      const updateDeal = await dealService.updateDeal(deal, id);
      res.status(202).json(updateDeal);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteDeal(req, res) {
    try {
      const { id } = req.params;
      const deleteDeal = await dealService.deleteDeal(id);
      res.status(202).json(deleteDeal);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}


module.exports = new dealController();
