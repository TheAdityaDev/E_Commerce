const userRole = require("../domain/user.role");
const verificationCodeModel = require("../model/verificatioCode.model");
const sellerService = require("../service/seller.service");
const generateOtp = require("../util/genereateotp.util");
const jwtProvider = require("../util/jwtProvider.util");

class sellerController {
  async getSellerProfile(req, res) {
    try {
      const profile = await req.seller;

      const jwt = req.headers.authorization.split(" ")[1] || req.cookies.jwt;
      const seller = await sellerService.getSellerProfile(jwt);

      if (!seller) {
        throw new Error("Seller not found");
      }
      res.status(200).json(seller);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async createSeller(req, res) {
    try {
      const seller = await sellerService.createSeller(req.body);

      res.status(201).json(seller, { message: "Seller created successfully" });
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async getAllSellers(req, res) {
    try {
      const status = req.query.status || "active";
      const sellers = await sellerService.getAllSellers(status);
      res.status(200).json(sellers);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async updateSeller(req, res) {
    try {
      const existingSeller = req.params.sellerId || req.seller;
      const seller = await sellerService.updateSeller(existingSeller, req.body);
      res
        .status(200)
        .json(seller, { message: "Seller profile updated successfully" });
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async deleteSeller(req, res) {
    try {
      const seller = await sellerService.deleteSeller(
        req.params.sellerId || req.seller
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
        req.body.status
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

      if (!email || !otp) {
        throw new Error("Email and OTP are required");
      }

      const seller = await sellerService.getSellerByEmail(email);
      if (!seller) {
        throw new Error("Seller not found");
      }

      const verificationCode = await verificationCodeModel.findOne({
        email,
      });
      console.log("otp", otp);

      if (!verificationCode) {
        throw new Error("OTP expired or not found");
      }

      const OTP_EXPIRY = 5 * 60 * 1000;
      if (Date.now() - verificationCode.createdAt.getTime() > OTP_EXPIRY) {
        await verificationCodeModel.deleteMany({ email: otpEmailKey });
        throw new Error("OTP expired");
      }


      await verificationCodeModel.deleteMany({ email });

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
      const seller = await sellerService.updateSellerStatus(
        req.params.sellerId || req.params.id || req.seller,
        req.body.status
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
}

module.exports = new sellerController();
