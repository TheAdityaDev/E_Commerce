const userService = require("../service/user.service");

class UserController {
  async getProfileByJwt(req, res) {
    try {
      const user = req.user;
  
      if (!user) {
        throw new Error("User not found.");
      }
  
      const { password, ...safeUser } = user._doc || user;
  
      return res.status(200).json(safeUser);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

  async getUserByEmail(req, res) {
    try {
      const { email } = req.query;
      const user = await userService.findUserByEmail(email);

      if (!user) {
        throw new Error("User not found.");
      }

      return res.status(200).json(user);
    } catch (error) {
      res
        .status(error instanceof Error ? 400 : 500)
        .json({ message: error.message });
    }
  }

   handleError = (error) => {
    try{
    return res.status(error instanceof Error ? 400 : 500).json({ message: error.message });
   } catch (error) {
    res
      .status(error instanceof Error ? 400 : 500)
      .json({ message: "Internal server error" });
  }
}
}

module.exports = new UserController()