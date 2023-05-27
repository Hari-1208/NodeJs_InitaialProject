const express = require("express");
const userRoutes = express.Router();

//getting controllers
const { userController, addressController } = require("../controller");

// send sample msg when entered
userRoutes.get("/", userController.initialPage);

//user routes ----------------------------
//get all datas in DB
userRoutes.get("/api/getData", userController.getAllUsers);
//get item by id
userRoutes.get("/api/getDataById", userController.getUserById);
//post method for add a new item
userRoutes.post("/api/addData", userController.addNewUser);
//PUT method to update a existing item
userRoutes.put("/api/updateData/:id", userController.updateUser);
// delete method to delete item by id
userRoutes.delete("/api/deleteData/:id", userController.deleteUser);

//address routes ----------------------------
//add new address for user
userRoutes.post("/api/address/addAdress", addressController.addNewAddress);
//get address by id
userRoutes.get(
  "/api/address/getAddressById/:id",
  addressController.getAddressById
);
//get address list for given user
userRoutes.get(
  "/api/address/getAddressListByUserId/:id",
  addressController.getAddressListByUserId
);

module.exports = userRoutes;
