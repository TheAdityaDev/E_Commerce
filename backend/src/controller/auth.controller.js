const userRole = require("../domain/user.role");
const authService = require("../service/auth.service");

class AuthController {
  async sendLoginOtp(req, res) {
    try {
      const email = req.body.email;
      
      await authService.sendLoginOtp(email);
      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async CreateUser(req , res) {
    try {
      const jwt = await authService.createUser(req.body);      

      const response = {
        jwt,
        user: userRole.CUSTOMER,
        message: "User created successfully" // This line is causing the error.
      };
      return res.status(200).json(response);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async signInUser(req, res) {
    try {
      const response = await authService.signIn(req.body);

      return res.status(200).json(response);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async forgetPassword(req, res) {
    try {
      const response = await authService.forgetPassword(req.body.email , req.body.password);
      return res.status(200).json(response);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async resetPassword(req,res){
    try {
      const { email, password, token } = req.body;
      const response = await authService.resetPassword(email, password, token);
      return res.status(200).json(response);
    } catch (error) {
      res
      .status(error instanceof Error ? 400 : 500)
      .json({ message: error.message });
    }
  }

  async verificationOTP(req,res){
    try {
      const { email, otp } = req.body;
      const response = await authService.verificationOTP(email, otp);
      return res.status(200).json(response);
    } catch (error) {
      res
      .status(error instanceof Error ? 400 : 500)
      .json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
