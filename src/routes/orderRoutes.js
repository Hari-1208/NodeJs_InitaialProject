const express = require("express");
const orderRoutes = express.Router();

//getting controllers
const { orderController } = require("../controller");

//validator instance----
let validator = require("express-joi-validation").createValidator({
  passError: true,
});

const orderValidator = require("../validator").order;

//order routes ------------------
//create order
orderRoutes.post(
  "/api/createOrder",
  validator.body(orderValidator.check),
  orderController.createOrder
);

module.exports = orderRoutes;
