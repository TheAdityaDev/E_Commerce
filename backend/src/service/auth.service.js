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
    if (
      seller &&
      blockedStatuses.includes(seller.accountStatus.toUpperCase())
    ) {
      throw new Error(
        `Seller account is ${seller.accountStatus.toLowerCase()}. Please contact support.`,
      );
    }
    /* **************************************************************** */

    // ✅ From here, we only generate OTP for allowed accounts
    // Delete old OTP if exists
    const existingVerificationCode = await verificationCodeModel.findOne({
      email,
    });
    if (existingVerificationCode) await existingVerificationCode.deleteOne();

    // Generate new OTP
    const otp = generateOtp.generateOtp();
    const hashedOtp = await generateOtp.hashOtp(otp);

    // Save OTP
    await verificationCodeModel.create({
      email,
      otp: hashedOtp,
      createdAt: new Date(),
    });

    // Send OTP email asynchronously
    const subject = "Ram Mart Login/Signup OTP";

    const htmlBody = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <style> body{ margin:0; padding:0; background:#0f172a; font-family:Arial,sans-serif; } .container{ width:100%; padding:40px 0; background:linear-gradient(135deg,#0f172a,#111827,#1e293b); } .card{ width:420px; margin:auto; background:rgba(255,255,255,0.08); backdrop-filter:blur(12px); border-radius:24px; overflow:hidden; border:1px solid rgba(255,255,255,0.12); box-shadow:0 10px 40px rgba(0,0,0,0.4); } .header{ padding:40px 30px; text-align:center; background:linear-gradient(135deg,#ff6b00,#ff3d00); } .logo{ font-size:34px; font-weight:bold; color:#fff; letter-spacing:1px; margin:0; } .subtitle{ color:#ffe0d1; font-size:14px; margin-top:10px; } .content{ padding:40px 30px; text-align:center; color:white; } .title{ font-size:28px; font-weight:bold; margin-bottom:16px; color:#fff; } .desc{ color:#cbd5e1; font-size:15px; line-height:26px; } .otp-box{ margin:35px 0; padding:22px; border-radius:20px; background:linear-gradient(135deg,#1e293b,#334155); border:1px solid rgba(255,255,255,0.1); box-shadow: 0 0 20px rgba(255,115,0,0.35), inset 0 0 12px rgba(255,255,255,0.04); } .otp{ font-size:42px; letter-spacing:12px; font-weight:bold; color:#ff7b00; } .warning{ color:#94a3b8; font-size:13px; line-height:22px; } .button{ display:inline-block; margin-top:25px; padding:14px 28px; border-radius:12px; background:linear-gradient(135deg,#ff6b00,#ff3d00); color:#fff !important; text-decoration:none; font-weight:bold; font-size:15px; box-shadow:0 6px 20px rgba(255,107,0,0.4); } .footer{ text-align:center; padding:25px; color:#94a3b8; font-size:12px; border-top:1px solid rgba(255,255,255,0.08); } @media only screen and (max-width:600px){ .card{ width:92% !important; } .otp{ font-size:34px !important; letter-spacing:8px !important; } } </style> </head> <body> <div class="container"> <div class="card"> <!-- HEADER --> <div class="header"> <h1 class="logo">🛒 Ram Mart</h1> <div class="subtitle"> Secure Login Verification </div> </div> <!-- CONTENT --> <div class="content"> <div class="title"> Verify Your Login </div> <div class="desc"> Use the verification code below to complete your login/signup process. This OTP will expire in 10 minutes. </div> <!-- OTP BOX --> <div class="otp-box"> <div class="otp">${otp}</div> </div><div class="warning"> If you didn’t request this verification code, you can safely ignore this email. </div> </div> <!-- FOOTER --> <div class="footer"> © 2026 Ram Mart • Secure Authentication System </div> </div> </div> </body> </html>`;

    setImmediate(() => {
      sendEmail(email, subject, htmlBody).catch(() => {});
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
