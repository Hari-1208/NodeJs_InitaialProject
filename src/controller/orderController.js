//getting the models
const models = require("../dataBase/models");
//Getting schema collection
const orderSchema = models.order;
const addressSchema = models.address;
const userSchema = models.user;
const productsSchema = models.products;

class orderController {
  static createOrder = async (req, res, next) => {
    try {
      const reqBody = req.body;

      // getting address details for the user from address schema
      const address = await addressSchema.find({
        userId: reqBody.userId,
        _id: reqBody.addressId,
      });

      //calculations for order ---------------
      const productIdsArray = reqBody.productIds;

      //price details calculations
      const orderDetails = {
        orderTotal: 0,
        productsPrice: 0,
        discountPrice: 0,
        priceToCustomer: 0,
      };
      for (let index = 0; index < productIdsArray.length; index++) {
        const element = productIdsArray[index];
        const product = await productsSchema.findById(element);
        orderDetails.productsPrice += product?.mrp;
        orderDetails.priceToCustomer += product?.MRMEDPrice;
        orderDetails.orderTotal += product?.MRMEDPrice;
        orderDetails.discountPrice += product?.mrp - product?.MRMEDPrice;
      }

      // check for coupon code or internal cash applied
      if (Boolean(reqBody.couponCode) || Boolean(reqBody.internalCash)) {
        switch (true) {
          case Boolean(reqBody.couponCode):
            orderDetails.couponDiscount = reqBody.couponCode;
            orderDetails.orderTotal -= reqBody.couponCode;
            break;

          case Boolean(reqBody.internalCash):
            orderDetails.internalCashDiscount = reqBody.internalCash;
            orderDetails.orderTotal -= reqBody.internalCash;
            break;

          default:
            break;
        }
      }

      // create order
      const newOrder = {
        userId: reqBody.userId,
        productIds: reqBody.productIds,
        addressDetails: address[0].address,
        orderDetails: orderDetails,
      };

      const createdOrder = await orderSchema.create(newOrder);
      const user = await userSchema.findById(reqBody.userId);
      return res.status(200).send({
        status: 200,
        message: `Hi ${user.name}, your order has been created succesfully.`,
        data: createdOrder,
      });
    } catch (err) {
      res.status(400).send({
        status: 400,
        message: "Bad Request",
        data: err.message,
      });
    }
  };

  static reOrder = async (req, res, next) => {
    try {
      const reqBody = req.body;

      // get order
      const order = await orderSchema.findById(reqBody.orderId);

      // calculation for re-order -------------------
      //combine productIds if addtionaly added
      const temp = [
        ...order.productIds.map((i) => String(i)),
        ...(reqBody.addtionalProductIds || []),
      ];

      //remove dupliacte ids if exist
      const productIdsArray = [...new Set(temp)];

      //price details calculations
      const orderDetails = {
        orderTotal: 0,
        productsPrice: 0,
        discountPrice: 0,
        priceToCustomer: 0,
      };
      for (let index = 0; index < productIdsArray.length; index++) {
        const element = productIdsArray[index];
        const product = await productsSchema.findById(element);
        orderDetails.productsPrice += product?.mrp;
        orderDetails.priceToCustomer += product?.MRMEDPrice;
        orderDetails.orderTotal += product?.MRMEDPrice;
        orderDetails.discountPrice += product?.mrp - product?.MRMEDPrice;
      }

      // check for coupon code or internal cash applied
      if (Boolean(reqBody.couponCode) || Boolean(reqBody.internalCash)) {
        switch (true) {
          case Boolean(reqBody.couponCode):
            orderDetails.couponDiscount = reqBody.couponCode;
            orderDetails.orderTotal -= reqBody.couponCode;
            break;

          case Boolean(reqBody.internalCash):
            orderDetails.internalCashDiscount = reqBody.internalCash;
            orderDetails.orderTotal -= reqBody.internalCash;
            break;

          default:
            break;
        }
      }

      // new order
      const newOrder = {
        userId: order.userId,
        productIds: productIdsArray,
        addressDetails: order.addressDetails,
        orderDetails: orderDetails,
      };
      const createdOrder = await orderSchema.create(newOrder);
      const user = await userSchema.findById(order.userId);
      return res.status(200).send({
        status: 200,
        message: `Hi ${user.name}, your order has been created succesfully.`,
        data: createdOrder,
      });
    } catch (err) {
      res.status(400).send({
        status: 400,
        message: "Bad Request",
        data: err.message,
      });
    }
  };
}

module.exports = orderController;
