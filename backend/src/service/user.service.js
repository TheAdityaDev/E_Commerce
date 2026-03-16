const userModel = require("../model/User.model");
const jwtProvider = require("../util/jwtProvider.util");

class UserService {
    async findUserByJwt(jwt){
        const email = jwtProvider.getEmailFromJWT(jwt);
        const user = await userModel.findOne({email});
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }

    async findUserByEmail(email){
        const user = await userModel.findOne({email});
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }
}

module.exports = new UserService()