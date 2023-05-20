const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    no: {
      type: String,
      trim: true,
    },
    productName: {
      type: String,
      trim: true,
      required: true,
    },
    productCode: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    strength: {
      type: String,
      trim: true,
    },
    dosageForm: {
      type: String,
      trim: true,
    },
    packingForm: {
      type: String,
      trim: true,
    },
    packingDetails: {
      type: String,
      trim: true,
    },
    packingSize: {
      type: Number,
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    care_Yes_No: {
      type: String,
      trim: true,
    },
    salt: {
      type: String,
      trim: true,
    },
    saltGroup: {
      type: String,
      trim: true,
    },
    speciality: {
      type: String,
      trim: true,
    },
    condition: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    mrp: {
      type: Number,
      trim: true,
    },
    MRMEDPrice: {
      type: Number,
      trim: true,
    },
    tax_percent: {
      type: Number,
      trim: true,
    },
    prescription_Yes_No: {
      type: String,
      trim: true,
    },
    PAP_Yes_No: {
      type: String,
      trim: true,
    },
    PAPOffer: {
      type: String,
      trim: true,
    },
    countryOrigin: {
      type: String,
      trim: true,
    },
    imageURL: {
      type: String,
      trim: true,
    },
    ABCD: {
      type: String,
      trim: true,
    },
    HSN: {
      type: Number,
      trim: true,
    },
    stock: {
      type: String,
      trim: true,
    },
    coupon_Yes_No: {
      type: String,
      trim: true,
    },
    cash_Yes_No: {
      type: String,
      trim: true,
    },
    hidden_Yes_No: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);
