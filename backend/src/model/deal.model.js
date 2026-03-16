const mongoose = require('mongoose');


const dealSchema = new mongoose.Schema({
  discount: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HomeCategory",
    required: true,
  },
});


const dealModel = mongoose.model("Deal",dealSchema);

module.exports = dealModel;