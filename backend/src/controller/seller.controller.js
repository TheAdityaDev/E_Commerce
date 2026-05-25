const userRole = require("../domain/user.role");
const verificationCodeModel = require("../model/verificatioCode.model");
const sellerService = require("../service/seller.service");
const generateOtp = require("../util/genereateotp.util");
const jwtProvider = require("../util/jwtProvider.util");

class sellerController {
  async getSellerProfile(req, res) {
    try {
      const token =
        req.headers.authorization?.split(" ")[1] || req.cookies?.jwt;

      if (!token) {
        throw new Error("Token not provided");
      }

      const seller = await sellerService.getSellerProfile(token);

      if (!seller) {
        throw new Error("Seller not found");
      }

      return res.status(200).json(seller);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async createSeller(req, res) {
    try {
      const { seller, token } = await sellerService.createSeller(req.body);

      return res.status(201).json({
        message: "Seller account created successfully",
        seller,
        token,
      });
    } catch (error) {
      return res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  // Backend
  async getAllSellers(req, res) {
    try {
      // const status = req.query.status; // default
      const status =
        typeof req.query.status === "string" ? req.query.status : "";

      let filter = "";

      if (status && status !== "") {
        filter.accountStatus = status;
      }
      const sellers = await sellerService.getAllSellers(filter);
      return res.status(200).json(sellers);
    } catch (error) {
      return res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async updateSeller(req, res) {
    try {
      const existingSeller = req.params.sellerId || req.seller;
      const seller = await sellerService.updateSeller(existingSeller, req.body);
      return res
        .status(200)
        .json(seller, { message: "Seller profile updated successfully" });
    } catch (error) {
      return res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async deleteSeller(req, res) {
    try {
      const seller = await sellerService.deleteSeller(
        req.params.sellerId || req.seller,
      );
      res.status(200).json(seller, { message: "Seller deleted successfully" });
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async updateSellerAccountStatus(req, res) {
    try {
      const seller = await sellerService.updateSellerStatus(
        req.params.sellerId || req.seller,
        req.body.status,
      );
      res.status(200).json(seller, {
        message: "Seller account status updated successfully",
      });
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async verifyLoginOtp(req, res) {
    try {
      const { email, otp } = req.body;

      const seller = await sellerService.getSellerByEmail(email);
      if (!seller) {
        throw new Error("Seller not found");
      }

      const verificationCode = await verificationCodeModel.findOne({ email });
      if (!verificationCode) {
        throw new Error("OTP expired or not found");
      }

      // ✅ Expiry check FIRST
      const OTP_EXPIRY = 5 * 60 * 1000;
      if (Date.now() - verificationCode.createdAt.getTime() > OTP_EXPIRY) {
        await verificationCode.deleteOne();
        throw new Error("OTP expired");
      }

      // ✅ SAME logic as your working function
      const hashedInputOtp = await generateOtp.hashOtp(String(otp));
      if (hashedInputOtp !== verificationCode.otp) {
        throw new Error("Invalid OTP");
      }

      // ✅ Delete after success
      await verificationCode.deleteOne();

      const token = jwtProvider.createJWT({ email });

      res.status(200).json({
        message: "Login successful",
        token,
        role: userRole.SELLER,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateSellerAccountStatus(req, res) {
    try {
      const sellerId = req.params.sellerId || req.params.id;
      const { status } = req.body;

      if (!sellerId) {
        return res.status(400).json({ message: "Seller ID is required" });
      }

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const seller = await sellerService.updateSellerStatus(sellerId, status);

      res.status(200).json({
        data: seller,
        message: "Seller account status updated successfully",
      });
    } catch (error) {
      res.status(error instanceof Error ? 400 : 500).json({
        message: error.message || "Something went wrong",
      });
    }
  }
}

module.exports = new sellerController();
