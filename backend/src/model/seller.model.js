const mongoose = require("mongoose");
const userRole = require("../domain/user.role");
const accountStatus = require("../domain/accoutStatus");

const sellerSchema = new mongoose.Schema(
  {
    sellerName: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    businessDetails: {
      businessName: {
        type: String,
        required: true,
      },
      businessEmail: {
        type: String,
        required: true,
        unique: true,
      },
      businessPhone: {
        type: Number,
        required: true,
        unique: true,
      },
      businessAddress: {
        type: String,
      },
    },
    bankDetails: {
      accountNumber: {
        type: Number,
        required: true,
        unique: true,
      },
      accountHolderName: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
      IFSC_Code: {
        type: String,
        required: true,
      },
    },
    pickupDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    GSTIN: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: [userRole.SELLER],
      default: userRole.SELLER,
    },
    accountStatus: {
      type: String,
      enum: [
        accountStatus.ACTIVE,
        accountStatus.INACTIVE,
        accountStatus.PENDING_VERIFICATION,
        accountStatus.BLOCKED,
        accountStatus.CLOSED,
        accountStatus.SUSPENDED,
        accountStatus.BANNED,
      ],
      default: accountStatus.PENDING_VERIFICATION,
    },
  },
  { timestamps: true }
);

const SellerModel = mongoose.model("Seller", sellerSchema);


module.exports = SellerModel