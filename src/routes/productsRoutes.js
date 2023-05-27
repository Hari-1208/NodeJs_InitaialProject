const express = require("express");
const productsRoutes = express.Router();

//getting product controller
const { productController } = require("../controller");

//post method for add a new item
productsRoutes.post("/api/bulkUpload", productController.productsBulkUpload);

module.exports = productsRoutes;
