const multer = require("multer");
const express = require("express");
const productsRoutes = express.Router();

// multer storge for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/fileUploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//getting product controller
const { productController } = require("../controller");

//post method for add a new item
productsRoutes.post(
  "/api/bulkUpload",
  upload.single("xlxs"),
  productController.productsBulkUpload
);

module.exports = productsRoutes;
