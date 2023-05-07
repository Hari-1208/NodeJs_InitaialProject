const Joi = require("joi");

const validate = (type, validatePart) => {
  switch (type) {
    case "POST_DATA_VALIDATE":
      const post_Schema = Joi.object({
        name: Joi.string().min(3).required(),
      });
      return post_Schema.validate(validatePart);
    case "UPDATE_DATA_VALIDATE":
      const upadte_Schema = Joi.object({
        name: Joi.string().min(3).required(),
      });
      return upadte_Schema.validate(validatePart);

    default:
      break;
  }
};

module.exports = validate;
