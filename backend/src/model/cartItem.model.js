const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cart",
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    },
    mrpPrice:{
        type:Number,
        required:true
    },
    sellingPrice:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
})


const cartItemModel = mongoose.model("cartItem",cartItemSchema)

module.exports = cartItemModel