const Joi = require("@hapi/joi");

const schema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  username: Joi.string().min(6).max(255).required(),
  password: Joi.string().min(6).max(1024).required(),
});

module.exports = schema;
