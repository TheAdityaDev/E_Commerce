const addressModel = require("../model/Address.model");
const SellerModel = require("../model/seller.model");
const jwtProvider = require("../util/jwtProvider.util");
const bcrypt = require('bcrypt');

class sellerService {
  async createSeller(sellerData) {
    const existingSeller = await SellerModel.findOne({
      email: sellerData.email,
    });
  
    if (existingSeller) {
      throw new Error("Seller already exists");
    }
  
    let savedAddress = null;
  
    if (sellerData.pickupDetails) {
      savedAddress = await addressModel.create({
        locality: sellerData.pickupDetails.locality,
        city: sellerData.pickupDetails.city,
        address: sellerData.pickupDetails.address,
        state: sellerData.pickupDetails.state,
        country: sellerData.pickupDetails.country,
        pincode: sellerData.pickupDetails.pincode,
      });
    }
  
    const hashedPassword = await bcrypt.hash(sellerData.password, 10);
  
    const newSeller = await SellerModel.create({
      sellerName: sellerData.sellerName,
      email: sellerData.email,
      password: hashedPassword,
      pickupDetails: savedAddress?._id,
      GSTIN: sellerData.GSTIN,
      businessDetails: sellerData.businessDetails,
      bankDetails: sellerData.bankDetails,
      mobile: sellerData.mobile,
    });
  
    return newSeller;
  }
  async getSellerProfile(jwt) {
    try {
      const email = jwtProvider.getEmailFromJWT(jwt);
      return await this.getSellerByEmail(email);
    } catch (error) {}
  }

  async getSellerByEmail(email) {
    try {
      const seller = await SellerModel.findOne({ email: email });
      if (!seller) {
        throw new Error("Seller not found");
      }
      return seller;
    } catch (error) {}
  }

  async getSellerById(id) {
    const seller = await SellerModel.findById(id);
    if (!seller) {
      throw new Error("Seller not found");
    }
  }

  async getAllSellers(status) {
    const sellers = await SellerModel.find({ accountStatus: status });
    if (!sellers) {
      throw new Error("No sellers found");
    }
    return sellers;
  }

  async updateSeller(existingSeller, sellerData) {
    return await SellerModel.findOneAndUpdate(existingSeller._id, sellerData, {
      new: true,
    });
  }

  async updateSellerStatus(sellerId, status) {
    return await SellerModel.findByIdAndUpdate(
      sellerId,
      { $set: { accountStatus: status } },
      { new: true }
    );
  }

  async deleteSeller(sellerId) {
    return await SellerModel.findByIdAndDelete(sellerId);
  }
}

module.exports = new sellerService({
  createSeller: sellerService.createSeller,
  getSellerProfile: sellerService.getSellerProfile,
  getSellerByEmail: sellerService.getSellerByEmail,
  getSellerById: sellerService.getSellerById,
  getAllSellers: sellerService.getAllSellers,
  updateSeller: sellerService.updateSeller,
  updateSellerStatus: sellerService.updateSellerStatus,
  deleteSeller: sellerService.deleteSeller,
});
