const express = require("express");
const orderRoutes = express.Router();

//getting controllers
const { orderController } = require("../controller");

//getting validators
const { orderValidator } = require("../validator");

//order routes ------------------
//create order
orderRoutes.post(
  "/api/createOrder",
  orderValidator.createOrder,
  orderController.createOrder
);
//reorder order
orderRoutes.post(
  "/api/reOrder",
  orderValidator.reOrder,
  orderController.reOrder
);
//update order status from admin
orderRoutes.put(
  "/api/admin/updateOrderStatus",
  orderValidator.updateOrderStatus,
  orderController.updateOrderStatus
);

module.exports = orderRoutes;
