const mongoose = require("mongoose");
const addressSchema = require("../schemas").address;

module.exports = mongoose.model("address", addressSchema);
