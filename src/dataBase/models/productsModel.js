const mongoose = require("mongoose");
const productsSchema = require("../schemas").products;

module.exports = mongoose.model("products", productsSchema);
