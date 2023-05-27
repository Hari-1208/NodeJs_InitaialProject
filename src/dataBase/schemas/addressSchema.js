const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    address: {
      addressLine1: {
        type: String,
        required: true,
        minlength: 3,
      },
      addressLine2: {
        type: String,
        required: true,
        minlength: 3,
      },
      state: {
        type: String,
        reuired: true,
      },
      city: {
        type: String,
        required: true,
      },
      postcode: {
        type: String,
        required: true,
        minlength: 6,
      },
      addressType: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);
