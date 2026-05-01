const couponService = require("../service/coupon.service");

class couponController {
  async createCoupon(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Request body is missing" });
      }

      const coupon = await couponService.createCoupon(req.body);

      return res.status(201).json({
        message: "Coupon created successfully",
        coupon,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to create coupon",
      });
    }
  }

  async getAllCoupons(req, res) {
    try {
      const coupons = await couponService.getAllCoupons();

      return res.status(200).json({
        message: "Coupons fetched successfully",
        coupons,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to fetch coupons",
      });
    }
  }

  async getCouponById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Coupon ID is required" });
      }

      const coupon = await couponService.getCouponById(id);

      return res.status(200).json({
        message: "Coupon fetched successfully",
        coupon,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to fetch coupon",
      });
    }
  }

  async getCouponByCode(req, res) {
    try {
      const { code } = req.params;

      if (!code) {
        return res.status(400).json({ message: "Coupon code is required" });
      }

      const coupon = await couponService.getCouponByCode(code);

      return res.status(200).json({
        message: "Coupon retrieved successfully",
        coupon,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Invalid or expired coupon",
      });
    }
  }

  async updateCoupon(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Coupon ID is required" });
      }

      if (!req.body) {
        return res.status(400).json({ message: "Request body is missing" });
      }

      const updatedCoupon = await couponService.updateCoupon(id, req.body);

      return res.status(200).json({
        message: "Coupon updated successfully",
        coupon: updatedCoupon,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to update coupon",
      });
    }
  }

  async deleteCoupon(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Coupon ID is required" });
      }

      const result = await couponService.deleteCoupon(id);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to delete coupon",
      });
    }
  }

  async validateCoupon(req, res) {
    try {
      const { code, orderValue } = req.body;

      if (!code || !orderValue) {
        return res
          .status(400)
          .json({ message: "Code and order value are required" });
      }

      const coupon = await couponService.validateCoupon(code, orderValue);

      return res.status(200).json({
        message: "Coupon is valid",
        discount:
          (coupon.discountPercentage / 100) * orderValue,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Coupon validation failed",
      });
    }
  }

  async toggleCouponStatus(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Coupon ID is required" });
      }

      const coupon = await couponService.getCouponById(id);
      const updatedCoupon = await couponService.updateCoupon(id, {
        isActive: !coupon.isActive,
      });

      res.status(200).json({
        message: `Coupon ${updatedCoupon.isActive ? "activated" : "deactivated"} successfully`,
        coupon: updatedCoupon,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message || "Failed to toggle coupon status",
      });
    }
  }
}

module.exports = new couponController();
