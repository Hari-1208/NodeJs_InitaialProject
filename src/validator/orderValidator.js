const Joi = require("joi");
//getting the models
const models = require("../dataBase/models");
//Getting schema collection
const orderSchema = models.order;
const addressSchema = models.address;
const userSchema = models.user;
const productsSchema = models.products;

class orderValidator {
  static createOrder = async (req, res, next) => {
    try {
      // initailize schema with joi
      const schema = Joi.object().keys({
        productIds: Joi.array().items(Joi.string()).required().min(1),
        userId: Joi.string().required(),
        addressId: Joi.string().required(),
        couponCode: Joi.number(),
        internalCash: Joi.number(),
      });

      const reqBody = req.body;
      //validate the schema with joi
      const { error } = schema.validate(reqBody);

      //if error occured return error
      if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        return res.status(400).json({ status: 400, error: message });
      }

      // check the user is exist
      const user = await userSchema.findById(reqBody.userId);
      if (!user)
        return res.status(404).json({
          status: 404,
          message: "user does not exist!",
        });

      //check the address exist for the user
      const address = await addressSchema.find({
        userId: reqBody.userId,
        _id: reqBody.addressId,
      });
      if (!Boolean(address) || address.length == 0)
        return res.status(404).send({
          status: 404,
          message: "Address with the given Id is not found for this user!",
        });

      //check the products is exist
      const productIdsArray = reqBody.productIds;
      for (let index = 0; index < productIdsArray.length; index++) {
        const element = productIdsArray[index];
        const product = await productsSchema.findById(element);
        if (!product)
          return res.status(404).json({
            status: 404,
            message: `Product with ID:${element} does not exist!`,
          });
      }

      // all the valdiation are completed... jumping to next handler
      return next();
    } catch (error) {
      res.status(422).json({ status: 422, error: error.message });
    }
  };

  static reOrder = async (req, res, next) => {
    try {
      // initailize schema with joi
      const schema = Joi.object().keys({
        orderId: Joi.string().required(),
        addtionalProductIds: Joi.array().items(Joi.string()),
        couponCode: Joi.number(),
        internalCash: Joi.number(),
      });

      const reqBody = req.body;

      //validate the schema with joi
      const { error } = schema.validate(reqBody);

      //if error occured return error
      if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        return res.status(400).json({ status: 400, error: message });
      }

      //check order is exist
      const order = await orderSchema.findById(reqBody.orderId);
      if (!order)
        return res.status(404).json({
          status: 404,
          message: "Order with the given Id does not exist!",
        });

      //check the products is exist
      if (
        Boolean(reqBody.addtionalProductIds) &&
        reqBody.addtionalProductIds.length > 0
      ) {
        const productIdsArray = reqBody.addtionalProductIds;
        for (let index = 0; index < productIdsArray.length; index++) {
          const element = productIdsArray[index];
          const product = await productsSchema.findById(element);
          if (!product)
            return res.status(404).json({
              status: 404,
              message: `Product with ID:${element} does not exist!`,
            });
        }
      }

      // all the valdiation are completed... jumping to next handler
      return next();
    } catch (error) {
      res.status(422).json({ status: 422, error: error.message });
    }
  };
}

module.exports = orderValidator;
