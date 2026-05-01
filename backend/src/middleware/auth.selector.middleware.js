const sellerService = require("../service/seller.service");
const userService = require("../service/user.service");
const jwtProvider = require("../util/jwtProvider.util");
const accountStatus = require("../domain/accoutStatus");

const authSelector = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const email = jwtProvider.getEmailFromJWT(token);

    // Try to find seller first
    const seller = await sellerService.getSellerByEmail(email);
    if (seller) {
      // block access for non-active accounts
      if (seller.accountStatus !== accountStatus.ACTIVE) {
        return res.status(403).json({
          message: "Seller account not active",
          accountStatus: seller.accountStatus,
        });
      }
      req.seller = seller;
      return next();
    }

    // Try to find user
    const user = await userService.findUserByEmail(email);
    if (user) {
      req.user = user;
      return next();
    }

    return res.status(404).json({ message: "Account not found" });
  } catch (error) {
    return res
      .status(error instanceof Error ? 400 : 500)
      .json({ message: error.message });
  }
};

module.exports = authSelector;
