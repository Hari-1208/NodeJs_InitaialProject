const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
      minlength: 10,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
