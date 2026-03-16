const sellerService = require("../service/seller.service");
const jwtProviderUtil = require("../util/jwtProvider.util");

const sellerMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization ;
       if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new Error("Unauthorized")
       }
       const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

       if(!token){
        return res.status(401).json({ message: "Unauthorized" });
       }

       let email = jwtProviderUtil.getEmailFromJWT(token)
       const seller = await sellerService.getSellerByEmail(email);
       if(!seller){
        throw new Error("Seller not found")
       }
        req.seller = seller;
        next();
    } catch (error) {
        res.status(error instanceof Error ? 400 : 500).json({ message: error.message });
    }
};


module.exports = sellerMiddleware;