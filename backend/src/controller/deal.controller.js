const redisClient = require("../config/redis.config");
const dealService = require("../service/deal.service");

class dealController {
  async getAllDeals(req, res) {

  try {

    const cachedDeals = await redisClient.get("deals");

    if (cachedDeals) {

      console.log("Cache Hit");

      return res.status(200).json(
        JSON.parse(cachedDeals)
      );
    }

    const deals = await dealService.getDeals();

    await redisClient.set(
      "deals",
      JSON.stringify(deals),
      {
        EX: 3600,
      }
    );

    // 4. Send response
    res.status(200).json(deals);

  } catch (error) {

    res.status(500).json({
      message: error.message || "Failed to fetch deals",
    });

  }

}

  async createDeal(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Body missing" });
      }

      const deal = req.body;

      const createdDeal = await dealService.createDeal(deal);

      res.status(201).json(createdDeal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateDeal(req, res) {
    try {
      const { id } = req.params;
      const deal = req.body;
      const updateDeal = await dealService.updateDeal(deal, id);
      res.status(202).json(updateDeal);
    } catch (error) {
      console.error("Error updating deal:", error);
      res
        .status(500)
        .json({ message: error.message || "Failed to update deal" });
    }
  }

  async deleteDeal(req, res) {
    try {
      const { id } = req.params;
      const deleteDeal = await dealService.deleteDeal(id);
      res.status(202).json(deleteDeal);
    } catch (error) {
      console.error("Error deleting deal:", error);
      res
        .status(500)
        .json({ message: error.message || "Failed to delete deal" });
    }
  }
}

module.exports = new dealController();
