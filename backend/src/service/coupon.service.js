const couponModel = require("../model/coupon.model");

class couponService {
  async createCoupon(coupon) {
    try {
      if (!coupon?.code || !coupon?.discountPercentage) {
        throw new Error("Code and discount percentage are required");
      }

      // Check if coupon code already exists
      const existingCoupon = await couponModel.findOne({ 
        code: coupon.code.toUpperCase() 
      });

      if (existingCoupon) {
        throw new Error("Coupon code already exists");
      }

      // Validate dates
      const startDate = new Date(coupon.validityStartDate);
      const endDate = new Date(coupon.validityExpireDate);

      if (startDate >= endDate) {
        throw new Error("Start date must be before end date");
      }

      const newCoupon = await couponModel.create({
        code: coupon.code.toUpperCase(),
        discountPercentage: coupon.discountPercentage,
        validityStartDate: startDate,
        validityExpireDate: endDate,
        minimumOrderValue: coupon.minimumOrderValue || 0,
        usageLimit: coupon.usageLimit || null,
        description: coupon.description || "",
      });

      return newCoupon;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllCoupons() {
    try {
      const coupons = await couponModel.find().sort({ createdAt: -1 });
      return coupons;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCouponById(id) {
    try {
      const coupon = await couponModel.findById(id);
      
      if (!coupon) {
        throw new Error("Coupon not found");
      }

      return coupon;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCouponByCode(code) {
    try {
      const coupon = await couponModel.findOne({ 
        code: code.toUpperCase() 
      });

      if (!coupon) {
        throw new Error("Coupon not found");
      }

      // Check if coupon is valid
      const now = new Date();
      if (
        !coupon.isActive ||
        coupon.isUsed ||
        now < coupon.validityStartDate ||
        now > coupon.validityExpireDate
      ) {
        throw new Error("Coupon is expired or inactive");
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new Error("Coupon usage limit exceeded");
      }

      return coupon;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateCoupon(id, coupon) {
    try {
      const existingCoupon = await couponModel.findById(id);

      if (!existingCoupon) {
        throw new Error("Coupon not found");
      }

      // If code is being updated, check if it already exists
      if (coupon.code && coupon.code.toUpperCase() !== existingCoupon.code) {
        const duplicateCoupon = await couponModel.findOne({ 
          code: coupon.code.toUpperCase() 
        });

        if (duplicateCoupon) {
          throw new Error("Coupon code already exists");
        }
      }

      // Validate dates if provided
      if (coupon.validityStartDate && coupon.validityExpireDate) {
        const startDate = new Date(coupon.validityStartDate);
        const endDate = new Date(coupon.validityExpireDate);

        if (startDate >= endDate) {
          throw new Error("Start date must be before end date");
        }
      }

      const updatedCoupon = await couponModel.findByIdAndUpdate(
        id,
        {
          code: coupon.code ? coupon.code.toUpperCase() : existingCoupon.code,
          discountPercentage: coupon.discountPercentage ?? existingCoupon.discountPercentage,
          validityStartDate: coupon.validityStartDate ?? existingCoupon.validityStartDate,
          validityExpireDate: coupon.validityExpireDate ?? existingCoupon.validityExpireDate,
          minimumOrderValue: coupon.minimumOrderValue ?? existingCoupon.minimumOrderValue,
          isActive: coupon.isActive ?? existingCoupon.isActive,
          usageLimit: coupon.usageLimit ?? existingCoupon.usageLimit,
          description: coupon.description ?? existingCoupon.description,
        },
        { returnDocument : "after" }
      );

      return updatedCoupon;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteCoupon(id) {
    try {
      const coupon = await couponModel.findById(id);

      if (!coupon) {
        throw new Error("Coupon not found");
      }

      await couponModel.findByIdAndDelete(id);

      return { message: "Coupon deleted successfully", deletedCoupon: coupon };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validateCoupon(code, orderValue) {
    try {
      const coupon = await this.getCouponByCode(code);

      if (orderValue >= coupon.minimumOrderValue) {
        throw new Error(
          `Minimum order value of ₹${coupon.minimumOrderValue} required`
        );
      }

      return coupon;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async incrementCouponUsage(code) {
    try {
      const coupon = await couponModel.findOne({ 
        code: code.toUpperCase() 
      });

      if (coupon) {
        coupon.usedCount += 1;
        await coupon.save();
      }

      return coupon;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async consumeCouponAfterPayment({
    code,
    userId,
    paymentOrderId,
    deleteAfterUse = true,
  }) {
    try {
      if (!code) return null;

      const normalizedCode = String(code).toUpperCase();
      const coupon = await couponModel.findOne({ code: normalizedCode });
      if (!coupon) return null;

      coupon.isUsed = true;
      coupon.isActive = false;
      coupon.usedBy = userId || null;
      coupon.usedAt = new Date();
      coupon.usedInPaymentOrder = paymentOrderId || null;
      coupon.usedCount += 1;

      await coupon.save();

      const usedCoupon = coupon.toObject();

      if (deleteAfterUse) {
        await couponModel.deleteOne({ _id: coupon._id });
      }

      return {
        usedCoupon,
        deleted: Boolean(deleteAfterUse),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new couponService();
