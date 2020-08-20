const Joi = require("@hapi/joi");

const schema = Joi.object({
  topic: Joi.string().min(3).max(255).required(),
  detail: Joi.string().min(3).required()
});

module.exports = schema;
