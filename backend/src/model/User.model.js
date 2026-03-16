const mongoose = require('mongoose');
const userRole = require('../domain/user.role');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  alternateNumber: {
    type: Number,
  },
  address:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Address",
  }],
  role:{
    type:String,
    enum:[userRole.CUSTOMER,userRole.ADMIN],
    default:userRole.CUSTOMER
  }
});

const userModel = mongoose.model("User",userSchema);

module.exports = userModel