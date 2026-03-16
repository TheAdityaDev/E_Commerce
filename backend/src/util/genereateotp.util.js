  const crypto = require("crypto");

  class generateOtp {
    generateOtp = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    hashOtp = async (otp) => {
      return crypto
        .createHmac("sha256", process.env.OTP_SECRET)
        .update(otp)
        .digest("hex");
    };

  }

  module.exports = new generateOtp();
