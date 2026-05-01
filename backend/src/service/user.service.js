const userModel = require("../model/User.model");
const jwtProvider = require("../util/jwtProvider.util");

class UserService {
  async findUserByJwt(jwt) {
    const email = jwtProvider.getEmailFromJWT(jwt);
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async findUserByEmail(email) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserAddress(userId) {
    const user = await userModel.findById(userId).populate("address");
    return user?.address || "No address found.";
  }

  async updateUserDetails(userId, updateData) {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User Not Found..");
    }
    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        {
          name: updateData.name ?? user.name,
          email: updateData.email ?? user.email,
          mobile: updateData.mobile ?? user.mobile,
          alternateNumber: updateData.alternateNumber ?? user.alternateNumber,
          address: updateData.address ?? user.address,
        },
        { new: true }, // ✅ better than returnDocument
      )
      .select("-password -__v -role"); // ❌ remove sensitive fields
    return updatedUser;
  }
}

module.exports = new UserService();
