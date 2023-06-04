//getting the models
const models = require("../dataBase/models");

const { statusCodes, messages } = require("../configs");
const { sendMail } = require("../mailService");
const { ORDER_STATUS } = require("../constants");

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
        orderStatus: "PLACED",
      };

      const createdOrder = await orderSchema.create(newOrder);
      const user = await userSchema.findById(reqBody.userId);

      // sending mail to customer mail id
      const mailOptions = () => {
        let orderDetails = createdOrder.orderDetails;
        return {
          subject: "Order placed succesfully",
          to: user.emailId,
          text: `Hi ${user.name},
           Your order has been placed succesfully.Thanks for ordering!
           
           Order Details:-
           Order Id : ${createdOrder._id}
           Order Total: ₹${orderDetails?.orderTotal || ""}
           Products Price: ₹${orderDetails?.productsPrice || ""}
           Discount Price: ₹${orderDetails?.discountPrice || ""}
           Price To Customer: ₹${orderDetails?.priceToCustomer || ""}
           ${
             Boolean(orderDetails?.couponDiscount)
               ? "Coupon Discount : ₹" + orderDetails?.couponDiscount
               : Boolean(orderDetails?.internalCashDiscount)
               ? "Internal Cash Applied : ₹" +
                 orderDetails?.internalCashDiscount
               : ""
           }`,
        };
      };
      const sendMailResponce = await sendMail(mailOptions());

      return res.status(statusCodes.HTTP_OK).send({
        status: statusCodes.HTTP_OK,
        message: `Hi ${user.name}, your order has been placed succesfully.`,
        data: createdOrder,
      });
    } catch (err) {
      res.status(statusCodes.HTTP_BAD_REQUEST).send({
        status: statusCodes.HTTP_BAD_REQUEST,
        message: messages[400],
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
        orderStatus: "PLACED",
      };
      const createdOrder = await orderSchema.create(newOrder);
      const user = await userSchema.findById(order.userId);

      // sending mail to customer mail id
      const mailOptions = () => {
        let orderDetails = createdOrder.orderDetails;
        return {
          subject: "Order placed succesfully",
          to: user.emailId,
          text: `Hi ${user.name},
           Your order has been placed succesfully.Thanks for ordering!
           
           Order Details:-
           Order Id : ${createdOrder._id}
           Order Total: ₹${orderDetails?.orderTotal || ""}
           Products Price: ₹${orderDetails?.productsPrice || ""}
           Discount Price: ₹${orderDetails?.discountPrice || ""}
           Price To Customer: ₹${orderDetails?.priceToCustomer || ""}
           ${
             Boolean(orderDetails?.couponDiscount)
               ? "Coupon Discount : ₹" + orderDetails?.couponDiscount
               : Boolean(orderDetails?.internalCashDiscount)
               ? "Internal Cash Applied : ₹" +
                 orderDetails?.internalCashDiscount
               : ""
           }`,
        };
      };
      const sendMailResponce = await sendMail(mailOptions());

      return res.status(statusCodes.HTTP_OK).send({
        status: statusCodes.HTTP_OK,
        message: `Hi ${user.name}, your order has been placed succesfully.`,
        data: createdOrder,
      });
    } catch (err) {
      res.status(statusCodes.HTTP_BAD_REQUEST).send({
        status: statusCodes.HTTP_BAD_REQUEST,
        message: messages[400],
        data: err.message,
      });
    }
  };

  static updateOrderStatus = async (req, res, next) => {
    try {
      const reqBody = req.body;

      // get the order and user data for the passed id
      const order = await orderSchema.findById(reqBody.orderId);
      const user = await userSchema.findById(order.userId);

      // new datas to update the order
      const newValues = {
        orderStatus: reqBody.orderStatus,
      };

      // order status texts and updates
      const texts = {};
      const commonPrefix = `Your order of order id "${order._id}"`;
      switch (reqBody.orderStatus) {
        case ORDER_STATUS[0]:
          newValues.confirmedAt = new Date();
          texts.title = reqBody.orderStatus;
          texts.disc = `${commonPrefix} has been confirmed succesfully.`;
          break;
        case ORDER_STATUS[1]:
          newValues.shippedAt = new Date();
          texts.title = "shipped";
          texts.disc = `${commonPrefix} has been shipped succesfully will be delivered soon!`;
          break;
        case ORDER_STATUS[2]:
          newValues.deliveredAt = new Date();
          texts.title = reqBody.orderStatus;
          texts.disc = `${commonPrefix} has been delivered succesfully.\n Thanks for ordering and continue shopping with us!`;
          break;
        case ORDER_STATUS[3]:
          newValues.processingStartedAt = new Date();
          texts.title = reqBody.orderStatus;
          texts.disc = `${commonPrefix} is under processing will be verfied and shipped soon!.`;
          break;
      }

      // update item
      orderSchema
        .findByIdAndUpdate(reqBody.orderId, newValues)
        .then(async (response) => {
          // sending mail to customer mail id
          const mailOptions = () => {
            return {
              subject: `Order ${texts?.title?.toLowerCase() || ""}`,
              to: user.emailId,
              text: `Hi ${user.name},
              ${texts?.disc || ""}`,
            };
          };
          const sendMailResponce = await sendMail(mailOptions());

          return res.status(statusCodes.HTTP_OK).send({
            status: statusCodes.HTTP_OK,
            message: messages.orderStatusUpdated,
          });
        })
        .catch((err) => {
          if (err) {
            return res.status(statusCodes.HTTP_BAD_REQUEST).send({
              message: "error",
              data: err,
            });
          }
        });
    } catch (err) {
      res.status(statusCodes.HTTP_BAD_REQUEST).send({
        status: statusCodes.HTTP_BAD_REQUEST,
        message: messages[400],
        data: err.message,
      });
    }
  };
}

module.exports = orderController;
