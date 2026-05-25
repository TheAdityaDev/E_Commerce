require("dotenv/config.js");
const userModel = require("../model/User.model");
const bcrypt = require("bcrypt");
class dataInitializeService {
  async initializeAdminUser() {
    const adminMail = process.env.ADMIN_MAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const mobile = process.env.ADMIN_MOBILE;
    try {
      const isAdminExist = await userModel.findOne({ email: adminMail });

      const password = await bcrypt.hash(adminPassword, 10);

      if (!isAdminExist) {
        const adminUser = new userModel({
          name: "Aditya",
          email: adminMail,
          password: password,
          role: "admin",
          mobile: mobile,
        });
        await adminUser.save();
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new dataInitializeService();
