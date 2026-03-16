const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    locality:{
        type:String
    },
    city:{
        type:String
    },
    address:{
        type:String
    },
    state:{
        type:String
    },
    country:{
        type:String
    },
    pincode:{
        type:Number
    }

},{timestamps:true})

const addressModel = mongoose.model("Address", addressSchema);

module.exports = addressModel