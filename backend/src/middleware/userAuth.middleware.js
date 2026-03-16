const userService = require("../service/user.service");
const jwtProvider = require("../util/jwtProvider.util");

const userMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let email = jwtProvider.getEmailFromJWT(token);
    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(error instanceof Error ? 400 : 500)
      .json({ message: error.message });
  }
};

module.exports = userMiddleware;
