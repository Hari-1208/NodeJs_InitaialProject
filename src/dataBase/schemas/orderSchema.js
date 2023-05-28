const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    productIds: {
      type: [Schema.Types.ObjectId],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    //address for the order
    addressDetails: {
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

    //order datas
    orderDetails: {
      orderTotal: {
        required: true,
        type: Number,
      },
      productsPrice: {
        required: true,
        type: Number,
      },
      discountPrice: {
        required: true,
        type: Number,
      },
      priceToCustomer: {
        required: true,
        type: Number,
      },
      deliveryCharge: {
        type: Number,
      },
      couponDiscount: {
        type: Number,
      },
      internalCashDiscount: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);
