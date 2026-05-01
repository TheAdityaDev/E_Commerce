const userRole = require("../domain/user.role");
const cartModel = require("../model/cart.model");
const SellerModel = require("../model/seller.model");
const userModel = require("../model/User.model");
const verificationCodeModel = require("../model/verificatioCode.model");
const generateOtp = require("../util/genereateotp.util");
const jwtProvider = require("../util/jwtProvider.util");
const sendEmail = require("../util/sendEmail.util");
const bcrypt = require("bcrypt");

class authService {
 async sendLoginOtp(email) {
  const SIGNIN_PREFIX = "signin_";

  // Remove prefix if exists
  if (email.startsWith(SIGNIN_PREFIX)) {
    email = email.slice(SIGNIN_PREFIX.length);
  }

  // Fetch seller and user at once
  const [seller, user] = await Promise.all([
    SellerModel.findOne({ email }).select("accountStatus"),
    userModel.findOne({ email }),
  ]);
  
  /* ************************************************************ */
  // Blocked statuses !important
  const blockedStatuses = [
    "INACTIVE",
    "PENDING_VERIFICATION",
    "BLOCKED",
    "CLOSED",
    "SUSPENDED",
    "BANNED",
    "REJECTED",
  ];

  // If seller exists and is blocked, prevent login completely
  if (seller && blockedStatuses.includes((seller.accountStatus).toUpperCase())) {
    throw new Error(
      `Seller account is ${seller.accountStatus.toLowerCase()}. Please contact support.`
    );
  }
  /* **************************************************************** */

  // ✅ From here, we only generate OTP for allowed accounts
  // Delete old OTP if exists
  const existingVerificationCode = await verificationCodeModel.findOne({ email });
  if (existingVerificationCode) await existingVerificationCode.deleteOne();

  // Generate new OTP
  const otp = generateOtp.generateOtp();
  const hashedOtp = await generateOtp.hashOtp(otp);
  console.log("OTP:",otp);
  

  // Save OTP
  await verificationCodeModel.create({
    email,
    otp: hashedOtp,
    createdAt: new Date(),
  });

  // Send OTP email asynchronously
  const subject = "Ram Bazar Login/Signup OTP";
  const body = `Your OTP is ${otp}. Please enter it to complete login process.`;

  setImmediate(() => {
    sendEmail(email, subject, body).catch((err) => console.error("Email error:", err));
  });

  return otp;
}

  async createUser(req) {
    const { email, password, mobile, alternateNumber, name } = req;

    let user = await userModel.findOne({ email });

    if (user) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await userModel.create({
      email,
      password: hashedPassword,
      mobile,
      alternateNumber,
      name,
      role: userRole.CUSTOMER,
    });
    await newUser.save();

    const cart = await cartModel.create({
      user: newUser._id,
    });
    await cart.save();

    return jwtProvider.createJWT({ email });
  }

  async signIn(req) {
    const { email, password, otp } = req;

    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("Invalid email and password");
    }

    if (!password || !user.password) {
      throw new Error("Invalid email and password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email and password");
    }

    const verificationCode = await verificationCodeModel.findOne({ email });
    if (!verificationCode) {
      throw new Error("Verification code not found");
    }

    const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes
    if (Date.now() - verificationCode.createdAt.getTime() > OTP_EXPIRY) {
      throw new Error("OTP expired");
    }

    if (!otp) {
      throw new Error("OTP missing");
    }

    const hashedInputOtp = await generateOtp.hashOtp(otp);
    if (hashedInputOtp !== verificationCode.otp) {
      throw new Error("Invalid OTP");
    }

    await verificationCode.deleteOne();

    const token = jwtProvider.createJWT({ email });

    return {
      message: "Login successful",
      token,
      role: user.role,
    };
  }

  async forgetPassword(email, password, otp) {
    // 1. Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // 2. Verify OTP
    const verificationCode = await verificationCodeModel.findOne({ email });
    if (!verificationCode) {
      throw new Error("OTP not found or has expired");
    }

    const isOtpValid = await generateOtp.hashOtp(otp, verificationCode.otp);
    if (!isOtpValid) {
      throw new Error("Invalid OTP");
    }

    // 3. Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // 4. Delete used OTP
    await verificationCode.deleteOne();

    return { message: "Password reset successfully" };
  }

  async verificationOTP(email, otp) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid email and password");
    }

    const verificationCode = await verificationCodeModel.findOne({ email });
    if (!verificationCode) {
      throw new Error("Verification code not found");
    }
    const hashedInputOtp = await generateOtp.hashOtp(otp);
    if (hashedInputOtp !== verificationCode.otp) {
      throw new Error("Invalid OTP");
    }

    await verificationCode.deleteOne();

    return { message: "OTP verified successfully" };
  }

  async resetPassword(password, tempToken) {
    try {
      // 1. Verify token
      const payload = jwtProvider.verifyJWT(tempToken, process.env.JWT_SECRET);

      if (!payload || !payload.email) {
        throw new Error("Invalid or expired token");
      }

      // 2. Find user by email from token
      const user = await userModel.findOne({ email: payload.email });

      if (!user) {
        throw new Error("User not found");
      }

      // 3. Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. Update password
      user.password = hashedPassword;
      await user.save();

      return { message: "Password reset successfully" };
    } catch (error) {
      throw new Error(error.message || "Reset failed");
    }
  }
}

module.exports = new authService();
