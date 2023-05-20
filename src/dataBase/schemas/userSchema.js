const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);
