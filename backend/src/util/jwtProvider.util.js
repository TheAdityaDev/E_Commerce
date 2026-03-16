const jwt = require('jsonwebtoken');

class jwtProvider {
  createJWT(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
  }

  verifyJWT(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  getEmailFromJWT(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded?.data?.email || decoded?.email || decoded.email;
    } catch (error) {
           throw new Error("Invalid credentials: " + error.message);
    }
  }

  decodeJWT(token) {
    return jwt.decode(token);
  }
  // refreshJWT(token) {
  //     return jwtProvider.refresh(token,process.env.JWT_SECRET,{expiresIn:'1h'})
  // }
}

module.exports = new jwtProvider(process.env.JWT_SECRET)