//getting the models
const models = require("../dataBase/models");
const excelJs = require("exceljs");

const { statusCodes, messages } = require("../configs");
const { sendMail } = require("../mailService");
const { ORDER_STATUS, Html } = require("../constants");

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

        //data for html content
        let htmlData = {
          title: "Node Email Service",
          name: user.name,
          subject: "Order placed succesfully",
          content: `Your order has been placed succesfully.Thanks for ordering!
           \nOrder Details:-
           \nOrder Id : ${createdOrder._id}
           \nOrder Total: ₹${orderDetails?.orderTotal || ""}
           \nProducts Price: ₹${orderDetails?.productsPrice || ""}
           \nDiscount Price: ₹${orderDetails?.discountPrice || ""}
           \nPrice To Customer: ₹${orderDetails?.priceToCustomer || ""}
           \n${
             Boolean(orderDetails?.couponDiscount)
               ? "Coupon Discount : ₹" + orderDetails?.couponDiscount
               : Boolean(orderDetails?.internalCashDiscount)
               ? "Internal Cash Applied : ₹" +
                 orderDetails?.internalCashDiscount
               : ""
           }`,
        };
        return {
          subject: "Order placed succesfully",
          to: user.emailId,
          html: Html(htmlData),
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

        //data for html content
        let htmlData = {
          title: "Node Email Service",
          name: user.name,
          subject: "Order placed succesfully",
          content: `Your order has been placed succesfully.Thanks for ordering!
           \nOrder Details:-
           \nOrder Id : ${createdOrder._id}
           \nOrder Total: ₹${orderDetails?.orderTotal || ""}
           \nProducts Price: ₹${orderDetails?.productsPrice || ""}
           \nDiscount Price: ₹${orderDetails?.discountPrice || ""}
           \nPrice To Customer: ₹${orderDetails?.priceToCustomer || ""}
           \n${
             Boolean(orderDetails?.couponDiscount)
               ? "Coupon Discount : ₹" + orderDetails?.couponDiscount
               : Boolean(orderDetails?.internalCashDiscount)
               ? "Internal Cash Applied : ₹" +
                 orderDetails?.internalCashDiscount
               : ""
           }`,
        };
        return {
          subject: "Order placed succesfully",
          to: user.emailId,
          html: Html(htmlData),
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
          texts.disc = `${commonPrefix} has been confirmed succesfully`;
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
          texts.disc = `${commonPrefix} is under processing will be verfied and shipped soon!`;
          break;
      }

      //data for html content
      let htmlData = {
        title: "Node Email Service",
        name: user.name,
        subject: `Order ${texts?.title?.toLowerCase() || ""}`,
        content: texts?.disc,
      };

      // update item
      orderSchema
        .findByIdAndUpdate(reqBody.orderId, newValues)
        .then(async (response) => {
          // sending mail to customer mail id
          const mailOptions = () => {
            return {
              subject: `Order ${texts?.title?.toLowerCase() || ""}`,
              to: user.emailId,
              html: Html(htmlData),
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

  static downloadOrderInfo = async (req, res, next) => {
    try {
      const reqBody = req.body;

      //order for given id
      const order = await orderSchema.findById(reqBody.orderId);

      // creating new workbook
      const workBook = new excelJs.Workbook();

      // creating sheet for product info
      const sheet = workBook.addWorksheet("Product_Info");
      //product info keys
      sheet.columns = [
        { header: "S_NO", key: "s_no", width: 10 },
        { header: "Product Name", key: "productName", width: 50 },
        { header: "Product Code", key: "productCode", width: 20 },
        { header: "Strength", key: "strength", width: 20 },
        { header: "Dosage Form", key: "dosageForm", width: 20 },
        { header: "Packing Form", key: "packingForm", width: 20 },
        { header: "Packing Details", key: "packingDetails", width: 50 },
        { header: "Packing Size", key: "packingSize", width: 20 },
        { header: "Weight", key: "weight", width: 20 },
        { header: "Care Yes/No", key: "care_Yes_No", width: 20 },
        { header: "Salt", key: "salt", width: 50 },
        { header: "Salt Group", key: "saltGroup", width: 50 },
        { header: "Speciality", key: "speciality", width: 50 },
        { header: "Condition", key: "condition", width: 50 },
        { header: "Manufacturer", key: "manufacturer", width: 50 },
        { header: "MRP", key: "mrp", width: 20 },
        { header: "MRMED Price", key: "MRMEDPrice", width: 20 },
        { header: "Tax Percent", key: "tax_percent", width: 20 },
        {
          header: "Prescription Yes/No",
          key: "prescription Yes/No",
          width: 20,
        },
        { header: "PAP Yes/No", key: "PAP_Yes_No", width: 20 },
        { header: "PAP Offer", key: "PAPOffer", width: 20 },
        { header: "Country Origin", key: "countryOrigin", width: 20 },
        { header: "Image URL", key: "imageURL", width: 50 },
        { header: "ABCD", key: "ABCD", width: 20 },
        { header: "HSN", key: "HSN", width: 20 },
        { header: "Stock", key: "stock", width: 20 },
        { header: "coupon Yes/No", key: "coupon_Yes_No", width: 20 },
        { header: "cash Yes/No", key: "cash_Yes_No", width: 20 },
        { header: "Hidden Yes/No", key: "hidden_Yes_No", width: 20 },
      ];

      for (let index = 0; index < order.productIds.length; index++) {
        const item = order.productIds[index];
        const product = await productsSchema.findById(item);
        product.s_no = index + 1;
        sheet.addRow(product);
      }
      sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      // creating sheet for order info
      const sheet2 = workBook.addWorksheet("Order_Info");
      let newOrderCloumns = [];
      //oder details key
      let orderDetailsKeys = Object.keys(order.orderDetails);
      orderDetailsKeys.map((item, index) => {
        if (Boolean(order?.orderDetails[item])) {
          let newObj = new Object();
          newObj.header = item?.toUpperCase();
          newObj.key = item;
          return newOrderCloumns.push(newObj);
        } else return;
      });
      sheet2.columns = newOrderCloumns;
      sheet2.addRow(order.orderDetails);
      sheet2.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment;filename=" + "orderInfo.xlsx"
      );

      // final response
      return workBook.xlsx.write(res);
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
