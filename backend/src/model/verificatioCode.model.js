const mongoose = require('mongoose');


const verificationCodeSchema = new mongoose.Schema({
    otp:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})



const verificationCodeModel = mongoose.model('VerificationCode',verificationCodeSchema)


module.exports = verificationCodeModel