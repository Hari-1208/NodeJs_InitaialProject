const mongoose = require("mongoose");
const orderSchema = require("../schemas").order;

module.exports = mongoose.model("order", orderSchema);
